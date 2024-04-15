import { describe, it, expect } from "vitest";
import {
  calculateMovement,
  mapDtoToResponse,
  roundToTwoDecimalPlaces,
} from "../mapDto";

const mockApiResult = {
  start_date: "2023-01-01",
  end_date: "2023-01-07",
  amount: 1,
  rates: {
    "2023-01-01": { USD: 1.0, EUR: 0.88 },
    "2023-01-07": { USD: 1.02, EUR: 0.89 },
  },
};

const expectedRates = [
  { x: "2023-01-01", y: 0.88 },
  { x: "2023-01-07", y: 0.89 },
];

const targetCurrency = "EUR";

describe("roundToTwoDecimalPlaces", () => {
  it("rounds numbers to two decimal places correctly", () => {
    const result = roundToTwoDecimalPlaces(3.14159);
    expect(result).toBe(3.14);
  });

  it("handles rounding up correctly", () => {
    const result = roundToTwoDecimalPlaces(2.71828);
    expect(result).toBe(2.72);
  });
});

describe("calculateMovement", () => {
  it("calculates movement and direction accurately", () => {
    const { movement, direction } = calculateMovement(
      mockApiResult,
      targetCurrency
    );
    expect(movement).toBeCloseTo(1.14, 2);
    expect(direction).toBe("gain");
  });
});

describe("mapDtoToResponse", () => {
  it("transforms API result to loader response correctly", () => {
    const response = mapDtoToResponse(mockApiResult, targetCurrency);

    expect(response).toHaveProperty("start_date", mockApiResult.start_date);
    expect(response).toHaveProperty("end_date", mockApiResult.end_date);
    expect(response.movement.direction).toBe("gain");

    expectedRates.forEach((expectedRate, index) => {
      const transformedRate = response.rates[index];
      expect(transformedRate).toEqual(expectedRate);
    });
  });
});
