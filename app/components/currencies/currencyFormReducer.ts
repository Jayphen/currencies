import { useReducer } from "react";

export type Currency = {
  currencyCode: string;
  flag: string;
  name: string;
};

export type FormState = {
  from: string;
  to: string;
  range: "1w" | "1m" | "6m" | `${string}..${string}`;
};

const currencies = new Map<string, Currency>([
  ["USD", { flag: "🇺🇸 ", currencyCode: "USD", name: "US Dollar" }],
  ["SGD", { flag: "🇸🇬", currencyCode: "SGD", name: "Singapore Dollar" }],
  ["AUD", { flag: "🇦🇺", currencyCode: "AUD", name: "Australian Dollar" }],
  ["EUR", { flag: "🇪🇺", currencyCode: "EUR", name: "Euro" }],
  ["NZD", { flag: "🇳🇿", currencyCode: "NZD", name: "New Zealand Dollar" }],
  ["JPY", { flag: "🇯🇵", currencyCode: "JPY", name: "Japanese Yen" }],
]);

export const formInitialState: FormState = {
  from: "USD",
  to: "SGD",
  range: "6m",
};

export type FormAction =
  | {
      type: "SET_CURRENCY";
      payload: { position: keyof FormState; currencyCode: string };
    }
  | { type: "SWAP_CURRENCIES" }
  | {
      type: "SET_RANGE_PRESET";
      payload: { preset: FormState["range"] };
    };

export function formReducer(state: FormState, action: FormAction) {
  switch (action.type) {
    case "SET_CURRENCY": {
      const { position, currencyCode } = action.payload;
      return {
        ...state,
        [position]: currencyCode,
      };
    }
    case "SWAP_CURRENCIES": {
      return {
        ...state,
        to: state.from,
        from: state.to,
      };
    }
    case "SET_RANGE_PRESET": {
      return {
        ...state,
        range: action.payload.preset,
      };
    }
  }
}

export function setCurrencyDispatch(dispatcher: React.Dispatch<any>) {
  return function ({ code, position }: { code: string; position: string }) {
    dispatcher({
      type: "SET_CURRENCY",
      payload: { position, currencyCode: code },
    });
  };
}

export function useCurrencyForm(searchParams?: URLSearchParams) {
  let initialState = { ...formInitialState };

  if (
    searchParams &&
    searchParams.has("from") &&
    searchParams.has("to") &&
    searchParams.has("range")
  ) {
    initialState = {
      from: searchParams.get("from")!,
      to: searchParams.get("to")!,
      range: searchParams.get("range") as FormState["range"],
    };
  }

  const [formState, dispatch] = useReducer(formReducer, initialState);
  const setCurrency = setCurrencyDispatch(dispatch);
  const swapCurrencies = () => {
    dispatch({ type: "SWAP_CURRENCIES" });
  };
  const setRange = (range: FormState["range"]) => {
    dispatch({ type: "SET_RANGE_PRESET", payload: { preset: range } });
  };

  return {
    formState,
    setCurrency,
    swapCurrencies,
    currencies: [...currencies.values()],
    currencyMap: currencies,
    setRange,
  };
}
