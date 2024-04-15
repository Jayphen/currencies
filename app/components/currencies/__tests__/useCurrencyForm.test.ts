import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react-hooks";
import { useCurrencyForm } from "../currencyFormReducer";

describe("useCurrencyForm", () => {
  it("should swap currencies correctly", () => {
    const { result } = renderHook(() => useCurrencyForm());

    act(() => {
      result.current.swapCurrencies();
    });

    expect(result.current.formState.from).toBe("SGD");
    expect(result.current.formState.to).toBe("USD");
  });

  it("should set currency correctly", () => {
    const { result } = renderHook(() => useCurrencyForm());

    act(() => {
      result.current.setCurrency({ code: "EUR", position: "from" });
    });

    expect(result.current.formState.from).toBe("EUR");
  });
});
