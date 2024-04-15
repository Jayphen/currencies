import {
  AnimatedAxis,
  AnimatedGrid,
  AnimatedLineSeries,
  Tooltip,
  XYChart,
} from "@visx/xychart";
import { LoaderResponse } from "~/routes/_index";
import styles from "./style.module.css";

type Rates = LoaderResponse["rates"][number];

const accessors = {
  xAccessor: (d: Rates) => new Date(d.x),
  yAccessor: (d: Rates) => d.y,
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
      <Tooltip
        snapTooltipToDatumX
        snapTooltipToDatumY
        showVerticalCrosshair
        showSeriesGlyphs
        glyphStyle={{ fill: "var(--accent-color)" }}
        renderTooltip={({ tooltipData }) =>
          tooltipData && (
            <div className={styles.tooltip}>
              <p>
                {accessors.yAccessor(tooltipData.nearestDatum?.datum as Rates)}
              </p>
              <div>
                {accessors
                  .xAccessor(tooltipData.nearestDatum?.datum as Rates)
                  .toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
              </div>
            </div>
          )
        }
      />
    </XYChart>
  );
}
