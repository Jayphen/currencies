import { Currency } from "./currencyFormReducer";
import styles from "./style.module.css";

export function CurrencySelect({
  currencies,
  selectName,
  onChange,
  value,
  label,
}: {
  currencies: Currency[];
  selectName: string;
  onChange: (code: string) => void;
  value: string;
  label: string;
}) {
  return (
    <div className={styles.container}>
      <label htmlFor={`${selectName}-currency`}>{label}</label>
      <select
        name={selectName}
        onChange={(e) => onChange(e.currentTarget.value)}
        value={value}
        id={`${selectName}-currency`}
      >
        {currencies.map((currency) => {
          return (
            <option value={currency.currencyCode} key={currency.currencyCode}>
              {currency.flag} {currency.currencyCode} - {currency.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}
