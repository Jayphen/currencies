import { describe, expect, it } from "vitest";
import { FormAction, formReducer } from "../currencyFormReducer";

describe("formReducer tests", () => {
  it("should handle SET_CURRENCY action", () => {
    const initialState = { from: "USD", to: "SGD", currencies: [] };
    const action = {
      type: "SET_CURRENCY",
      payload: { position: "from", currencyCode: "EUR" },
    } as FormAction;
    const newState = formReducer(initialState, action);

    expect(newState.from).toBe("EUR");
    expect(newState.to).toBe("SGD");
  });

  it("should handle SWAP_CURRENCIES action", () => {
    const initialState = { from: "USD", to: "SGD", currencies: [] };
    const action = { type: "SWAP_CURRENCIES" } as FormAction;
    const newState = formReducer(initialState, action);

    expect(newState.from).toBe("SGD");
    expect(newState.to).toBe("USD");
  });
});
