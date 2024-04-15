import {
  FormState,
  formInitialState,
} from "~/components/currencies/currencyFormReducer";

export function getDateBeforeToday(interval: FormState["range"]) {
  const today = new Date();
  let pastDate;

  switch (interval) {
    case "1w":
      pastDate = new Date(today.setDate(today.getDate() - 7));
      break;
    case "1m":
      pastDate = new Date(today.setMonth(today.getMonth() - 1));
      break;
    case "6m":
      pastDate = new Date(today.setMonth(today.getMonth() - 6));
      break;
    default:
      throw new Error(
        'Invalid interval. Choose "week", "month", or "6months".'
      );
  }

  const formattedDate = pastDate.toISOString().split("T")[0];
  return formattedDate + "..";
}

export function getRangeFromUrl(url: URL) {
  return (
    (url.searchParams.get("range") as FormState["range"]) ||
    formInitialState.range
  );
}
