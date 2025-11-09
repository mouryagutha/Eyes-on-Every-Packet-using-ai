import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Shield, Search } from "lucide-react";
import { useState } from "react";

interface IPBlockingPanelProps {
  //todo: remove mock functionality
  blockedIPs?: string[];
  onBlock?: (ip: string) => void;
  onUnblock?: (ip: string) => void;
}

export function IPBlockingPanel({ blockedIPs, onBlock, onUnblock }: IPBlockingPanelProps) {
  const [ipInput, setIpInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  //todo: remove mock functionality
  const mockBlockedIPs = blockedIPs || [
    "192.168.1.105",
    "172.16.0.88",
    "198.51.100.72",
    "203.0.113.45",
  ];

  const handleBlock = () => {
    if (ipInput.trim()) {
      onBlock?.(ipInput.trim());
      console.log("Block IP:", ipInput);
      setIpInput("");
    }
  };

  const filteredIPs = mockBlockedIPs.filter(ip => 
    ip.toLowerCase().includes(searchQuery.toLowerCase())
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
          <Button onClick={handleBlock} data-testid="button-block-submit">
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
            {filteredIPs.map((ip) => (
              <div
                key={ip}
                className="flex items-center justify-between rounded-md border border-border bg-card p-3 hover-elevate"
                data-testid={`blocked-ip-${ip}`}
              >
                <code className="font-mono text-sm text-foreground">{ip}</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    onUnblock?.(ip);
                    console.log("Unblock IP:", ip);
                  }}
                  data-testid={`button-unblock-${ip}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {filteredIPs.length === 0 && (
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
