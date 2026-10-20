import { Button } from "@/components/ui/button";
import { EyebrowLabel } from "@/components/training/page-frame";
import { LineChart, SkillBars } from "@/components/admin/admin-charts";
import { Card, StatusPill, TableHead } from "@/components/admin/admin-ui";
import {
  ADMIN_KPIS,
  AAR_SUMMARY,
  AI_DECISIONS,
  AUDIT_LOG,
  INTERVENTION_LOG,
  LIVE_EVENTS,
  LIVE_SESSIONS,
  LIVE_TELEMETRY,
  PENDING_ASSESSMENTS,
  REPORTS,
  ROLE_ACCESS,
  SCENARIOS,
  SESSIONS_PER_WEEK,
  SKILL_AVERAGES,
  TRAINEES,
  type TraineeStatus,
} from "@/lib/admin-sample";

export const DEMO_NOTE =
  "Illustrative dashboard data, not live system statistics.";

export function DemoBanner() {
  return (
    <p className="rounded-md border border-dashed border-border bg-muted/50 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
      {DEMO_NOTE}
    </p>
  );
}

export function OverviewModule({
  onOpenTrainee,
}: {
  onOpenTrainee: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <DemoBanner />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {ADMIN_KPIS.map((kpi) => (
          <Card key={kpi.label} title={kpi.label}>
            <p className="font-serif text-4xl font-bold text-foreground">
              # {kpi.value}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{kpi.note}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card title="Sessions per week">
          <LineChart
            labels={SESSIONS_PER_WEEK.labels}
            values={SESSIONS_PER_WEEK.values}
            yMin={0}
            yMax={40}
          />
        </Card>
        <Card title="Average skill scores">
          <SkillBars
            items={SKILL_AVERAGES.map((item) => ({
              label: item.skill,
              value: item.score,
            }))}
          />
        </Card>
      </div>

      <Card title="Trainees needing attention">
        <DirectoryTable
          rows={TRAINEES.filter((t) => t.status !== "Completed")}
          onOpen={onOpenTrainee}
        />
      </Card>
    </div>
  );
}

export function DirectoryTable({
  rows,
  onOpen,
}: {
  rows: typeof TRAINEES;
  onOpen: (id: string) => void;
}) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No trainees match this view.</p>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <TableHead
          columns={["Trainee", "ID", "Status", "Sessions", "Latest score", ""]}
        />
        <tbody>
          {rows.map((trainee) => (
            <tr key={trainee.id} className="border-b border-border/60">
              <td className="py-3 pr-4 font-medium text-foreground">{trainee.name}</td>
              <td className="py-3 pr-4 font-mono text-xs">{trainee.id}</td>
              <td className="py-3 pr-4">
                <StatusPill status={trainee.status} />
              </td>
              <td className="py-3 pr-4 font-mono">{trainee.sessionCount}</td>
              <td className="py-3 pr-4 font-mono">{trainee.latestScore}%</td>
              <td className="py-3 text-right">
                <Button variant="outline" size="sm" onClick={() => onOpen(trainee.id)}>
                  View trainee profile
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const DIRECTORY_FILTERS: { value: "all" | TraineeStatus; label: string }[] = [
  { value: "all", label: "All trainees" },
  { value: "Completed", label: "Completed" },
  { value: "In Progress", label: "In progress" },
  { value: "Needs Review", label: "Needs review" },
];

export function TraineeDirectory({
  query,
  filter,
  onFilterChange,
  onOpen,
}: {
  query: string;
  filter: "all" | TraineeStatus;
  onFilterChange: (value: "all" | TraineeStatus) => void;
  onOpen: (id: string) => void;
}) {
  const q = query.trim().toLowerCase();
  const rows = TRAINEES.filter(
    (t) =>
      (filter === "all" || t.status === filter) &&
      (q === "" || t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)),
  );
  return (
    <div className="space-y-6">
      <div>
        <EyebrowLabel>Trainee management</EyebrowLabel>
        <h2 className="mt-1 font-serif text-3xl font-bold tracking-tight text-foreground">
          Trainee directory
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sample records for demonstrating the interface. Medical and eyesight data are not shown here.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {DIRECTORY_FILTERS.map((item) => (
          <Button
            key={item.value}
            variant={filter === item.value ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <Card title={`${rows.length} trainee${rows.length === 1 ? "" : "s"}`}>
        <DirectoryTable rows={rows} onOpen={onOpen} />
      </Card>
    </div>
  );
}

export function LiveModule() {
  return (
    <div className="space-y-6">
      <div>
        <EyebrowLabel>Live monitoring</EyebrowLabel>
        <h2 className="mt-1 font-serif text-3xl font-bold tracking-tight text-foreground">
          Live monitoring centre
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Active simulator instances and trainee status. Sample data; no simulator is connected.
        </p>
      </div>

      <Card title="Active sessions">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <TableHead columns={["Session", "Trainee", "Instructor", "Scenario", "Elapsed", "Status", "Alert"]} />
            <tbody>
              {LIVE_SESSIONS.map((session) => (
                <tr key={session.id} className="border-b border-border/60">
                  <td className="py-3 pr-4 font-mono text-xs">{session.id}</td>
                  <td className="py-3 pr-4">{session.trainee}</td>
                  <td className="py-3 pr-4">{session.instructor}</td>
                  <td className="py-3 pr-4">{session.scenario}</td>
                  <td className="py-3 pr-4 font-mono">{session.elapsed}</td>
                  <td className="py-3 pr-4"><StatusPill status={session.status} /></td>
                  <td className="py-3 text-muted-foreground">{session.alert}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card title="Selected session · S-2041">
          <div className="flex aspect-video items-center justify-center rounded-md border border-dashed border-border bg-muted/50 text-sm text-muted-foreground">
            Gazebo viewport feed not connected
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Object.entries(LIVE_TELEMETRY).map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
                <dd className="font-mono text-sm text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6">
            <EyebrowLabel>Event alerts</EyebrowLabel>
            <ul className="mt-2 divide-y divide-border">
              {LIVE_EVENTS.map((event) => (
                <li key={event.time + event.event} className="flex items-center justify-between py-2 text-sm">
                  <span className="font-mono text-xs text-muted-foreground">{event.time}</span>
                  <span className="flex-1 px-4">{event.event}</span>
                  <StatusPill status={event.kind} />
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <div className="space-y-6">
          <Card title="Intervention controls">
            <p className="mb-4 text-sm text-muted-foreground">
              Requires instructor permission and confirmation. Controls are shown for design review and are disabled.
            </p>
            <div className="grid gap-2">
              <Button variant="outline" disabled>Pause session</Button>
              <Button variant="outline" disabled>Interrupt session</Button>
              <Button variant="outline" disabled>Send instructor message</Button>
            </div>
          </Card>
          <Card title="Intervention record">
            <ul className="divide-y divide-border">
              {INTERVENTION_LOG.map((item) => (
                <li key={item.time} className="py-3 text-sm">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{item.time} · {item.by}</p>
                  <p className="mt-1 text-foreground">{item.action}</p>
                  <p className="text-muted-foreground">{item.reason}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function AssessmentsModule() {
  return (
    <div className="space-y-6">
      <div>
        <EyebrowLabel>Assessments</EyebrowLabel>
        <h2 className="mt-1 font-serif text-3xl font-bold tracking-tight text-foreground">
          Pending assessments
        </h2>
      </div>
      <Card title="Awaiting instructor review">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <TableHead columns={["Assessment", "Trainee", "Session", "Type", "Due", ""]} />
            <tbody>
              {PENDING_ASSESSMENTS.map((item) => (
                <tr key={item.id} className="border-b border-border/60">
                  <td className="py-3 pr-4 font-mono text-xs">{item.id}</td>
                  <td className="py-3 pr-4">{item.trainee}</td>
                  <td className="py-3 pr-4 font-mono text-xs">{item.session}</td>
                  <td className="py-3 pr-4">{item.type}</td>
                  <td className="py-3 pr-4">{item.due}</td>
                  <td className="py-3 text-right">
                    <Button variant="outline" size="sm" disabled title="Review is not connected yet">
                      Review
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export function ScenariosModule() {
  return (
    <div className="space-y-6">
      <div>
        <EyebrowLabel>Scenario management</EyebrowLabel>
        <h2 className="mt-1 font-serif text-3xl font-bold tracking-tight text-foreground">
          Scenario library
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Detection and classification objectives appear only where the scenario includes them.
        </p>
      </div>
      <Card title="Scenarios">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <TableHead columns={["Scenario", "Type", "Difficulty", "Drone", "Objectives", "Threat detection"]} />
            <tbody>
              {SCENARIOS.map((scenario) => (
                <tr key={scenario.name} className="border-b border-border/60 align-top">
                  <td className="py-3 pr-4 font-medium">{scenario.name}</td>
                  <td className="py-3 pr-4">{scenario.type}</td>
                  <td className="py-3 pr-4">{scenario.difficulty}</td>
                  <td className="py-3 pr-4">{scenario.drone}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{scenario.objectives}</td>
                  <td className="py-3">{scenario.detection}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export function ReportsModule() {
  const timelineKinds: Record<string, string> = {
    Task: "Completed",
    Mistake: "Failed",
    Warning: "Warning",
  };
  return (
    <div className="space-y-6">
      <div>
        <EyebrowLabel>Reports & AAR</EyebrowLabel>
        <h2 className="mt-1 font-serif text-3xl font-bold tracking-tight text-foreground">
          After-action review
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Illustrative values only. Final scores would be calculated from recorded session data.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Task completion">
          <p className="font-serif text-4xl font-bold"># {AAR_SUMMARY.taskCompletion}%</p>
        </Card>
        <Card title="Assessment score">
          <p className="font-serif text-4xl font-bold"># {AAR_SUMMARY.assessmentScore}/100</p>
        </Card>
        <Card title="Previous session">
          <p className="font-serif text-4xl font-bold"># {AAR_SUMMARY.previousScore}/100</p>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title={`Timeline · ${AAR_SUMMARY.session}`}>
          <ul className="divide-y divide-border">
            {AAR_SUMMARY.timeline.map((item) => (
              <li key={item.time + item.event} className="flex items-center gap-4 py-3 text-sm">
                <span className="w-14 font-mono text-xs text-muted-foreground">{item.time}</span>
                <span className="flex-1">{item.event}</span>
                <StatusPill status={timelineKinds[item.kind] ?? item.kind} />
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Report queue">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <TableHead columns={["Report", "Trainee", "Session", "Status", ""]} />
              <tbody>
                {REPORTS.map((report) => (
                  <tr key={report.id} className="border-b border-border/60">
                    <td className="py-3 pr-4 font-mono text-xs">{report.id}</td>
                    <td className="py-3 pr-4">{report.trainee}</td>
                    <td className="py-3 pr-4 font-mono text-xs">{report.session}</td>
                    <td className="py-3 pr-4"><StatusPill status={report.status} /></td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" disabled title="Export is not connected yet">PDF</Button>
                        <Button variant="outline" size="sm" disabled title="Export is not connected yet">CSV</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function AiModule() {
  return (
    <div className="space-y-6">
      <div>
        <EyebrowLabel>AI analysis</EyebrowLabel>
        <h2 className="mt-1 font-serif text-3xl font-bold tracking-tight text-foreground">
          Decision log
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Each automated decision shows its evidence, reason, and model version so it can be checked.
        </p>
      </div>
      {AI_DECISIONS.map((decision) => (
        <Card
          key={decision.id}
          title={`${decision.classification} · ${decision.trainee}`}
          action={<span className="font-mono text-xs text-muted-foreground">{decision.id}</span>}
        >
          <dl className="grid gap-4 text-sm md:grid-cols-2 xl:grid-cols-4">
            <Field label="Session" value={decision.session} />
            <Field label="Confidence" value={`${Math.round(decision.confidence * 100)}%`} />
            <Field label="Model" value={decision.model} />
            <Field label="Instructor override" value={decision.override} />
            <Field label="Evidence" value={decision.evidence} wide />
            <Field label="Difficulty" value={`${decision.difficultyBefore} → ${decision.difficultyAfter}`} />
            <Field label="Reason" value={decision.reason} />
            <Field label="Improved after adjustment" value={decision.improved} />
          </dl>
        </Card>
      ))}
    </div>
  );
}

function Field({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "md:col-span-2 xl:col-span-2" : ""}>
      <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-foreground">{value}</dd>
    </div>
  );
}

export function SettingsModule() {
  return (
    <div className="space-y-6">
      <div>
        <EyebrowLabel>System settings</EyebrowLabel>
        <h2 className="mt-1 font-serif text-3xl font-bold tracking-tight text-foreground">
          Roles and audit
        </h2>
      </div>
      <Card title="Role access">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <TableHead columns={["Role", "Access"]} />
            <tbody>
              {ROLE_ACCESS.map((row) => (
                <tr key={row.role} className="border-b border-border/60">
                  <td className="py-3 pr-4 font-medium">{row.role}</td>
                  <td className="py-3 text-muted-foreground">{row.access}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card title="Audit log">
        <ul className="divide-y divide-border">
          {AUDIT_LOG.map((entry) => (
            <li key={entry.time + entry.action} className="grid gap-1 py-3 text-sm md:grid-cols-[12rem_1fr_1fr]">
              <span className="font-mono text-xs text-muted-foreground">{entry.time}</span>
              <span>{entry.action}</span>
              <span className="text-muted-foreground">{entry.actor} · {entry.target}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
