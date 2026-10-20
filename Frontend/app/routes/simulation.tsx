import { useSearchParams } from "react-router";

import { DroneOrientationModel } from "@/components/training/drone-orientation-model";
import { FlightPathMap } from "@/components/training/flight-path-map";
import { EyebrowLabel, PageFrame } from "@/components/training/page-frame";
import { TelemetryChart } from "@/components/training/telemetry-chart";
import { Button } from "@/components/ui/button";
import {
  CURSOR_INDEX,
  SAMPLE_INTERVAL_S,
  SESSION_DURATION_S,
  simulationSamples as samples,
} from "@/lib/simulation-sample";

export function meta() {
  return [{ title: "Simulation · Drone Training Simulator" }];
}

const SUMMARY_KEYS = [
  "terrain",
  "weather",
  "obstacles",
  "lighting",
  "difficulty",
  "drone",
  "sensors",
] as const;

const formatClock = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const at = (values: number[]) => values[CURSOR_INDEX];
const elapsedSeconds = CURSOR_INDEX * SAMPLE_INTERVAL_S;
const progress = (elapsedSeconds / SESSION_DURATION_S) * 100;

const telemetryRows = [
  { label: "Speed", value: `${at(samples.speed).toFixed(1)} m/s` },
  { label: "Position X", value: `${at(samples.x).toFixed(1)} m` },
  { label: "Position Y", value: `${at(samples.y).toFixed(1)} m` },
  { label: "Position Z", value: `${at(samples.z).toFixed(1)} m` },
  { label: "Roll", value: `${at(samples.roll).toFixed(1)}°` },
  { label: "Pitch", value: `${at(samples.pitch).toFixed(1)}°` },
  { label: "Yaw", value: `${at(samples.yaw).toFixed(1)}°` },
];

const chartProps = {
  times: samples.times,
  cursorIndex: CURSOR_INDEX,
};

export default function SimulationRoute() {
  const [params] = useSearchParams();
  const mode = params.get("mode") === "scenario" ? "Scenario" : "Basics";
  const summary = SUMMARY_KEYS.map((key) => params.get(key)).filter(
    (value): value is string => Boolean(value),
  );

  return (
    <PageFrame>
      <div className="flex border-b border-border bg-background/80 px-6 py-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {mode} mode
          {summary.length > 0 && <> · {summary.join(" · ")}</>}
        </p>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-[260px_minmax(0,1fr)_300px]">
        <aside className="flex min-h-0 flex-col gap-4 overflow-y-auto rounded-lg border border-border bg-card p-5">
          <EyebrowLabel>Live telemetry</EyebrowLabel>
          <dl className="space-y-3">
            {telemetryRows.map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between border-b border-border pb-2"
              >
                <dt className="text-sm text-muted-foreground">{row.label}</dt>
                <dd className="font-mono text-sm text-foreground">{row.value}</dd>
              </div>
            ))}
          </dl>
          <DroneOrientationModel
            roll={at(samples.roll)}
            pitch={at(samples.pitch)}
            yaw={at(samples.yaw)}
          />
          <FlightPathMap
            xs={samples.x}
            ys={samples.y}
            cursorIndex={CURSOR_INDEX}
          />
        </aside>

        <section className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-lg border border-border bg-[#1d1915] lg:min-h-0">
          <p className="absolute font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Gameplay recording
          </p>
          <video
            src="/gameplay.mp4"
            controls
            playsInline
            className="relative h-full w-full object-contain"
          />
        </section>

        <aside className="flex min-h-0 flex-col gap-4 overflow-y-auto rounded-lg border border-border bg-card p-5">
          <div className="space-y-3">
            <EyebrowLabel>Session SIM-0427-A</EyebrowLabel>
            <div className="flex items-end justify-between">
              <p className="font-mono text-3xl text-foreground">
                {formatClock(elapsedSeconds)}
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                / {formatClock(SESSION_DURATION_S)}
              </p>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline" disabled>
                Pause
              </Button>
              <Button size="sm" variant="outline" disabled>
                Restart
              </Button>
              <Button size="sm" variant="outline" disabled>
                End session
              </Button>
              <Button size="sm" disabled>
                Play
              </Button>
            </div>
          </div>

          <TelemetryChart
            {...chartProps}
            title="Speed"
            unit="m/s"
            yMin={0}
            yMax={20}
            series={[{ label: "Speed", color: "hsl(var(--chart-1))", values: samples.speed }]}
          />
          <TelemetryChart
            {...chartProps}
            title="Position X / Y"
            unit="m"
            yMin={-60}
            yMax={300}
            series={[
              { label: "X", color: "hsl(var(--chart-1))", values: samples.x },
              { label: "Y", color: "hsl(var(--chart-2))", values: samples.y },
            ]}
          />
          <TelemetryChart
            {...chartProps}
            title="Altitude Z"
            unit="m"
            yMin={25}
            yMax={45}
            series={[{ label: "Z", color: "hsl(var(--chart-2))", values: samples.z }]}
          />
          <TelemetryChart
            {...chartProps}
            title="Roll / Pitch"
            unit="°"
            yMin={-10}
            yMax={10}
            series={[
              { label: "Roll", color: "hsl(var(--chart-1))", values: samples.roll },
              { label: "Pitch", color: "hsl(var(--chart-3))", values: samples.pitch },
            ]}
          />
          <TelemetryChart
            {...chartProps}
            title="Yaw"
            unit="°"
            yMin={165}
            yMax={190}
            series={[{ label: "Yaw", color: "hsl(var(--chart-3))", values: samples.yaw }]}
          />
        </aside>
      </div>
    </PageFrame>
  );
}
