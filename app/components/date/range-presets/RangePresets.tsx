import { FormState } from "~/components/currencies/currencyFormReducer";
import styles from "./style.module.css";

export function RangePresets({
  selected,
  setRange,
}: {
  selected?: FormState["range"];
  setRange: (range: FormState["range"]) => void;
}) {
  return (
    <div className={styles.rangePresets}>
      <fieldset className={styles.fieldset}>
        <label>
          1W
          <input
            type="radio"
            value="1w"
            name="date-range"
            checked={selected === "1w"}
            onChange={() => setRange("1w")}
          />
        </label>
        <label>
          1M
          <input
            type="radio"
            value="1m"
            name="date-range"
            checked={selected === "1m"}
            onChange={() => setRange("1m")}
          />
        </label>
        <label>
          6M
          <input
            type="radio"
            value="6m"
            name="date-range"
            checked={selected === "6m"}
            onChange={() => setRange("6m")}
          />
        </label>
      </fieldset>
    </div>
  );
}
