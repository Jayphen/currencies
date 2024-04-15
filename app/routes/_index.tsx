import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/cloudflare";
import {
  json,
  useFetcher,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import { CurrencySelect } from "~/components/currencies/CurrencySelect";
import { useCurrencyForm } from "~/components/currencies/currencyFormReducer";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix! Using Vite and Cloudflare!",
    },
  ];
};

const API_BASE_URL = "https://api.frankfurter.app/latest";

// in a real application we would use Redis or similar
let cache = new Map();

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  console.log(from, to);
  if (!from || !to) return null;

  const key = `${from}:${to}`;

  try {
    if (from && to && cache.has(key)) {
      // We have a cache hit, skip the fetch
      console.log("HIT!");
      return cache.get(key);
    }

    const result = await fetch(API_BASE_URL + `?from=${from}&to=${to}`);

    if (result.status === 404) {
      // The API returns a 404 when comparing EUR to EUR for instance
      return json(
        { error: "Cannot compare currency with itself" },
        { status: 400 }
      );
    }

    const data = await result.json();

    cache.set(key, data);

    return data;
  } catch (e) {
    return json({ error: "Error fetching data" }, { status: 500 });
  }
}

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  // Our data may come from LoaderData (in case of a normal form submission)
  // or the fetcher (in case of a JS submission)
  const fetcher = useFetcher();
  let data = useLoaderData();
  data ??= fetcher.data;

  const { formState, currencies, setCurrency, swapCurrencies } =
    useCurrencyForm(searchParams);
  const ref = useRef(null);

  useEffect(() => {
    // Whenever our form state is updated, submit the form. As this is a GET form,
    // this will update the search params and cause a refetch.
    // The form submission will also work with JS disabled
    if (ref.current) {
      fetcher.submit(ref.current);
      setSearchParams({});
    }
  }, [formState]);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <fetcher.Form method="GET" ref={ref}>
        <CurrencySelect
          currencies={currencies}
          selectName="from"
          onChange={(code) => setCurrency({ code, position: "from" })}
          value={formState.from}
        />
        <button type="button" onClick={swapCurrencies}>
          Swap
        </button>
        <CurrencySelect
          currencies={currencies}
          selectName="to"
          onChange={(code: string) => setCurrency({ code, position: "to" })}
          value={formState.to}
        />
        <noscript>
          <button type="submit">Submit</button>
        </noscript>
      </fetcher.Form>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
