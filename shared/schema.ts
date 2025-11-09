import { z } from "zod";

export const threatEventSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  srcIp: z.string(),
  dstIp: z.string(),
  srcPort: z.number(),
  dstPort: z.number(),
  protocol: z.string(),
  type: z.enum(["DoS", "Exploit", "Scan", "Brute Force", "Benign"]),
  severity: z.enum(["critical", "high", "medium", "low"]),
  confidence: z.number().min(0).max(100),
  flowFeatures: z.object({
    totalPackets: z.number(),
    totalBytes: z.number(),
    avgPacketSize: z.number(),
    duration: z.number(),
    packetsPerSec: z.number(),
    bytesPerSec: z.number(),
    synCount: z.number(),
    finCount: z.number(),
    rstCount: z.number(),
  }),
  abuseScore: z.number().optional(),
  blocked: z.boolean().default(false),
});

export const insertThreatEventSchema = threatEventSchema.omit({ id: true });

export type ThreatEvent = z.infer<typeof threatEventSchema>;
export type InsertThreatEvent = z.infer<typeof insertThreatEventSchema>;

export const blockedIPSchema = z.object({
  id: z.string(),
  ipAddress: z.string(),
  blockedAt: z.string(),
  reason: z.string(),
  threatCount: z.number().default(0),
});

export const insertBlockedIPSchema = blockedIPSchema.omit({ id: true });

export type BlockedIP = z.infer<typeof blockedIPSchema>;
export type InsertBlockedIP = z.infer<typeof insertBlockedIPSchema>;

export const metricsSchema = z.object({
  totalThreats: z.number(),
  blockedIPs: z.number(),
  avgConfidence: z.number(),
  activeSessions: z.number(),
  threatsByType: z.record(z.string(), z.number()),
  recentActivity: z.array(z.object({
    time: z.string(),
    count: z.number(),
  })),
});

export type Metrics = z.infer<typeof metricsSchema>;
