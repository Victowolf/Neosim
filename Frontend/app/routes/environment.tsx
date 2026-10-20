import { useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { EyebrowLabel, PageFrame } from "@/components/training/page-frame";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function meta() {
  return [{ title: "Environment · Drone Training Simulator" }];
}

type Mode = "basics" | "scenario";

const SCENARIO_FIELDS = [
  {
    key: "terrain",
    label: "Terrain",
    options: ["Open field", "Urban", "Forest", "Coastal cliffs"],
  },
  {
    key: "weather",
    label: "Weather",
    options: ["Clear", "Windy", "Rain", "Fog"],
  },
  {
    key: "obstacles",
    label: "Obstacles",
    options: ["None", "Sparse trees", "Dense urban", "Gates"],
  },
  {
    key: "lighting",
    label: "Lighting",
    options: ["Daylight", "Dusk", "Night"],
  },
  {
    key: "difficulty",
    label: "Difficulty",
    options: ["Easy", "Medium", "Hard"],
  },
  {
    key: "drone",
    label: "Drone model",
    options: ["Quadcopter (X500)", "Hexacopter", "Fixed-wing"],
  },
  {
    key: "sensors",
    label: "Sensor conditions",
    options: [
      "All sensors nominal",
      "GPS dropout",
      "IMU noise",
      "Barometer drift",
      "Camera occlusion",
    ],
  },
] as const;

type ScenarioKey = (typeof SCENARIO_FIELDS)[number]["key"];

const DEFAULT_SCENARIO = Object.fromEntries(
  SCENARIO_FIELDS.map((field) => [field.key, field.options[0]]),
) as Record<ScenarioKey, string>;

export default function EnvironmentRoute() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("basics");
  const [scenario, setScenario] =
    useState<Record<ScenarioKey, string>>(DEFAULT_SCENARIO);

  function startSimulation() {
    const params = new URLSearchParams({ mode });
    if (mode === "scenario") {
      for (const field of SCENARIO_FIELDS) {
        params.set(field.key, scenario[field.key]);
      }
    }
    navigate(`/simulation?${params.toString()}`);
  }

  return (
    <PageFrame>
      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        <EyebrowLabel>Step 2 of 3</EyebrowLabel>
        <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-foreground">
          Environment configuration
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a training mode and set up the scenario.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <ModeCard
            active={mode === "basics"}
            onSelect={() => setMode("basics")}
            title="Basics / Tutorial"
            description="Run the basic flight training exercise."
          />
          <ModeCard
            active={mode === "scenario"}
            onSelect={() => setMode("scenario")}
            title="Simulated scenarios"
            description="Configure terrain, weather, obstacles, drone and sensors."
          />
        </div>

        {mode === "scenario" && (
          <div className="mt-6 grid gap-5 rounded-lg border border-border bg-card p-8 shadow-sm sm:grid-cols-2">
            {SCENARIO_FIELDS.map((field) => (
              <div key={field.key} className="space-y-2">
                <EyebrowLabel>{field.label}</EyebrowLabel>
                <Select
                  value={scenario[field.key]}
                  onValueChange={(value) =>
                    setScenario((current) => ({
                      ...current,
                      [field.key]: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <Button onClick={startSimulation}>Start 3D simulation</Button>
        </div>
      </div>
    </PageFrame>
  );
}

function ModeCard({
  active,
  onSelect,
  title,
  description,
}: {
  active: boolean;
  onSelect: () => void;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`rounded-lg border p-6 text-left transition-colors ${
        active
          ? "border-primary bg-card shadow-sm"
          : "border-border bg-card/60 hover:border-primary/60"
      }`}
    >
      <h2 className="font-serif text-xl font-bold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </button>
  );
}
