import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricCard } from "@/components/MetricCard";
import { ThreatTimeline } from "@/components/ThreatTimeline";
import { ThreatDistribution } from "@/components/ThreatDistribution";
import { ThreatEventTable } from "@/components/ThreatEventTable";
import { IPBlockingPanel } from "@/components/IPBlockingPanel";
import { Shield, AlertTriangle, Activity, Users } from "lucide-react";
import { useMetrics } from "@/hooks/useMetrics";

export default function Dashboard() {
  const { data: metrics, isLoading } = useMetrics();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardHeader />
      
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-screen-2xl px-6 py-8">
          {/* Metrics Row */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Threats Detected"
              value={isLoading ? "..." : metrics?.totalThreats.toLocaleString() || "0"}
              icon={AlertTriangle}
              testId="metric-threats"
            />
            <MetricCard
              title="Blocked IPs"
              value={isLoading ? "..." : metrics?.blockedIPs || 0}
              icon={Shield}
              testId="metric-blocked"
            />
            <MetricCard
              title="Avg Confidence"
              value={isLoading ? "..." : `${metrics?.avgConfidence || 0}%`}
              icon={Activity}
              testId="metric-confidence"
            />
            <MetricCard
              title="Active Sessions"
              value={isLoading ? "..." : metrics?.activeSessions || 0}
              icon={Users}
              testId="metric-sessions"
            />
          </div>

          {/* Charts Row */}
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ThreatTimeline data={metrics?.recentActivity} />
            <ThreatDistribution data={metrics?.threatsByType} />
          </div>

          {/* Threat Events and Blocking Panel */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ThreatEventTable />
            </div>
            <div>
              <IPBlockingPanel />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
