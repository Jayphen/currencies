import { useState } from "react";
import styles from "./style.module.css";
import { FormState } from "~/components/currencies/currencyFormReducer";
import { getDateBeforeToday } from "~/server/dateRange";

export function DatePicker({
  selectedRange,
  setRange,
}: {
  selectedRange?: FormState["range"];
  setRange: (range: FormState["range"]) => void;
}) {
  const today = new Date().toISOString().split("T")[0];
  let rangeEnd = today;
  let rangeStart = selectedRange
    ? getDateBeforeToday(selectedRange)
    : undefined;

  if (selectedRange && selectedRange.includes("..")) {
    [rangeStart, rangeEnd] = selectedRange.split("..");
  }

  const [fromDate, setFromDate] = useState<string | undefined>(rangeStart);
  const [toDate, setToDate] = useState<string | undefined>(rangeEnd);

  return (
    <div className={styles.dates}>
      <input
        aria-label="Date from"
        type="date"
        max={toDate || today}
        onChange={(e) => {
          setFromDate(e.currentTarget.value);
          setRange(`${fromDate}..${toDate}`);
        }}
        value={rangeStart}
      />
      <input
        aria-label="Date to"
        min={fromDate}
        max={today}
        type="date"
        onChange={(e) => {
          setToDate(e.currentTarget.value);
          setRange(`${fromDate}..${toDate}`);
        }}
        value={rangeEnd}
      />
    </div>
  );
}
