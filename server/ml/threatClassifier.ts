import type { FlowFeatures } from "./featureExtractor";

export interface ThreatClassification {
  type: "DoS" | "Exploit" | "Scan" | "Brute Force" | "Benign";
  severity: "critical" | "high" | "medium" | "low";
  confidence: number;
}

export class ThreatClassifier {
  classify(
    features: FlowFeatures,
    srcPort: number,
    dstPort: number,
    protocol: string
  ): ThreatClassification {
    // Rule-based threat detection logic
    // In production, this would be a trained Random Forest model
    
    // DoS Detection: High packet rate, high byte rate, many RST/SYN packets
    if (this.isDoS(features)) {
      return {
        type: "DoS",
        severity: "critical",
        confidence: this.calculateConfidence(features, "DoS"),
      };
    }

    // Port Scan Detection: Low packet count, distributed across ports
    if (this.isPortScan(features, dstPort)) {
      return {
        type: "Scan",
        severity: "medium",
        confidence: this.calculateConfidence(features, "Scan"),
      };
    }

    // Brute Force Detection: Common service ports, repeated connections
    if (this.isBruteForce(features, dstPort)) {
      return {
        type: "Brute Force",
        severity: "high",
        confidence: this.calculateConfidence(features, "Brute Force"),
      };
    }

    // Exploit Detection: Unusual packet sizes, suspicious ports
    if (this.isExploit(features, dstPort, protocol)) {
      return {
        type: "Exploit",
        severity: "high",
        confidence: this.calculateConfidence(features, "Exploit"),
      };
    }

    // Default: Benign traffic
    return {
      type: "Benign",
      severity: "low",
      confidence: this.calculateConfidence(features, "Benign"),
    };
  }

  private isDoS(features: FlowFeatures): boolean {
    // High packet rate (>1000 pps) or high bytes/sec (>10MB/s)
    const highPacketRate = features.packetsPerSec > 1000;
    const highByteRate = features.bytesPerSec > 10 * 1024 * 1024;
    const manyRstPackets = features.rstCount > 50;
    const manySynPackets = features.synCount > 100;

    return (highPacketRate || highByteRate) && (manyRstPackets || manySynPackets);
  }

  private isPortScan(features: FlowFeatures, dstPort: number): boolean {
    // Low packet count per flow, unusual ports
    const lowPacketCount = features.totalPackets < 10;
    const quickDuration = features.duration < 1;
    const unusualPort = dstPort > 1024 && dstPort < 65535;

    return lowPacketCount && quickDuration && unusualPort;
  }

  private isBruteForce(features: FlowFeatures, dstPort: number): boolean {
    // Targeting common service ports: SSH(22), RDP(3389), FTP(21), HTTP(80/443)
    const commonServicePorts = [21, 22, 23, 80, 443, 3389, 3306, 5432];
    const isServicePort = commonServicePorts.includes(dstPort);
    const moderatePackets = features.totalPackets > 5 && features.totalPackets < 100;
    const shortDuration = features.duration < 5;

    return isServicePort && moderatePackets && shortDuration;
  }

  private isExploit(features: FlowFeatures, dstPort: number, protocol: string): boolean {
    // Large packets, unusual protocols, or specific exploit patterns
    const largeAvgPacketSize = features.avgPacketSize > 1200;
    const unusualPort = dstPort === 445 || dstPort === 135 || dstPort === 139; // SMB, RPC
    const moderatePackets = features.totalPackets > 10;

    return (largeAvgPacketSize || unusualPort) && moderatePackets;
  }

  private calculateConfidence(features: FlowFeatures, type: string): number {
    // Confidence scoring based on feature strength
    let confidence = 50; // base confidence

    if (type === "DoS") {
      confidence += Math.min(features.packetsPerSec / 50, 30);
      confidence += Math.min(features.rstCount / 10, 15);
    } else if (type === "Scan") {
      confidence += features.totalPackets < 5 ? 25 : 10;
      confidence += features.duration < 0.5 ? 15 : 5;
    } else if (type === "Brute Force") {
      confidence += Math.min(features.totalPackets / 5, 20);
      confidence += features.duration < 2 ? 20 : 10;
    } else if (type === "Exploit") {
      confidence += Math.min(features.avgPacketSize / 50, 25);
      confidence += Math.min(features.totalPackets / 5, 15);
    } else {
      confidence += 30; // benign traffic gets bonus confidence
    }

    return Math.min(Math.max(Math.round(confidence), 0), 100);
  }
}
