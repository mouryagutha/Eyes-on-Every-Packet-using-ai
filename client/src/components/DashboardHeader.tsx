import { Activity } from "lucide-react";
import { StatusIndicator } from "./StatusIndicator";
import { ThemeToggle } from "./ThemeToggle";

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Threat Hunting Dashboard
            </h1>
            <p className="text-xs text-muted-foreground">
              Real-time AI-powered network monitoring
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <StatusIndicator status="connected" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
