import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useState } from "react";
import { useThreatEvents } from "@/hooks/useThreatEvents";
import { useBlockedIPs } from "@/hooks/useBlockedIPs";
import type { ThreatEvent } from "@shared/schema";

export function ThreatEventTable() {
  const { data: events, isLoading } = useThreatEvents(50);
  const { blockIP, isBlocking } = useBlockedIPs();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const handleBlock = (ip: string) => {
    blockIP({ ipAddress: ip, reason: "Manually blocked from threat event" });
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: "border-l-threat-critical",
      high: "border-l-threat-high",
      medium: "border-l-threat-medium",
      low: "border-l-threat-low",
    };
    return colors[severity as keyof typeof colors] || "";
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      critical: "destructive",
      high: "destructive",
      medium: "outline",
      low: "outline",
    };
    return variants[severity as keyof typeof variants] || "outline";
  };

  return (
    <Card data-testid="card-threat-events">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recent Threat Events</CardTitle>
        <p className="text-xs text-muted-foreground">Real-time detection log</p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Source IP
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Severity
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Confidence
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Loading threat events...
                  </td>
                </tr>
              )}
              {!isLoading && events && events.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No threat events detected yet
                  </td>
                </tr>
              )}
              {!isLoading && events && events.map((event) => (
                <tr
                  key={event.id}
                  className={`border-b border-border border-l-4 ${getSeverityColor(event.severity)} hover-elevate cursor-pointer`}
                  onClick={() => setExpandedRow(expandedRow === event.id ? null : event.id)}
                  data-testid={`row-event-${event.id}`}
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-foreground">{formatTime(event.timestamp)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <code className="rounded bg-muted px-2 py-1 font-mono text-xs text-foreground">
                      {event.srcIp}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium">{event.type}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={getSeverityBadge(event.severity) as any} className="uppercase">
                      {event.severity}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {event.confidence}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBlock(event.srcIp);
                      }}
                      disabled={isBlocking}
                      data-testid={`button-block-${event.id}`}
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      Block
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
