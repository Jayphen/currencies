import { describe, expect, it } from "vitest";
import { FormAction, FormState, formReducer } from "../currencyFormReducer";

const initialState = {
  from: "USD",
  to: "SGD",
  currencies: [],
  range: "1w",
} as FormState;

describe("formReducer tests", () => {
  it("should handle SET_CURRENCY action", () => {
    const action = {
      type: "SET_CURRENCY",
      payload: { position: "from", currencyCode: "EUR" },
    } as FormAction;
    const newState = formReducer(initialState, action);

    expect(newState.from).toBe("EUR");
    expect(newState.to).toBe("SGD");
  });

  it("should handle SWAP_CURRENCIES action", () => {
    const action = { type: "SWAP_CURRENCIES" } as FormAction;
    const newState = formReducer(initialState, action);

    expect(newState.from).toBe("SGD");
    expect(newState.to).toBe("USD");
  });

  it("should handle SET_RANGE_PRESET action", () => {
    const action = {
      type: "SET_RANGE_PRESET",
      payload: { preset: "6m" },
    } as FormAction;
    const newState = formReducer(initialState, action);

    expect(newState.range).toBe("6m");
  });
});
