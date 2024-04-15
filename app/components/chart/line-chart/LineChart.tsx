import {
  AnimatedAxis,
  AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
} from "@visx/xychart";
import { LoaderResponse } from "~/routes/_index";

const accessors = {
  xAccessor: (d: LoaderResponse["rates"][number]) => new Date(d.x),
  yAccessor: (d: LoaderResponse["rates"][number]) => d.y,
};

export function LineChart({ data }: { data: LoaderResponse["rates"] }) {
  return (
    <XYChart
      xScale={{ type: "time", zero: false }}
      yScale={{
        type: "linear",
        zero: false,
      }}
      height={400}
    >
      <AnimatedGrid columns={false} strokeDasharray="3,4" numTicks={5} />
      <AnimatedAxis orientation="bottom" numTicks={5} />
      <AnimatedAxis orientation="right" />
      <AnimatedLineSeries
        dataKey="rates"
        data={data}
        {...accessors}
        stroke="var(--chart-line)"
      />
    </XYChart>
  );
}
