import { MetricCard } from "../MetricCard";
import { Shield, AlertTriangle, Activity, Users } from "lucide-react";

export default function MetricCardExample() {
  return (
    <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Threats Detected"
        value="1,247"
        icon={AlertTriangle}
        trend={{ value: 12, direction: "up" }}
        testId="metric-threats"
      />
      <MetricCard
        title="Blocked IPs"
        value="89"
        icon={Shield}
        trend={{ value: 5, direction: "down" }}
        testId="metric-blocked"
      />
      <MetricCard
        title="Avg Confidence"
        value="94.2%"
        icon={Activity}
        testId="metric-confidence"
      />
      <MetricCard
        title="Active Sessions"
        value="342"
        icon={Users}
        trend={{ value: 8, direction: "up" }}
        testId="metric-sessions"
      />
    </div>
  );
}
