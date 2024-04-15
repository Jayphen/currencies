import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import {
  json,
  useFetcher,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import { ChartHeader } from "~/components/chart/header/ChartHeader";
import { useCurrencyForm } from "~/components/currencies/currencyFormReducer";
import styles from "./_layout.module.css";
import { LineChart } from "~/components/chart/line-chart/LineChart";
import { getRangeFromUrl } from "~/server/dateRange";
import { cache } from "~/server/cache.server";
import { getCurrenciesFromUrl } from "~/server/currencies.server";
import { CurrencySelector } from "~/components/currencies/CurrencySelector";
import { DateRange, FrankfurterApi, Period } from "~/server/txService.server";
import { LoaderResponse, mapDtoToResponse } from "~/server/mapDto.server";
import { DatePicker } from "~/components/date/date-picker/DatePicker";
import { RangePresets } from "~/components/date/range-presets/RangePresets";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix! Using Vite and Cloudflare!",
    },
  ];
};

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

    const txService = new FrankfurterApi();

    const result = range.includes("..")
      ? await txService.getRangeExchangeRates(range as DateRange, from, to)
      : await txService.getRecentExchangeRates(range as Period, from, to);

    if (!result.ok) {
      // The API returns a 404 when comparing EUR to EUR for instance
      return json<Partial<LoaderResponse>>(
        {
          error: result.error.message,
        },
        { status: 400 }
      );
    }

    const response = mapDtoToResponse(result.value, to);

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

        <div className={styles.period}>
          <RangePresets selected={formState.range} setRange={setRange} />

          <DatePicker setRange={setRange} selectedRange={formState.range} />
        </div>

        <noscript>
          <button type="submit">Submit</button>
        </noscript>
      </fetcher.Form>
      {data.rates && <LineChart data={data.rates} />}
      {data.error && <div className={styles.error}>{data.error}</div>}
    </main>
  );
}
