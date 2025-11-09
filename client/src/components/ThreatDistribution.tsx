import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DistributionData {
  type: string;
  count: number;
  color: string;
}

interface ThreatDistributionProps {
  //todo: remove mock functionality
  data?: DistributionData[];
}

export function ThreatDistribution({ data }: ThreatDistributionProps) {
  //todo: remove mock functionality - replace with real data from backend
  const distributionData: DistributionData[] = data || [
    { type: "DoS", count: 145, color: "hsl(0, 84%, 60%)" },
    { type: "Exploit", count: 89, color: "hsl(30, 90%, 55%)" },
    { type: "Scan", count: 67, color: "hsl(245, 158, 11%)" },
    { type: "Brute Force", count: 34, color: "hsl(270, 70%, 60%)" },
  ];

  const total = distributionData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card data-testid="card-threat-distribution">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Attack Type Distribution</CardTitle>
        <p className="text-xs text-muted-foreground">Classification breakdown</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {distributionData.map((item) => {
          const percentage = ((item.count / total) * 100).toFixed(1);
          return (
            <div key={item.type} className="space-y-2" data-testid={`distribution-${item.type.toLowerCase()}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {item.count}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{percentage}%</span>
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
