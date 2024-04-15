import { describe, it, expect, beforeEach, vi } from "vitest";
import { FrankfurterApi } from "../txService.server";

vi.mock("../dateRange.server", () => ({
  getDateBeforeToday: vi.fn(() => "1week.."), // Mocking as if "1week.." is the result for a week
}));

describe("FrankfurterApi", () => {
  let api: FrankfurterApi;
  let fetcher = vi.fn();

  beforeEach(() => {
    const baseUrl = "https://test.com/";
    api = new FrankfurterApi(baseUrl, fetcher);
  });

  it("successfully fetches recent exchange rates", async () => {
    fetcher.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue({ rates: { USD: 1.0, EUR: 0.89 } }),
      status: 200,
    });

    const result = await api.getRecentExchangeRates("1w", "USD", "EUR");

    expect(result.ok).toBe(true);

    if (result.ok) {
      // if needed here for TS type narrowing
      expect(result.value).toEqual({ rates: { USD: 1.0, EUR: 0.89 } });
    }

    expect(fetcher).toHaveBeenCalledWith(
      "https://test.com/1week..?from=USD&to=EUR"
    );
  });

  it("handles 404 error correctly", async () => {
    fetcher.mockResolvedValueOnce({
      status: 404,
    });

    const result = await api.getRecentExchangeRates("1w", "USD", "USD");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe(
        "Cannot compare currency with itself. Please choose a different currency pair."
      );
    }
  });
});
