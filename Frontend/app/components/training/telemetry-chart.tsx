export interface ChartSeries {
  label: string;
  color: string;
  values: number[];
}

interface TelemetryChartProps {
  title: string;
  unit: string;
  times: number[];
  series: ChartSeries[];
  yMin: number;
  yMax: number;
  cursorIndex: number;
}

const WIDTH = 320;
const HEIGHT = 140;
const PAD = { top: 10, right: 12, bottom: 22, left: 40 };
const PLOT_W = WIDTH - PAD.left - PAD.right;
const PLOT_H = HEIGHT - PAD.top - PAD.bottom;
const X_TICKS = [0, 30, 60, 90, 120];

export function TelemetryChart({
  title,
  unit,
  times,
  series,
  yMin,
  yMax,
  cursorIndex,
}: TelemetryChartProps) {
  const xMin = times[0];
  const xMax = times[times.length - 1];
  const x = (t: number) => PAD.left + ((t - xMin) / (xMax - xMin)) * PLOT_W;
  const y = (v: number) =>
    PAD.top + (1 - (v - yMin) / (yMax - yMin)) * PLOT_H;
  const yTicks = [0, 1, 2, 3, 4].map((i) => yMin + ((yMax - yMin) * i) / 4);
  const cursorX = x(times[cursorIndex]);

  return (
    <figure className="rounded-md border border-border bg-background/60 p-3">
      <div className="flex items-baseline justify-between">
        <figcaption className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          {title}
        </figcaption>
        <span className="text-[11px] text-muted-foreground">{unit}</span>
      </div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mt-2 w-full"
        role="img"
        aria-label={`${title} over time`}
      >
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={PAD.left}
              x2={WIDTH - PAD.right}
              y1={y(tick)}
              y2={y(tick)}
              className="stroke-border"
              strokeWidth={0.8}
            />
            <text
              x={PAD.left - 6}
              y={y(tick) + 3}
              textAnchor="end"
              fontSize={9}
              className="fill-muted-foreground"
            >
              {Number(tick.toFixed(1))}
            </text>
          </g>
        ))}
        {X_TICKS.map((tick) => (
          <text
            key={tick}
            x={x(tick)}
            y={HEIGHT - 6}
            textAnchor="middle"
            fontSize={9}
            className="fill-muted-foreground"
          >
            {tick}s
          </text>
        ))}
        <line
          x1={cursorX}
          x2={cursorX}
          y1={PAD.top}
          y2={HEIGHT - PAD.bottom}
          className="stroke-foreground/50"
          strokeWidth={1}
          strokeDasharray="3 3"
        />
        {series.map((line) => (
          <polyline
            key={line.label}
            fill="none"
            stroke={line.color}
            strokeWidth={1.6}
            strokeLinejoin="round"
            strokeLinecap="round"
            points={line.values
              .map((value, index) => `${x(times[index]).toFixed(1)},${y(value).toFixed(1)}`)
              .join(" ")}
          />
        ))}
      </svg>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {series.map((line) => (
          <li
            key={line.label}
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: line.color }}
            />
            {line.label}
          </li>
        ))}
      </ul>
    </figure>
  );
}
