import { NavLink, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { clearDemoRole } from "@/lib/demo-session";

const STEPS = [
  { to: "/profile", label: "Trainee profile" },
  { to: "/environment", label: "Environment" },
  { to: "/simulation", label: "Simulation" },
];

export function PageFrame({
  children,
  showNav = true,
}: {
  children: React.ReactNode;
  showNav?: boolean;
}) {
  const navigate = useNavigate();

  function handleLogout() {
    clearDemoRole();
    navigate("/");
  }

  return (
    <div className="flex h-screen flex-col bg-background bg-[linear-gradient(hsl(var(--border)/0.45)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.45)_1px,transparent_1px)] bg-[length:48px_48px]">
      <header className="flex shrink-0 items-center justify-between gap-6 border-b border-border bg-background/90 px-6 py-4 backdrop-blur">
        <div className="font-serif text-xl font-bold tracking-tight text-foreground">
          Drone Training Simulator
        </div>
        {showNav && (
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-1">
              {STEPS.map((step, index) => (
                <NavLink
                  key={step.to}
                  to={step.to}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`
                  }
                >
                  {index + 1}. {step.label}
                </NavLink>
              ))}
            </nav>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        )}
      </header>
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export function EyebrowLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
      {children}
    </p>
  );
}
