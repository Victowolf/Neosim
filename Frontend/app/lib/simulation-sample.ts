export const SAMPLE_INTERVAL_S = 2;
export const SESSION_DURATION_S = 120;
export const CURSOR_INDEX = 42;

const round = (value: number) => Number(value.toFixed(1));

const times = Array.from(
  { length: SESSION_DURATION_S / SAMPLE_INTERVAL_S + 1 },
  (_, index) => index * SAMPLE_INTERVAL_S,
);

export const simulationSamples = {
  times,
  speed: times.map((t) => round(12 + 3.5 * Math.sin(t / 14) + 1.2 * Math.sin(t / 4.5))),
  x: times.map((t) => round(120 + 1.4 * t + 6 * Math.sin(t / 9))),
  y: times.map((t) => round(-40 + 14 * Math.sin(t / 16))),
  z: times.map((t) => round(35 + 4 * Math.sin(t / 10))),
  roll: times.map((t) => round(4 * Math.sin(t / 7))),
  pitch: times.map((t) => round(-5 + 3 * Math.sin(t / 11))),
  yaw: times.map((t) => round(178 + 8 * Math.sin(t / 20))),
};
