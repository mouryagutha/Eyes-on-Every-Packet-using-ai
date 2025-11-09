import { Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StatusIndicatorProps {
  status: "connected" | "disconnected" | "reconnecting";
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  const statusConfig = {
    connected: {
      label: "Live",
      color: "text-status-online",
      pulse: true,
    },
    disconnected: {
      label: "Offline",
      color: "text-status-offline",
      pulse: false,
    },
    reconnecting: {
      label: "Reconnecting",
      color: "text-status-away",
      pulse: true,
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant="outline" className="gap-2" data-testid="status-indicator">
      <div className="relative">
        <Circle
          className={`h-2 w-2 fill-current ${config.color}`}
          data-testid="status-dot"
        />
        {config.pulse && (
          <Circle
            className={`absolute inset-0 h-2 w-2 animate-ping fill-current ${config.color}`}
          />
        )}
      </div>
      <span className="text-xs font-medium">{config.label}</span>
    </Badge>
  );
}
