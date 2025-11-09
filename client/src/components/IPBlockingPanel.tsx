import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Shield, Search } from "lucide-react";
import { useState } from "react";
import { useBlockedIPs } from "@/hooks/useBlockedIPs";

export function IPBlockingPanel() {
  const { blockedIPs, isLoading, blockIP, unblockIP, isBlocking, isUnblocking } = useBlockedIPs();
  const [ipInput, setIpInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleBlock = () => {
    if (ipInput.trim()) {
      blockIP({ ipAddress: ipInput.trim(), reason: "Manually blocked" });
      setIpInput("");
    }
  };

  const filteredIPs = blockedIPs.filter(ip => 
    ip.ipAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card data-testid="card-ip-blocking">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">IP Blocking</CardTitle>
        <p className="text-xs text-muted-foreground">Manage blocked addresses</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter IP address..."
            value={ipInput}
            onChange={(e) => setIpInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleBlock()}
            className="font-mono"
            data-testid="input-block-ip"
          />
          <Button onClick={handleBlock} disabled={isBlocking || !ipInput.trim()} data-testid="button-block-submit">
            <Shield className="h-4 w-4 mr-2" />
            Block
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search blocked IPs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 font-mono"
            data-testid="input-search-blocked"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Blocked IPs ({filteredIPs.length})
            </span>
          </div>
          
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {isLoading && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Loading blocked IPs...
              </p>
            )}
            {!isLoading && filteredIPs.map((blockedIP) => (
              <div
                key={blockedIP.id}
                className="flex items-center justify-between rounded-md border border-border bg-card p-3 hover-elevate"
                data-testid={`blocked-ip-${blockedIP.ipAddress}`}
              >
                <code className="font-mono text-sm text-foreground">{blockedIP.ipAddress}</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => unblockIP(blockedIP.ipAddress)}
                  disabled={isUnblocking}
                  data-testid={`button-unblock-${blockedIP.ipAddress}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {!isLoading && filteredIPs.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No blocked IPs found
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
