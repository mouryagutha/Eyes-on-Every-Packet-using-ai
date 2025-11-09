import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, ChevronDown } from "lucide-react";
import { useState } from "react";

interface ThreatEvent {
  id: string;
  timestamp: string;
  srcIp: string;
  dstIp: string;
  type: "DoS" | "Exploit" | "Scan" | "Brute Force";
  severity: "critical" | "high" | "medium" | "low";
  confidence: number;
}

interface ThreatEventTableProps {
  //todo: remove mock functionality
  events?: ThreatEvent[];
  onBlock?: (ip: string) => void;
}

export function ThreatEventTable({ events, onBlock }: ThreatEventTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  //todo: remove mock functionality - replace with real-time data
  const mockEvents: ThreatEvent[] = events || [
    { id: "1", timestamp: "14:32:18", srcIp: "192.168.1.105", dstIp: "10.0.0.50", type: "DoS", severity: "critical", confidence: 98 },
    { id: "2", timestamp: "14:31:45", srcIp: "172.16.0.88", dstIp: "10.0.0.50", type: "Exploit", severity: "high", confidence: 92 },
    { id: "3", timestamp: "14:30:12", srcIp: "10.1.1.23", dstIp: "10.0.0.51", type: "Scan", severity: "medium", confidence: 85 },
    { id: "4", timestamp: "14:29:33", srcIp: "203.0.113.45", dstIp: "10.0.0.50", type: "Brute Force", severity: "high", confidence: 89 },
    { id: "5", timestamp: "14:28:01", srcIp: "198.51.100.72", dstIp: "10.0.0.52", type: "DoS", severity: "critical", confidence: 96 },
  ];

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
              {mockEvents.map((event) => (
                <tr
                  key={event.id}
                  className={`border-b border-border border-l-4 ${getSeverityColor(event.severity)} hover-elevate cursor-pointer`}
                  onClick={() => setExpandedRow(expandedRow === event.id ? null : event.id)}
                  data-testid={`row-event-${event.id}`}
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-foreground">{event.timestamp}</span>
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
                        onBlock?.(event.srcIp);
                        console.log("Block IP:", event.srcIp);
                      }}
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
