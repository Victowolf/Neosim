import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import {
  useActionMutation,
  useActionQuery,
} from "@agent-native/core/client/hooks";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyebrowLabel, PageFrame } from "@/components/training/page-frame";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function meta() {
  return [{ title: "Trainee profile · Drone Training Simulator" }];
}

type EyesightStatus = "normal" | "glasses" | "other";

interface TraineeProfile {
  id: string;
  name: string;
  age: number;
  eyesightStatus: EyesightStatus;
  prescriptionDetails: string;
  eyesightConditions: string;
  medications: string;
}

const EYESIGHT_OPTIONS: { value: EyesightStatus; label: string }[] = [
  { value: "normal", label: "Normal vision" },
  { value: "glasses", label: "Prescription glasses" },
  { value: "other", label: "Other eyesight issue" },
];

export default function ProfileRoute() {
  const { data, isLoading } = useActionQuery("get-trainee-profile", {});

  return (
    <PageFrame>
      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        <EyebrowLabel>Step 1 of 3</EyebrowLabel>
        <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-foreground">
          Trainee profile
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Create or update your details before choosing an environment.
        </p>

        {isLoading ? (
          <p className="mt-10 text-sm text-muted-foreground">Loading profile…</p>
        ) : (
          <ProfileForm
            key={(data as TraineeProfile | null)?.id ?? "new"}
            initial={(data as TraineeProfile | null) ?? null}
          />
        )}
      </div>
    </PageFrame>
  );
}

function ProfileForm({ initial }: { initial: TraineeProfile | null }) {
  const navigate = useNavigate();
  const save = useActionMutation("save-trainee-profile");
  const [name, setName] = useState(initial?.name ?? "");
  const [age, setAge] = useState(initial ? String(initial.age) : "");
  const [eyesightStatus, setEyesightStatus] = useState<EyesightStatus>(
    initial?.eyesightStatus ?? "normal",
  );
  const [prescriptionDetails, setPrescriptionDetails] = useState(
    initial?.prescriptionDetails ?? "",
  );
  const [eyesightConditions, setEyesightConditions] = useState(
    initial?.eyesightConditions ?? "",
  );
  const [medications, setMedications] = useState(initial?.medications ?? "");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const ageNumber = Number(age);
    if (!name.trim()) return setError("Enter your name.");
    if (!Number.isInteger(ageNumber) || ageNumber < 5 || ageNumber > 120)
      return setError("Enter an age between 5 and 120.");
    setError(null);
    save.mutate(
      {
        id: initial?.id,
        name: name.trim(),
        age: ageNumber,
        eyesightStatus,
        prescriptionDetails:
          eyesightStatus === "glasses" ? prescriptionDetails.trim() : "",
        eyesightConditions: eyesightConditions.trim(),
        medications: medications.trim(),
      },
      {
        onError: (mutationError) =>
          setError(
            mutationError instanceof Error
              ? mutationError.message
              : "Could not save the profile. Try again.",
          ),
      },
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mt-8 space-y-8 rounded-lg border border-border bg-card p-8 shadow-sm"
    >
      <section className="grid gap-5 sm:grid-cols-[1fr_120px]">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            inputMode="numeric"
            value={age}
            onChange={(event) => setAge(event.target.value)}
          />
        </div>
      </section>

      <section className="space-y-5">
        <div className="space-y-2">
          <Label>Eyesight status</Label>
          <Select
            value={eyesightStatus}
            onValueChange={(value) => setEyesightStatus(value as EyesightStatus)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EYESIGHT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {eyesightStatus === "glasses" && (
          <div className="space-y-2">
            <Label htmlFor="prescription">Prescription details</Label>
            <Input
              id="prescription"
              placeholder="e.g. -1.5 D both eyes, single-vision lenses"
              value={prescriptionDetails}
              onChange={(event) => setPrescriptionDetails(event.target.value)}
            />
          </div>
        )}
      </section>

      <section className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="conditions">
            Eyesight-related conditions{" "}
            <span className="text-muted-foreground">(optional)</span>
          </Label>
          <textarea
            id="conditions"
            rows={3}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={eyesightConditions}
            onChange={(event) => setEyesightConditions(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="medications">
            Relevant medications{" "}
            <span className="text-muted-foreground">(optional)</span>
          </Label>
          <textarea
            id="medications"
            rows={2}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={medications}
            onChange={(event) => setMedications(event.target.value)}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Medical details are optional. Restricting access to authorised
          personnel is not enforced in this preview yet.
        </p>
      </section>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-border pt-6">
        <span className="text-sm text-muted-foreground">
          {save.isSuccess && !save.isPending ? "Profile saved." : ""}
        </span>
        <div className="flex gap-3">
          <Button type="submit" disabled={save.isPending}>
            {initial ? "Update profile" : "Save profile"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/environment")}
          >
            Continue
          </Button>
        </div>
      </div>
    </form>
  );
}
