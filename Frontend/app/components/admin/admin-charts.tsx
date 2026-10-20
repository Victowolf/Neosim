const WIDTH = 520;
const HEIGHT = 200;
const PAD = { top: 16, right: 16, bottom: 28, left: 40 };
const PLOT_W = WIDTH - PAD.left - PAD.right;
const PLOT_H = HEIGHT - PAD.top - PAD.bottom;

export function LineChart({
  labels,
  values,
  yMin,
  yMax,
  color = "hsl(var(--chart-1))",
  unit = "",
}: {
  labels: string[];
  values: number[];
  yMin: number;
  yMax: number;
  color?: string;
  unit?: string;
}) {
  const count = values.length;
  const x = (i: number) =>
    PAD.left + (count === 1 ? PLOT_W / 2 : (i / (count - 1)) * PLOT_W);
  const y = (v: number) =>
    PAD.top + (1 - (v - yMin) / (yMax - yMin)) * PLOT_H;
  const yTicks = [0, 1, 2, 3, 4].map((i) => yMin + ((yMax - yMin) * i) / 4);
  const points = values.map((v, i) => `${x(i)},${y(v)}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-auto w-full"
      role="img"
      aria-label="Line chart"
    >
      {yTicks.map((tick) => (
        <g key={tick}>
          <line
            x1={PAD.left}
            x2={WIDTH - PAD.right}
            y1={y(tick)}
            y2={y(tick)}
            stroke="hsl(var(--border))"
            strokeDasharray="3 4"
          />
          <text
            x={PAD.left - 6}
            y={y(tick)}
            textAnchor="end"
            dominantBaseline="middle"
            className="fill-muted-foreground font-mono"
            fontSize="10"
          >
            {Math.round(tick)}
            {unit}
          </text>
        </g>
      ))}
      {labels.map((label, i) => (
        <text
          key={`${label}-${i}`}
          x={x(i)}
          y={HEIGHT - 8}
          textAnchor="middle"
          className="fill-muted-foreground font-mono"
          fontSize="10"
        >
          {label}
        </text>
      ))}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {values.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r="3.5" fill={color}>
          <title>{`${labels[i]}: ${v}${unit}`}</title>
        </circle>
      ))}
    </svg>
  );
}

export function SkillBars({
  items,
}: {
  items: { label: string; value: number; applicable?: boolean }[];
}) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label}>
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground">{item.label}</span>
            <span className="font-mono text-xs text-muted-foreground">
              {item.applicable === false ? "N/A" : `${item.value}%`}
            </span>
          </div>
          <div className="mt-1.5 h-2 rounded-full bg-muted">
            {item.applicable !== false && (
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${item.value}%` }}
              />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
