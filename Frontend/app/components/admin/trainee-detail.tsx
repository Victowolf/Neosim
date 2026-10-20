import { useState } from "react";

import { Button } from "@/components/ui/button";
import { EyebrowLabel } from "@/components/training/page-frame";
import { LineChart, SkillBars } from "@/components/admin/admin-charts";
import { Card } from "@/components/admin/admin-ui";
import {
  REPORTS,
  type SessionStatus,
  type TraineeRecord,
} from "@/lib/admin-sample";

const TABS = [
  "Personal Profile",
  "Training History",
  "Performance Analytics",
  "Assessment",
  "AI Training Profile",
  "Reports",
  "Instructor Notes",
] as const;

type Tab = (typeof TABS)[number];

const PASS_THRESHOLD = 70;

export function TraineeDetail({
  trainee,
  onBack,
}: {
  trainee: TraineeRecord;
  onBack: () => void;
}) {
  const [tab, setTab] = useState<Tab>("Personal Profile");

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" onClick={onBack} className="-ml-3">
          ← Back to directory
        </Button>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <EyebrowLabel>{trainee.id}</EyebrowLabel>
          <h2 className="mt-1 font-serif text-3xl font-bold tracking-tight text-foreground">
            {trainee.name}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {trainee.sessionCount} sessions · Latest score {trainee.latestScore}% ·{" "}
            {trainee.status}
          </p>
        </div>
      </div>

      <div
        role="tablist"
        className="flex flex-wrap gap-1 border-b border-border pb-px"
      >
        {TABS.map((item) => (
          <button
            key={item}
            role="tab"
            aria-selected={tab === item}
            onClick={() => setTab(item)}
            className={`-mb-px rounded-t-md border-b-2 px-3 py-2 text-sm transition-colors ${
              tab === item
                ? "border-primary font-medium text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "Personal Profile" && <PersonalProfile trainee={trainee} />}
      {tab === "Training History" && <TrainingHistory trainee={trainee} />}
      {tab === "Performance Analytics" && (
        <PerformanceAnalytics trainee={trainee} />
      )}
      {tab === "Assessment" && <AssessmentTab trainee={trainee} />}
      {tab === "AI Training Profile" && <AiProfile trainee={trainee} />}
      {tab === "Reports" && <ReportsTab trainee={trainee} />}
      {tab === "Instructor Notes" && <NotesTab trainee={trainee} />}
    </div>
  );
}

function PersonalProfile({ trainee }: { trainee: TraineeRecord }) {
  const rows = [
    ["Trainee ID", trainee.id],
    ["Name", trainee.name],
    ["Email", trainee.email],
    ["Phone", trainee.phone],
    ["Registered", trainee.registered],
    ["Assigned instructor", trainee.instructor],
  ];
  return (
    <Card title="Personal profile">
      <dl className="grid gap-4 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {label}
            </dt>
            <dd className="mt-1 text-sm text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

const SESSION_STATUS_CLASS: Record<SessionStatus, string> = {
  Completed: "bg-secondary text-secondary-foreground",
  Active: "bg-primary text-primary-foreground",
  Interrupted: "bg-muted text-foreground",
  Failed: "bg-destructive/15 text-destructive",
};

function TrainingHistory({ trainee }: { trainee: TraineeRecord }) {
  return (
    <Card title="Training history">
      <p className="mb-4 text-sm text-muted-foreground">
        Showing the latest {trainee.recentSessions.length} of{" "}
        {trainee.sessionCount} sessions.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            <tr className="border-b border-border">
              <th className="py-2 pr-4 font-normal">Session</th>
              <th className="py-2 pr-4 font-normal">Date</th>
              <th className="py-2 pr-4 font-normal">Duration</th>
              <th className="py-2 pr-4 font-normal">Scenario</th>
              <th className="py-2 pr-4 font-normal">Score</th>
              <th className="py-2 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {trainee.recentSessions.map((session) => (
              <tr key={session.id} className="border-b border-border/60">
                <td className="py-3 pr-4 font-mono text-xs">{session.id}</td>
                <td className="py-3 pr-4">{session.date}</td>
                <td className="py-3 pr-4 font-mono text-xs">{session.duration}</td>
                <td className="py-3 pr-4">{session.scenario}</td>
                <td className="py-3 pr-4 font-mono">{session.score}%</td>
                <td className="py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs ${SESSION_STATUS_CLASS[session.status]}`}
                  >
                    {session.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function PerformanceAnalytics({ trainee }: { trainee: TraineeRecord }) {
  const applicableSkills = trainee.skills.filter((skill) => skill.applicable);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Score improvement across sessions">
        <LineChart
          labels={trainee.scoreTrend.map((_, i) => `S${i + 1}`)}
          values={trainee.scoreTrend}
          yMin={0}
          yMax={100}
          unit="%"
        />
      </Card>
      <Card title="Skill scores">
        <SkillBars
          items={applicableSkills.map((skill) => ({
            label: skill.skill,
            value: skill.score,
          }))}
        />
        <p className="mt-4 text-xs text-muted-foreground">
          Detection and classification are shown only for scenarios that
          include those tasks.
        </p>
      </Card>
    </div>
  );
}

function AssessmentTab({ trainee }: { trainee: TraineeRecord }) {
  const applicableSkills = trainee.skills.filter((skill) => skill.applicable);
  return (
    <Card title="Skill-wise assessment">
      <table className="w-full text-left text-sm">
        <thead className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          <tr className="border-b border-border">
            <th className="py-2 pr-4 font-normal">Skill</th>
            <th className="py-2 pr-4 font-normal">Score</th>
            <th className="py-2 pr-4 font-normal">Pass mark</th>
            <th className="py-2 font-normal">Result</th>
          </tr>
        </thead>
        <tbody>
          {applicableSkills.map((skill) => {
            const passed = skill.score >= PASS_THRESHOLD;
            return (
              <tr key={skill.skill} className="border-b border-border/60">
                <td className="py-3 pr-4">{skill.skill}</td>
                <td className="py-3 pr-4 font-mono">{skill.score}</td>
                <td className="py-3 pr-4 font-mono">{PASS_THRESHOLD}</td>
                <td className={`py-3 font-medium ${passed ? "text-primary" : "text-destructive"}`}>
                  {passed ? "Pass" : "Fail"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-5 rounded-md bg-muted/60 p-4">
        <EyebrowLabel>Instructor feedback</EyebrowLabel>
        <p className="mt-2 text-sm text-foreground">{trainee.feedback}</p>
      </div>
    </Card>
  );
}

function AiProfile({ trainee }: { trainee: TraineeRecord }) {
  return (
    <Card title="Detected behaviour patterns">
      <ul className="divide-y divide-border">
        {trainee.aiPatterns.map((item) => (
          <li key={item.pattern} className="grid gap-2 py-4 sm:grid-cols-[1fr_auto]">
            <div>
              <p className="text-sm font-medium text-foreground">{item.pattern}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Difficulty adjustment: {item.adjustment}
              </p>
            </div>
            <p className="font-mono text-sm text-foreground">
              Confidence {Math.round(item.confidence * 100)}%
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function ReportsTab({ trainee }: { trainee: TraineeRecord }) {
  const reports = REPORTS.filter((report) => report.trainee === trainee.name);
  return (
    <Card title="Session reports">
      {reports.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reports generated yet.</p>
      ) : (
        <ul className="divide-y divide-border">
          {reports.map((report) => (
            <li key={report.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="font-mono text-xs text-foreground">{report.id}</p>
                <p className="text-sm text-muted-foreground">
                  {report.session} · {report.generated} · {report.status}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled title="Export is not connected yet">
                  PDF
                </Button>
                <Button variant="outline" size="sm" disabled title="Export is not connected yet">
                  CSV
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function NotesTab({ trainee }: { trainee: TraineeRecord }) {
  return (
    <Card title="Instructor notes">
      <ul className="space-y-4">
        {trainee.notes.map((note) => (
          <li key={note.date + note.text} className="border-l-2 border-primary pl-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              {note.date} · {note.author}
            </p>
            <p className="mt-1 text-sm text-foreground">{note.text}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
