import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import type { ThreatEvent } from "@shared/schema";

export function useThreatEvents(limit = 50) {
  const queryClient = useQueryClient();

  const query = useQuery<ThreatEvent[]>({
    queryKey: ["/api/threats", limit],
    refetchInterval: 10000, // Refetch every 10 seconds as fallback
  });

  useEffect(() => {
    const socket = getSocket();

    const handleNewThreat = (threat: ThreatEvent) => {
      queryClient.setQueryData<ThreatEvent[]>(["/api/threats", limit], (old) => {
        if (!old) return [threat];
        return [threat, ...old].slice(0, limit);
      });
    };

    socket.on("new-threat", handleNewThreat);

    return () => {
      socket.off("new-threat", handleNewThreat);
    };
  }, [queryClient, limit]);

  return query;
}
