import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { storage } from "./storage";
import { ThreatDetector } from "./ml/threatDetector";
import { FlowSimulator } from "./ml/flowSimulator";
import { insertBlockedIPSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Initialize ML components
  const detector = new ThreatDetector();
  const simulator = new FlowSimulator();

  // API Routes
  
  // Get recent threat events
  app.get("/api/threats", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const events = await storage.getThreatEvents(limit);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch threat events" });
    }
  });

  // Get dashboard metrics
  app.get("/api/metrics", async (req, res) => {
    try {
      const metrics = await storage.getMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  });

  // Get blocked IPs
  app.get("/api/blocked-ips", async (req, res) => {
    try {
      const blockedIPs = await storage.getBlockedIPs();
      res.json(blockedIPs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blocked IPs" });
    }
  });

  // Block an IP
  app.post("/api/blocked-ips", async (req, res) => {
    try {
      const parsed = insertBlockedIPSchema.safeParse({
        ...req.body,
        blockedAt: new Date().toISOString(),
        threatCount: req.body.threatCount || 0,
      });

      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid request data", details: parsed.error });
      }

      const blockedIP = await storage.blockIP(parsed.data);
      io.emit("ip-blocked", blockedIP);
      res.json(blockedIP);
    } catch (error) {
      res.status(500).json({ error: "Failed to block IP" });
    }
  });

  // Unblock an IP
  app.delete("/api/blocked-ips/:ip", async (req, res) => {
    try {
      const success = await storage.unblockIP(req.params.ip);
      if (success) {
        io.emit("ip-unblocked", { ipAddress: req.params.ip });
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "IP not found in blocked list" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to unblock IP" });
    }
  });

  // WebSocket connection handling
  io.on("connection", (socket: any) => {
    console.log("Client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  // Background threat detection service
  // Simulates network traffic and detects threats in real-time
  let detectionInterval: NodeJS.Timeout;

  function startThreatDetection() {
    detectionInterval = setInterval(async () => {
      try {
        // Generate random number of flows (1-3 per interval)
        const flowCount = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < flowCount; i++) {
          // Generate a simulated network flow
          const flow = simulator.generateFlow();
          
          // Detect threats using ML
          const result = detector.detect(flow);
          
          // Only store and emit non-benign threats
          if (result.classification.type !== "Benign") {
            const threatEvent = await storage.createThreatEvent(result.threatEvent);
            
            // Emit to all connected clients
            io.emit("new-threat", threatEvent);
            
            // Check if IP should be auto-blocked (high severity)
            if (threatEvent.severity === "critical" && threatEvent.confidence > 95) {
              const existingBlock = await storage.getBlockedIP(threatEvent.srcIp);
              if (!existingBlock) {
                const blockedIP = await storage.blockIP({
                  ipAddress: threatEvent.srcIp,
                  blockedAt: new Date().toISOString(),
                  reason: `Auto-blocked: ${threatEvent.type} attack detected`,
                  threatCount: 1,
                });
                io.emit("ip-blocked", blockedIP);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error in threat detection:", error);
      }
    }, 3000); // Run every 3 seconds
  }

  // Start the detection service
  startThreatDetection();

  // Cleanup on server shutdown
  process.on("SIGINT", () => {
    clearInterval(detectionInterval);
    process.exit();
  });

  return httpServer;
}
