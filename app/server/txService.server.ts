import { getDateBeforeToday } from "./dateRange.server";
import { ApiResult } from "./mapDto.server";

type Range = "1w" | "1m" | "6m";

type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

interface TxService {
  getRecentExchangeRates(
    range: Range,
    from: string,
    to: string
  ): Promise<Result<ApiResult>>;
}

export class FrankfurterApi implements TxService {
  constructor(
    private baseUrl: string = "https://api.frankfurter.app/",
    private fetcher: typeof fetch = global.fetch
  ) {}

  async getRecentExchangeRates(
    range: Range,
    from: string,
    to: string
  ): Promise<Result<ApiResult>> {
    const result = await this.fetcher(
      this.baseUrl + `${getDateBeforeToday(range)}?from=${from}&to=${to}`
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
