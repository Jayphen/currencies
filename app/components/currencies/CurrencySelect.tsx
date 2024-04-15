import { Currency } from "./currencyFormReducer";

export function CurrencySelect({
  currencies,
  selectName,
  onChange,
  value,
}: {
  currencies: Currency[];
  selectName: string;
  onChange: (code: string) => void;
  value: string;
}) {
  return (
    <select
      name={selectName}
      onChange={(e) => onChange(e.currentTarget.value)}
      value={value}
    >
      {currencies.map((currency) => {
        return (
          <option value={currency.currencyCode} key={currency.currencyCode}>
            {currency.flag} {currency.currencyCode} -{" "}
            <span>{currency.name}</span>
          </option>
        );
      })}
    </select>
  );
}
