const ARM_LENGTH = 46;
const DIAGONAL = ARM_LENGTH * Math.SQRT1_2;
const ROTORS = [
  { x: DIAGONAL, y: DIAGONAL },
  { x: -DIAGONAL, y: DIAGONAL },
  { x: -DIAGONAL, y: -DIAGONAL },
  { x: DIAGONAL, y: -DIAGONAL },
];

export function DroneOrientationModel({
  roll,
  pitch,
  yaw,
}: {
  roll: number;
  pitch: number;
  yaw: number;
}) {
  return (
    <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-md border border-border bg-background/60 [perspective:520px]">
      <div
        className="relative h-0 w-0 transition-transform duration-300 [transform-style:preserve-3d]"
        style={{
          transform: `rotateX(58deg) rotateZ(${yaw}deg) rotateX(${pitch}deg) rotateY(${roll}deg)`,
        }}
      >
        {[45, -45].map((angle) => (
          <div
            key={angle}
            className="absolute left-1/2 top-1/2 h-[3px] rounded-full bg-foreground/55"
            style={{
              width: ARM_LENGTH * 2,
              transform: `translate(-50%, -50%) rotate(${angle}deg)`,
            }}
          />
        ))}
        {ROTORS.map((rotor) => (
          <div
            key={`${rotor.x}-${rotor.y}`}
            className="absolute left-0 top-0 h-11 w-11 rounded-full border-2 border-primary/70 bg-card/70"
            style={{
              transform: `translate(calc(${rotor.x}px - 50%), calc(${rotor.y}px - 50%))`,
            }}
          >
            <div className="absolute inset-0 m-auto h-[3px] w-9 rounded-full bg-primary/60 motion-safe:animate-spin" />
          </div>
        ))}
        <div className="absolute left-0 top-0 h-14 w-14 rounded-md border border-primary bg-primary/85 shadow-md [transform:translate(-50%,-50%)]" />
        <div className="absolute left-0 top-0 h-2 w-2 rounded-full bg-accent-foreground [transform:translate(-50%,calc(-50%-26px))]" />
      </div>
      <p className="absolute bottom-2 left-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        Roll {roll.toFixed(1)}° · Pitch {pitch.toFixed(1)}° · Yaw {yaw.toFixed(1)}°
      </p>
    </div>
  );
}
