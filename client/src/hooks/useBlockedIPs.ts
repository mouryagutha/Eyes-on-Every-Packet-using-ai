import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { apiRequest } from "@/lib/queryClient";
import type { BlockedIP } from "@shared/schema";

export function useBlockedIPs() {
  const queryClient = useQueryClient();

  const query = useQuery<BlockedIP[]>({
    queryKey: ["/api/blocked-ips"],
  });

  useEffect(() => {
    const socket = getSocket();

    const handleIPBlocked = (blockedIP: BlockedIP) => {
      queryClient.setQueryData<BlockedIP[]>(["/api/blocked-ips"], (old) => {
        if (!old) return [blockedIP];
        const exists = old.find((ip) => ip.ipAddress === blockedIP.ipAddress);
        if (exists) return old;
        return [blockedIP, ...old];
      });
      queryClient.invalidateQueries({ queryKey: ["/api/metrics"] });
    };

    const handleIPUnblocked = ({ ipAddress }: { ipAddress: string }) => {
      queryClient.setQueryData<BlockedIP[]>(["/api/blocked-ips"], (old) => {
        if (!old) return [];
        return old.filter((ip) => ip.ipAddress !== ipAddress);
      });
      queryClient.invalidateQueries({ queryKey: ["/api/metrics"] });
    };

    socket.on("ip-blocked", handleIPBlocked);
    socket.on("ip-unblocked", handleIPUnblocked);

    return () => {
      socket.off("ip-blocked", handleIPBlocked);
      socket.off("ip-unblocked", handleIPUnblocked);
    };
  }, [queryClient]);

  const blockMutation = useMutation({
    mutationFn: async (data: { ipAddress: string; reason: string }) => {
      return apiRequest("POST", "/api/blocked-ips", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blocked-ips"] });
    },
  });

  const unblockMutation = useMutation({
    mutationFn: async (ipAddress: string) => {
      return apiRequest("DELETE", `/api/blocked-ips/${encodeURIComponent(ipAddress)}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blocked-ips"] });
    },
  });

  return {
    blockedIPs: query.data || [],
    isLoading: query.isLoading,
    blockIP: blockMutation.mutate,
    unblockIP: unblockMutation.mutate,
    isBlocking: blockMutation.isPending,
    isUnblocking: unblockMutation.isPending,
  };
}
