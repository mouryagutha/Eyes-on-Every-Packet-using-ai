import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  testId?: string;
}

export function MetricCard({ title, value, icon: Icon, trend, testId }: MetricCardProps) {
  return (
    <Card data-testid={testId}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {title}
            </p>
            <p className="mt-2 text-2xl font-bold text-foreground" data-testid={`${testId}-value`}>
              {value}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        
        {trend && (
          <div className="mt-4 flex items-center gap-1">
            {trend.direction === "up" ? (
              <ArrowUp className="h-3 w-3 text-status-online" />
            ) : (
              <ArrowDown className="h-3 w-3 text-destructive" />
            )}
            <span className={`text-xs font-medium ${
              trend.direction === "up" ? "text-status-online" : "text-destructive"
            }`}>
              {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground">vs last hour</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
