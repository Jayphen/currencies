import { useReducer } from "react";

export type Currency = {
  currencyCode: string;
  flag: string;
  name: string;
};

const currencies = new Map<string, Currency>();
currencies.set("USD", { flag: "🇺🇸 ", currencyCode: "USD", name: "US Dollar" });
currencies.set("SGD", {
  flag: "🇸🇬",
  currencyCode: "SGD",
  name: "Singapore Dollar",
});
currencies.set("AUD", {
  flag: "🇦🇺",
  currencyCode: "AUD",
  name: "Australian Dollar",
});
currencies.set("EUR", { flag: "🇪🇺", currencyCode: "EUR", name: "Euro" });
currencies.set("JPY", {
  flag: "🇯🇵",
  currencyCode: "JPY",
  name: "Japanese Yen",
});

export const formInitialState = {
  from: "USD",
  to: "SGD",
};

type FormState = typeof formInitialState;

export type FormAction =
  | {
      type: "SET_CURRENCY";
      payload: { position: keyof FormState; currencyCode: string };
    }
  | { type: "SWAP_CURRENCIES" };

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

  if (searchParams && searchParams.has("from") && searchParams.has("to")) {
    initialState = {
      from: searchParams.get("from")!,
      to: searchParams.get("to")!,
    };
  }

  const [formState, dispatch] = useReducer(formReducer, initialState);
  const setCurrency = setCurrencyDispatch(dispatch);
  const swapCurrencies = () => {
    dispatch({ type: "SWAP_CURRENCIES" });
  };

  return {
    formState,
    setCurrency,
    swapCurrencies,
    currencies: [...currencies.values()],
    currencyMap: currencies,
  };
}
