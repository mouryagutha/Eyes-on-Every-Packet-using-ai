import { 
  type ThreatEvent, 
  type InsertThreatEvent,
  type BlockedIP,
  type InsertBlockedIP,
  type Metrics
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Threat Events
  getThreatEvents(limit?: number): Promise<ThreatEvent[]>;
  getThreatEvent(id: string): Promise<ThreatEvent | undefined>;
  createThreatEvent(event: InsertThreatEvent): Promise<ThreatEvent>;
  
  // Blocked IPs
  getBlockedIPs(): Promise<BlockedIP[]>;
  getBlockedIP(ipAddress: string): Promise<BlockedIP | undefined>;
  blockIP(ip: InsertBlockedIP): Promise<BlockedIP>;
  unblockIP(ipAddress: string): Promise<boolean>;
  
  // Metrics
  getMetrics(): Promise<Metrics>;
}

export class MemStorage implements IStorage {
  private threatEvents: Map<string, ThreatEvent>;
  private blockedIPs: Map<string, BlockedIP>;

  constructor() {
    this.threatEvents = new Map();
    this.blockedIPs = new Map();
  }

  async getThreatEvents(limit: number = 100): Promise<ThreatEvent[]> {
    const events = Array.from(this.threatEvents.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return events.slice(0, limit);
  }

  async getThreatEvent(id: string): Promise<ThreatEvent | undefined> {
    return this.threatEvents.get(id);
  }

  async createThreatEvent(insertEvent: InsertThreatEvent): Promise<ThreatEvent> {
    const id = randomUUID();
    const event: ThreatEvent = { ...insertEvent, id };
    this.threatEvents.set(id, event);
    return event;
  }

  async getBlockedIPs(): Promise<BlockedIP[]> {
    return Array.from(this.blockedIPs.values())
      .sort((a, b) => new Date(b.blockedAt).getTime() - new Date(a.blockedAt).getTime());
  }

  async getBlockedIP(ipAddress: string): Promise<BlockedIP | undefined> {
    return this.blockedIPs.get(ipAddress);
  }

  async blockIP(insertIP: InsertBlockedIP): Promise<BlockedIP> {
    const id = randomUUID();
    const blockedIP: BlockedIP = { ...insertIP, id };
    this.blockedIPs.set(insertIP.ipAddress, blockedIP);
    return blockedIP;
  }

  async unblockIP(ipAddress: string): Promise<boolean> {
    return this.blockedIPs.delete(ipAddress);
  }

  async getMetrics(): Promise<Metrics> {
    const events = await this.getThreatEvents();
    const blockedIPs = await this.getBlockedIPs();
    
    const totalThreats = events.length;
    const avgConfidence = events.length > 0 
      ? events.reduce((sum, e) => sum + e.confidence, 0) / events.length 
      : 0;
    
    const threatsByType: Record<string, number> = {};
    events.forEach(event => {
      threatsByType[event.type] = (threatsByType[event.type] || 0) + 1;
    });
    
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const recentEvents = events.filter(e => new Date(e.timestamp) > last24Hours);
    
    const hourlyActivity = new Map<string, number>();
    recentEvents.forEach(event => {
      const hour = new Date(event.timestamp).toISOString().slice(0, 13);
      hourlyActivity.set(hour, (hourlyActivity.get(hour) || 0) + 1);
    });
    
    const recentActivity = Array.from(hourlyActivity.entries())
      .map(([time, count]) => ({ time, count }))
      .sort((a, b) => a.time.localeCompare(b.time))
      .slice(-20);
    
    return {
      totalThreats,
      blockedIPs: blockedIPs.length,
      avgConfidence: Math.round(avgConfidence * 10) / 10,
      activeSessions: Math.floor(Math.random() * 500) + 100,
      threatsByType,
      recentActivity,
    };
  }
}

export const storage = new MemStorage();
