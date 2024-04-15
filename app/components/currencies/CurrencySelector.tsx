import { CurrencySelect } from "./CurrencySelect";
import { useCurrencyForm } from "./currencyFormReducer";

type Props = Omit<
  ReturnType<typeof useCurrencyForm>,
  "currencyMap" | "setRange"
>;

export function CurrencySelector(props: Props) {
  const { currencies, setCurrency, formState, swapCurrencies } = props;

  return (
    <>
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
    </>
  );
}
