import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef } from "react";

interface ThreatTimelineProps {
  //todo: remove mock functionality - replace with real data
  data?: Array<{ time: string; count: number }>;
}

export function ThreatTimeline({ data }: ThreatTimelineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    //todo: remove mock functionality - this will be replaced with Chart.js
    const mockData = data || Array.from({ length: 20 }, (_, i) => ({
      time: `${i}:00`,
      count: Math.floor(Math.random() * 50) + 10,
    }));

    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const maxCount = Math.max(...mockData.map(d => d.count));
    const xStep = width / (mockData.length - 1);
    
    ctx.strokeStyle = "hsl(192, 91%, 50%)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    mockData.forEach((point, i) => {
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
