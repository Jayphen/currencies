import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import {
  json,
  useFetcher,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import { ChartHeader } from "~/components/chart/header/ChartHeader";
import { CurrencySelect } from "~/components/currencies/CurrencySelect";
import {
  formInitialState,
  useCurrencyForm,
} from "~/components/currencies/currencyFormReducer";
import styles from "./_layout.module.css";

interface ApiResult {
  amount: number;
  start_date: string;
  end_date: string;
  rates: Record<string, Record<string, number>>;
}

interface LoaderResponse extends ApiResult {
  movement: {
    value: number;
    direction: "gain" | "loss";
  };
  error?: string;
}

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix! Using Vite and Cloudflare!",
    },
  ];
};

const API_BASE_URL = "https://api.frankfurter.app/2024-03-01..2024-03-31";

// in a real application we would use Redis or similar
let cache = new Map();

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  let from = url.searchParams.get("from") || formInitialState.from;
  let to = url.searchParams.get("to") || formInitialState.to;

  const key = `${from}:${to}`;

  try {
    if (from && to && cache.has(key)) {
      // We have a cache hit, skip the fetch
      console.log("HIT!");
      return json(cache.get(key) as LoaderResponse);
    }

    const result = await fetch(API_BASE_URL + `?from=${from}&to=${to}`);

    if (result.status === 404) {
      // The API returns a 404 when comparing EUR to EUR for instance
      return json<Partial<LoaderResponse>>(
        { error: "Cannot compare currency with itself" },
        { status: 400 }
      );
    }

    let data: ApiResult = await result.json();

    const movement =
      ((data.rates[data.end_date][to] - data.rates[data.start_date][to]) /
        data.rates[data.start_date][to]) *
      100;

    const direction = movement >= 0 ? "gain" : "loss";

    const response: LoaderResponse = {
      ...data,
      movement: { value: roundToTwoDecimalPlaces(movement), direction },
    };

    cache.set(key, response);

    return json(response);
  } catch (e) {
    throw json({ error: "Error fetching data" }, { status: 500 });
  }
}

function roundToTwoDecimalPlaces(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

type LoaderType = Awaited<typeof loader>;

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher<LoaderType>();
  const data = useLoaderData<LoaderType>();

  const { formState, currencies, currencyMap, setCurrency, swapCurrencies } =
    useCurrencyForm(searchParams);
  const ref = useRef(null);

  useEffect(() => {
    // Whenever our form state is updated, submit the form. As this is a GET form,
    // this will update the search params and cause a refetch.
    // The form submission will also work with JS disabled
    if (ref.current) {
      fetcher.submit(ref.current);
      setSearchParams(
        { from: formState.from, to: formState.to },
        { replace: true }
      );
    }
  }, [formState]);

  return (
    <main className={styles.container}>
      <fetcher.Form method="GET" ref={ref}>
        <CurrencySelect
          currencies={currencies}
          selectName="from"
          onChange={(code) => setCurrency({ code, position: "from" })}
          value={formState.from}
          label="From"
        />
        <button
          type="button"
          onClick={swapCurrencies}
          aria-label="Swap currencies"
        ></button>
        <CurrencySelect
          currencies={currencies}
          selectName="to"
          onChange={(code: string) => setCurrency({ code, position: "to" })}
          value={formState.to}
          label="To"
        />
        <noscript>
          <button type="submit">Submit</button>
        </noscript>
      </fetcher.Form>
      {data.movement && (
        <ChartHeader
          from={currencyMap.get(formState.from)!}
          to={currencyMap.get(formState.to)!}
          movement={data.movement}
        />
      )}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
