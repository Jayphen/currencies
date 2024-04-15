import { Currency } from "~/components/currencies/currencyFormReducer";
import styles from "./style.module.css";

export function ChartHeader({
  from,
  to,
  movement,
}: {
  from: Currency;
  to: Currency;
  movement: { value: number; direction: "gain" | "loss" };
}) {
  return (
    <header>
      <h2>
        <span>
          {from.currencyCode} to {to.currencyCode} Chart
        </span>
        <span
          className={styles.movement}
          data-movement-direction={movement.direction}
        >
          {movement.value}%
        </span>
      </h2>
      <p className={styles["currency-full"]}>
        {from.name} to {to.name}
      </p>
    </header>
  );
}
