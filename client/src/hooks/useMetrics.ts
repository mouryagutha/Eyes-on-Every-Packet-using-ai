import { useQuery } from "@tanstack/react-query";
import type { Metrics } from "@shared/schema";

export function useMetrics() {
  return useQuery<Metrics>({
    queryKey: ["/api/metrics"],
    refetchInterval: 5000, // Refetch every 5 seconds
  });
}
