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

  it("should set range correctly", () => {
    const { result } = renderHook(() => useCurrencyForm());

    act(() => {
      result.current.setRange("1m");
    });

    expect(result.current.formState.range).toBe("1m");
  });

  it("initializes formState correctly from provided searchParams", () => {
    const mockSearchParams = new URLSearchParams();
    mockSearchParams.set("from", "EUR");
    mockSearchParams.set("to", "USD");
    mockSearchParams.set("range", "1w");

    const { result } = renderHook(() => useCurrencyForm(mockSearchParams));

    expect(result.current.formState.from).toBe("EUR");
    expect(result.current.formState.to).toBe("USD");
  });

  it("initializes with default state when searchParams are not provided", () => {
    const { result } = renderHook(() => useCurrencyForm());

    expect(result.current.formState.from).toBe("USD");
    expect(result.current.formState.to).toBe("SGD");
    expect(result.current.formState.range).toBe("6m");
  });

  it('ignores searchParams when "from" and "to" are not both provided', () => {
    const incompleteSearchParams = new URLSearchParams();
    incompleteSearchParams.set("from", "JPY");

    const { result } = renderHook(() =>
      useCurrencyForm(incompleteSearchParams)
    );

    expect(result.current.formState.from).toBe("USD");
    expect(result.current.formState.to).toBe("SGD");
    expect(result.current.formState.range).toBe("6m");
  });
});
