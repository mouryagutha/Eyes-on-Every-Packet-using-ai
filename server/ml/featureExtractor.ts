export interface NetworkFlow {
  srcIp: string;
  dstIp: string;
  srcPort: number;
  dstPort: number;
  protocol: string;
  packets: Array<{
    size: number;
    timestamp: number;
    flags?: string[];
  }>;
}

export interface FlowFeatures {
  totalPackets: number;
  totalBytes: number;
  avgPacketSize: number;
  duration: number;
  packetsPerSec: number;
  bytesPerSec: number;
  synCount: number;
  finCount: number;
  rstCount: number;
}

export class FeatureExtractor {
  extract(flow: NetworkFlow): FlowFeatures {
    const { packets } = flow;
    
    if (packets.length === 0) {
      return this.getEmptyFeatures();
    }

    const totalPackets = packets.length;
    const totalBytes = packets.reduce((sum, p) => sum + p.size, 0);
    const avgPacketSize = totalBytes / totalPackets;

    const timestamps = packets.map(p => p.timestamp);
    const duration = (Math.max(...timestamps) - Math.min(...timestamps)) / 1000; // in seconds
    const durationSafe = Math.max(duration, 0.001); // avoid division by zero

    const packetsPerSec = totalPackets / durationSafe;
    const bytesPerSec = totalBytes / durationSafe;

    let synCount = 0;
    let finCount = 0;
    let rstCount = 0;

    packets.forEach(packet => {
      if (packet.flags) {
        if (packet.flags.includes('SYN')) synCount++;
        if (packet.flags.includes('FIN')) finCount++;
        if (packet.flags.includes('RST')) rstCount++;
      }
    });

    return {
      totalPackets,
      totalBytes,
      avgPacketSize,
      duration: durationSafe,
      packetsPerSec,
      bytesPerSec,
      synCount,
      finCount,
      rstCount,
    };
  }

  private getEmptyFeatures(): FlowFeatures {
    return {
      totalPackets: 0,
      totalBytes: 0,
      avgPacketSize: 0,
      duration: 0,
      packetsPerSec: 0,
      bytesPerSec: 0,
      synCount: 0,
      finCount: 0,
      rstCount: 0,
    };
  }
}
