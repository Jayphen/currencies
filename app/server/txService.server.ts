import { getDateBeforeToday } from "./dateRange";
import { ApiResult } from "./mapDto.server";

export type Period = "1w" | "1m" | "6m";
export type DateRange = `${string}:${string}`;

type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

interface TxService {
  getRecentExchangeRates(
    range: Period,
    from: string,
    to: string
  ): Promise<Result<ApiResult>>;
  getRangeExchangeRates(
    range: DateRange,
    from: string,
    to: string
  ): Promise<Result<ApiResult>>;
}

export class FrankfurterApi implements TxService {
  constructor(
    private baseUrl: string = "https://api.frankfurter.app/",
    private fetcher: typeof fetch = fetch.bind(globalThis)
  ) {}

  async getRecentExchangeRates(
    range: Period,
    from: string,
    to: string
  ): Promise<Result<ApiResult>> {
    const result = await this.fetcher(
      this.baseUrl + `${getDateBeforeToday(range)}..?from=${from}&to=${to}`
    );

    if (result.status === 404) {
      return {
        ok: false,
        error: new Error(
          "Cannot compare currency with itself. Please choose a different currency pair."
        ),
      };
    }

    const json: ApiResult = await result.json();

    return {
      ok: true,
      value: json,
    };
  }

  async getRangeExchangeRates(
    range: DateRange,
    from: string,
    to: string
  ): Promise<Result<ApiResult>> {
    const result = await this.fetcher(
      this.baseUrl + `${range}?from=${from}&to=${to}`
    );

    if (result.status === 404) {
      return {
        ok: false,
        error: new Error(
          "Cannot compare currency with itself. Please choose a different currency pair."
        ),
      };
    }

    const json: ApiResult = await result.json();

    return {
      ok: true,
      value: json,
    };
  }
}
