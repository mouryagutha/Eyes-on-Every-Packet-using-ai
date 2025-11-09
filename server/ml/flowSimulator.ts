import type { NetworkFlow } from "./featureExtractor";

export class FlowSimulator {
  private sourceIPs = [
    "192.168.1.105", "172.16.0.88", "10.1.1.23", "203.0.113.45",
    "198.51.100.72", "192.0.2.156", "172.31.255.12", "10.0.0.199"
  ];

  private destinationIPs = [
    "10.0.0.50", "10.0.0.51", "10.0.0.52", "10.0.0.53"
  ];

  generateFlow(type?: "DoS" | "Exploit" | "Scan" | "Brute Force" | "Benign"): NetworkFlow {
    const flowType = type || this.randomFlowType();
    const srcIp = this.randomElement(this.sourceIPs);
    const dstIp = this.randomElement(this.destinationIPs);

    switch (flowType) {
      case "DoS":
        return this.generateDoSFlow(srcIp, dstIp);
      case "Scan":
        return this.generateScanFlow(srcIp, dstIp);
      case "Brute Force":
        return this.generateBruteForceFlow(srcIp, dstIp);
      case "Exploit":
        return this.generateExploitFlow(srcIp, dstIp);
      default:
        return this.generateBenignFlow(srcIp, dstIp);
    }
  }

  private generateDoSFlow(srcIp: string, dstIp: string): NetworkFlow {
    const baseTime = Date.now();
    const packetCount = this.randomInt(200, 500);
    const packets = Array.from({ length: packetCount }, (_, i) => ({
      size: this.randomInt(40, 100),
      timestamp: baseTime + i * this.randomInt(1, 5),
      flags: ['SYN', 'RST'][Math.floor(Math.random() * 2)] ? ['SYN'] : ['RST'],
    }));

    return {
      srcIp,
      dstIp,
      srcPort: this.randomInt(1024, 65535),
      dstPort: 80,
      protocol: "TCP",
      packets,
    };
  }

  private generateScanFlow(srcIp: string, dstIp: string): NetworkFlow {
    const baseTime = Date.now();
    const packets = Array.from({ length: this.randomInt(2, 6) }, (_, i) => ({
      size: this.randomInt(40, 80),
      timestamp: baseTime + i * this.randomInt(50, 200),
      flags: ['SYN'],
    }));

    return {
      srcIp,
      dstIp,
      srcPort: this.randomInt(1024, 65535),
      dstPort: this.randomInt(1024, 65535),
      protocol: "TCP",
      packets,
    };
  }

  private generateBruteForceFlow(srcIp: string, dstIp: string): NetworkFlow {
    const baseTime = Date.now();
    const servicePorts = [22, 3389, 21, 23];
    const packets = Array.from({ length: this.randomInt(10, 40) }, (_, i) => ({
      size: this.randomInt(60, 150),
      timestamp: baseTime + i * this.randomInt(100, 500),
      flags: ['SYN', 'ACK'],
    }));

    return {
      srcIp,
      dstIp,
      srcPort: this.randomInt(1024, 65535),
      dstPort: this.randomElement(servicePorts),
      protocol: "TCP",
      packets,
    };
  }

  private generateExploitFlow(srcIp: string, dstIp: string): NetworkFlow {
    const baseTime = Date.now();
    const packets = Array.from({ length: this.randomInt(15, 50) }, (_, i) => ({
      size: this.randomInt(1200, 1500), // Large packets
      timestamp: baseTime + i * this.randomInt(50, 300),
      flags: ['SYN', 'ACK'],
    }));

    return {
      srcIp,
      dstIp,
      srcPort: this.randomInt(1024, 65535),
      dstPort: [445, 135, 139][Math.floor(Math.random() * 3)],
      protocol: "TCP",
      packets,
    };
  }

  private generateBenignFlow(srcIp: string, dstIp: string): NetworkFlow {
    const baseTime = Date.now();
    const packets = Array.from({ length: this.randomInt(10, 100) }, (_, i) => ({
      size: this.randomInt(500, 1000),
      timestamp: baseTime + i * this.randomInt(10, 100),
      flags: ['ACK'],
    }));

    return {
      srcIp,
      dstIp,
      srcPort: this.randomInt(1024, 65535),
      dstPort: [80, 443][Math.floor(Math.random() * 2)],
      protocol: "TCP",
      packets,
    };
  }

  private randomFlowType(): "DoS" | "Exploit" | "Scan" | "Brute Force" | "Benign" {
    const rand = Math.random();
    if (rand < 0.15) return "DoS";
    if (rand < 0.30) return "Scan";
    if (rand < 0.45) return "Brute Force";
    if (rand < 0.60) return "Exploit";
    return "Benign";
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private randomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
}
