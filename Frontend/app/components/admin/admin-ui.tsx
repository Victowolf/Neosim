export function Card({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-lg border border-border bg-card p-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="font-serif text-lg font-bold text-foreground">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

export function TableHead({ columns }: { columns: string[] }) {
  return (
    <thead className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
      <tr className="border-b border-border">
        {columns.map((column) => (
          <th key={column} className="py-2 pr-4 text-left font-normal last:pr-0">
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
}

const PILL_TONES: Record<string, string> = {
  Completed: "bg-secondary text-secondary-foreground",
  Approved: "bg-secondary text-secondary-foreground",
  Running: "bg-primary text-primary-foreground",
  "In Progress": "bg-primary text-primary-foreground",
  Active: "bg-primary text-primary-foreground",
  Draft: "bg-muted text-foreground",
  "Awaiting review": "bg-muted text-foreground",
  Interrupted: "bg-muted text-foreground",
  "Telemetry lag": "bg-accent text-accent-foreground",
  "Needs Review": "bg-destructive/15 text-destructive",
  Failed: "bg-destructive/15 text-destructive",
  Warning: "bg-destructive/15 text-destructive",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs ${PILL_TONES[status] ?? "bg-muted text-foreground"}`}
    >
      {status}
    </span>
  );
}
