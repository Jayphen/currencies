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
import { useCurrencyForm } from "~/components/currencies/currencyFormReducer";
import styles from "./_layout.module.css";
import { LineChart } from "~/components/chart/line-chart/LineChart";
import { RangePresets } from "~/components/date/RangePresets";
import { getDateBeforeToday, getRangeFromUrl } from "~/server/dateRange.server";
import { cache } from "~/server/cache.server";
import { getCurrenciesFromUrl } from "~/server/currencies.server";
import { ApiResult, LoaderResponse, mapDtoToResponse } from "~/server/mapDto";
import { CurrencySelector } from "~/components/currencies/CurrencySelector";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix! Using Vite and Cloudflare!",
    },
  ];
};

const API_BASE_URL = "https://api.frankfurter.app/";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const { from, to } = getCurrenciesFromUrl(url);
  const range = getRangeFromUrl(url);

  const key = `${from}:${to}:${range}`;

  try {
    if (from && to && cache.has(key)) {
      // We have a cache hit, skip the fetch
      return json(cache.get(key) as LoaderResponse);
    }

    const result = await fetch(
      API_BASE_URL + `${getDateBeforeToday(range)}?from=${from}&to=${to}`
    );

    if (result.status === 404) {
      // The API returns a 404 when comparing EUR to EUR for instance
      return json<Partial<LoaderResponse>>(
        {
          error:
            "Cannot compare currency with itself. Please choose a different currency pair.",
        },
        { status: 400 }
      );
    }

    let data: ApiResult = await result.json();

    const response = mapDtoToResponse(data, to);

    cache.set(key, response);

    return json(response);
  } catch (e) {
    throw json({ error: "Error fetching data" }, { status: 500 });
  }
}

type LoaderType = Awaited<typeof loader>;

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher<LoaderType>();
  const data = useLoaderData<LoaderType>();

  const {
    formState,
    currencyMap,
    setRange,
    currencies,
    setCurrency,
    swapCurrencies,
  } = useCurrencyForm(searchParams);

  const ref = useRef(null);

  useEffect(() => {
    const { to, from, range } = formState;
    // Whenever our form state is updated, submit the form. As this is a GET form,
    // this will update the search params and cause a refetch.
    // The form submission will also work with JS disabled
    if (ref.current) {
      fetcher.submit(ref.current);
      setSearchParams({ to, from, range }, { replace: true });
    }
  }, [formState]);

  return (
    <main className={styles.container}>
      <fetcher.Form method="GET" ref={ref} id="currency-form">
        <CurrencySelector
          formState={formState}
          currencies={currencies}
          swapCurrencies={swapCurrencies}
          setCurrency={setCurrency}
        />

        {data.movement && (
          <ChartHeader
            from={currencyMap.get(formState.from)!}
            to={currencyMap.get(formState.to)!}
            movement={data.movement}
          />
        )}
        <RangePresets selected={formState.range} setRange={setRange} />

        <noscript>
          <button type="submit">Submit</button>
        </noscript>
      </fetcher.Form>
      {data.rates && <LineChart data={data.rates} />}
      {data.error && <div className={styles.error}>{data.error}</div>}
    </main>
  );
}
