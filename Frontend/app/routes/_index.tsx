import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";

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
import { setDemoRole, type DemoRole } from "@/lib/demo-session";

export function meta() {
  return [{ title: "Sign in · Drone Training Simulator" }];
}

type LoginErrors = { username?: string; password?: string };

const ACCOUNT_OPTIONS: { value: DemoRole; label: string }[] = [
  { value: "trainee", label: "Trainee" },
  { value: "admin", label: "Admin console" },
];

export default function LoginRoute() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<DemoRole>("trainee");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: LoginErrors = {};
    if (!username.trim()) next.username = "Enter your username.";
    if (!password) next.password = "Enter your password.";
    else if (password.length < 6)
      next.password = "Password must be at least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setDemoRole(accountType);
    navigate(accountType === "admin" ? "/admin" : "/profile");
  }

  return (
    <PageFrame showNav={false}>
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-sm">
          <EyebrowLabel>Demo access</EyebrowLabel>
          <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-foreground">
            Sign in
          </h1>
          <p className="mt-2 font-serif text-base italic text-primary">
            Begin your flight training session.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="account-type">Account type</Label>
              <Select
                value={accountType}
                onValueChange={(value) => setAccountType(value as DemoRole)}
              >
                <SelectTrigger id="account-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                aria-invalid={Boolean(errors.username)}
              />
              {errors.username && (
                <p role="alert" className="text-sm text-destructive">
                  {errors.username}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={Boolean(errors.password)}
              />
              {errors.password && (
                <p role="alert" className="text-sm text-destructive">
                  {errors.password}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Demo mode: any username and a password of 6+ characters will
                sign in.
              </p>
            </div>

            <Button type="submit" className="w-full">
              Log in
            </Button>
          </form>
        </div>
      </div>
    </PageFrame>
  );
}
