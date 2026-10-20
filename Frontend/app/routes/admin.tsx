import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyebrowLabel } from "@/components/training/page-frame";
import {
  AiModule,
  AssessmentsModule,
  LiveModule,
  OverviewModule,
  ReportsModule,
  ScenariosModule,
  SettingsModule,
  TraineeDirectory,
} from "@/components/admin/admin-modules";
import { TraineeDetail } from "@/components/admin/trainee-detail";
import { NOTIFICATIONS, TRAINEES, type TraineeStatus } from "@/lib/admin-sample";
import { clearDemoRole, getDemoRole } from "@/lib/demo-session";

export function meta() {
  return [{ title: "Admin console · Drone Training Simulator" }];
}

const MODULES = [
  { id: "overview", label: "Overview" },
  { id: "trainees", label: "Trainee Management" },
  { id: "live", label: "Live Monitoring" },
  { id: "assessments", label: "Assessments" },
  { id: "scenarios", label: "Scenario Management" },
  { id: "reports", label: "Reports & AAR" },
  { id: "ai", label: "AI Analysis" },
  { id: "settings", label: "System Settings" },
] as const;

type ModuleId = (typeof MODULES)[number]["id"];

export default function AdminRoute() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [module, setModule] = useState<ModuleId>("overview");
  const [selectedTraineeId, setSelectedTraineeId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | TraineeStatus>("all");
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (getDemoRole() !== "admin") {
      navigate("/", { replace: true });
      return;
    }
    setReady(true);
  }, [navigate]);

  if (!ready) return null;

  const selectedTrainee = TRAINEES.find((t) => t.id === selectedTraineeId);

  function openModule(next: ModuleId) {
    setModule(next);
    setSelectedTraineeId(null);
  }

  function openTrainee(id: string) {
    setModule("trainees");
    setSelectedTraineeId(id);
  }

  function handleSearch(value: string) {
    setQuery(value);
    if (value.trim()) {
      setModule("trainees");
      setSelectedTraineeId(null);
    }
  }

  function handleLogout() {
    clearDemoRole();
    navigate("/");
  }

  const activeLabel = MODULES.find((item) => item.id === module)?.label ?? "";

  return (
    <div className="flex h-screen bg-background bg-[linear-gradient(hsl(var(--border)/0.45)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.45)_1px,transparent_1px)] bg-[length:48px_48px]">
      <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card">
        <div className="border-b border-border px-5 py-5">
          <div className="font-serif text-lg font-bold tracking-tight text-foreground">
            Drone Training System
          </div>
          <EyebrowLabel>Admin console · Training management</EyebrowLabel>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {MODULES.map((item, index) => (
            <button
              key={item.id}
              onClick={() => openModule(item.id)}
              aria-current={module === item.id ? "page" : undefined}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                module === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <span className="font-mono text-[11px] opacity-70">{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-border p-4">
          <p className="mb-3 text-sm text-muted-foreground">Signed in as admin</p>
          <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="relative flex shrink-0 items-center justify-between gap-4 border-b border-border bg-background/90 px-6 py-3 backdrop-blur">
          <div className="min-w-0">
            <EyebrowLabel>{activeLabel}</EyebrowLabel>
          </div>
          <div className="flex items-center gap-3">
            <Input
              type="search"
              placeholder="Search trainees by name or ID"
              value={query}
              onChange={(event) => handleSearch(event.target.value)}
              className="w-72"
              aria-label="Search trainees"
            />
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNotifications((open) => !open)}
                aria-expanded={showNotifications}
              >
                Notifications · {NOTIFICATIONS.length}
              </Button>
              {showNotifications && (
                <div className="absolute right-0 top-full z-10 mt-2 w-80 rounded-md border border-border bg-card p-3 shadow-md">
                  <ul className="divide-y divide-border">
                    {NOTIFICATIONS.map((item) => (
                      <li key={item.text} className="py-2 text-sm">
                        <p className="text-foreground">{item.text}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto p-6">
          {module === "overview" && <OverviewModule onOpenTrainee={openTrainee} />}
          {module === "trainees" &&
            (selectedTrainee ? (
              <TraineeDetail
                trainee={selectedTrainee}
                onBack={() => setSelectedTraineeId(null)}
              />
            ) : (
              <TraineeDirectory
                query={query}
                filter={filter}
                onFilterChange={setFilter}
                onOpen={setSelectedTraineeId}
              />
            ))}
          {module === "live" && <LiveModule />}
          {module === "assessments" && <AssessmentsModule />}
          {module === "scenarios" && <ScenariosModule />}
          {module === "reports" && <ReportsModule />}
          {module === "ai" && <AiModule />}
          {module === "settings" && <SettingsModule />}
        </main>
      </div>
    </div>
  );
}
