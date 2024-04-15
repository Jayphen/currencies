export interface ApiResult {
  amount: number;
  start_date: string;
  end_date: string;
  rates: Record<string, Record<string, number>>;
}

export interface LoaderResponse {
  start_date: string;
  end_date: string;
  movement: {
    value: number;
    direction: "gain" | "loss";
  };
  rates: {
    x: string;
    y: number;
  }[];
  error?: string;
}

export function mapDtoToResponse(
  data: ApiResult,
  targetCurrency: string
): LoaderResponse {
  const { start_date, end_date, rates } = data;
  const { movement, direction } = calculateMovement(data, targetCurrency);

  const response: LoaderResponse = {
    start_date,
    end_date,
    movement: { value: roundToTwoDecimalPlaces(movement), direction },
    rates: Object.keys(data.rates).map((dateKey) => {
      return {
        x: dateKey,
        y: rates[dateKey][targetCurrency],
      };
    }),
  };

  return response;
}

export function calculateMovement(
  data: ApiResult,
  targetCurrency: string
): {
  movement: number;
  direction: LoaderResponse["movement"]["direction"];
} {
  const { rates, end_date, start_date } = data;

  const movement =
    ((rates[end_date][targetCurrency] - rates[start_date][targetCurrency]) /
      rates[start_date][targetCurrency]) *
    100;
  const direction = movement >= 0 ? "gain" : "loss";

  return {
    movement,
    direction,
  };
}

export function roundToTwoDecimalPlaces(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
