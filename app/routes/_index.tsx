import type { MetaFunction } from "@remix-run/cloudflare";
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

export default function Index() {
  const { formState, currencies, setCurrency, swapCurrencies } =
    useCurrencyForm();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <form>
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
      </form>
    </div>
  );
}
