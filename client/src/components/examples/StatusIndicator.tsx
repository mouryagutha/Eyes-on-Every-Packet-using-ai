import { StatusIndicator } from "../StatusIndicator";

export default function StatusIndicatorExample() {
  return (
    <div className="flex gap-4 p-8">
      <StatusIndicator status="connected" />
      <StatusIndicator status="reconnecting" />
      <StatusIndicator status="disconnected" />
    </div>
  );
}
