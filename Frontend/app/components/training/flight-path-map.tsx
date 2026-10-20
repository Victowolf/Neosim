const WIDTH = 240;
const HEIGHT = 150;
const PAD = 14;

export function FlightPathMap({
  xs,
  ys,
  cursorIndex,
}: {
  xs: number[];
  ys: number[];
  cursorIndex: number;
}) {
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);
  const x = (v: number) =>
    PAD + ((v - xMin) / (xMax - xMin)) * (WIDTH - PAD * 2);
  const y = (v: number) =>
    HEIGHT - PAD - ((v - yMin) / (yMax - yMin)) * (HEIGHT - PAD * 2);
  const trail = xs.map((v, i) => `${x(v).toFixed(1)},${y(ys[i]).toFixed(1)}`).join(" ");

  return (
    <div className="rounded-md border border-border bg-background/60 p-3">
      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        Position overview
      </p>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="Flight path overview">
        {[0.25, 0.5, 0.75].map((f) => (
          <g key={f}>
            <line x1={PAD + f * (WIDTH - PAD * 2)} x2={PAD + f * (WIDTH - PAD * 2)} y1={PAD} y2={HEIGHT - PAD} className="stroke-border" strokeWidth={0.8} />
            <line x1={PAD} x2={WIDTH - PAD} y1={PAD + f * (HEIGHT - PAD * 2)} y2={PAD + f * (HEIGHT - PAD * 2)} className="stroke-border" strokeWidth={0.8} />
          </g>
        ))}
        <polyline fill="none" points={trail} className="stroke-muted-foreground" strokeWidth={1} strokeDasharray="2 3" />
        <circle cx={x(xs[0])} cy={y(ys[0])} r={3} className="fill-muted-foreground" />
        <circle cx={x(xs[cursorIndex])} cy={y(ys[cursorIndex])} r={5} className="fill-primary stroke-card" strokeWidth={2} />
      </svg>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
        <span>Start</span>
        <span>Current</span>
      </div>
    </div>
  );
}
