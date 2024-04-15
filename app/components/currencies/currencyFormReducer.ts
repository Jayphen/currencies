import { useReducer } from "react";

export type Currency = {
  currencyCode: string;
  flag: string;
  name: string;
};

const currencies: Currency[] = [
  {
    flag: "🇺🇸 ",
    currencyCode: "USD",
    name: "US Dollar",
  },
  {
    flag: "🇸🇬",
    currencyCode: "SGD",
    name: "Singapore Dollar",
  },
  {
    flag: "🇦🇺",
    currencyCode: "AUD",
    name: "Australian Dollar",
  },
  {
    flag: "🇪🇺",
    currencyCode: "EUR",
    name: "Euro",
  },
  {
    flag: "🇯🇵",
    currencyCode: "JPY",
    name: "Japanese Yen",
  },
];

const formInitialState = {
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

export function useCurrencyForm() {
  const [formState, dispatch] = useReducer(formReducer, formInitialState);
  const setCurrency = setCurrencyDispatch(dispatch);
  const swapCurrencies = () => dispatch({ type: "SWAP_CURRENCIES" });

  return {
    formState,
    setCurrency,
    swapCurrencies,
    currencies,
  };
}
