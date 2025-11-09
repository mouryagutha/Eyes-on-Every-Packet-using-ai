import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef } from "react";

interface ThreatTimelineProps {
  data?: Array<{ time: string; count: number }>;
}

export function ThreatTimeline({ data }: ThreatTimelineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const timelineData = data || [];

    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    if (timelineData.length === 0) {
      ctx.fillStyle = "hsl(var(--muted-foreground))";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("No activity data yet", width / 2, height / 2);
      return;
    }
    
    const maxCount = Math.max(...timelineData.map(d => d.count), 1);
    const xStep = width / Math.max(timelineData.length - 1, 1);
    
    ctx.strokeStyle = "hsl(192, 91%, 50%)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    timelineData.forEach((point, i) => {
      const x = i * xStep;
      const y = height - (point.count / maxCount) * (height - 20);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    
    ctx.stroke();
    
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "hsla(192, 91%, 50%, 0.3)");
    gradient.addColorStop(1, "hsla(192, 91%, 50%, 0)");
    ctx.fillStyle = gradient;
    ctx.fill();
  }, [data]);

  return (
    <Card data-testid="card-threat-timeline">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Threat Activity Timeline</CardTitle>
        <p className="text-xs text-muted-foreground">Last 24 hours</p>
      </CardHeader>
      <CardContent>
        <canvas
          ref={canvasRef}
          width={800}
          height={250}
          className="w-full"
          data-testid="canvas-timeline"
        />
      </CardContent>
    </Card>
  );
}
