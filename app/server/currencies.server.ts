import { formInitialState } from "~/components/currencies/currencyFormReducer";

export function getCurrenciesFromUrl(url: URL) {
  let from = url.searchParams.get("from") || formInitialState.from;
  let to = url.searchParams.get("to") || formInitialState.to;
  return { from, to };
}
