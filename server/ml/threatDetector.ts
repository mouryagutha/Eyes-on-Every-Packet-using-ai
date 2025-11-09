import { FeatureExtractor, type NetworkFlow } from "./featureExtractor";
import { ThreatClassifier, type ThreatClassification } from "./threatClassifier";
import type { InsertThreatEvent } from "@shared/schema";

export interface DetectionResult {
  threatEvent: InsertThreatEvent;
  classification: ThreatClassification;
}

export class ThreatDetector {
  private featureExtractor: FeatureExtractor;
  private classifier: ThreatClassifier;

  constructor() {
    this.featureExtractor = new FeatureExtractor();
    this.classifier = new ThreatClassifier();
  }

  detect(flow: NetworkFlow): DetectionResult {
    // Extract features from network flow
    const flowFeatures = this.featureExtractor.extract(flow);

    // Classify the threat
    const classification = this.classifier.classify(
      flowFeatures,
      flow.srcPort,
      flow.dstPort,
      flow.protocol
    );

    // Create threat event
    const threatEvent: InsertThreatEvent = {
      timestamp: new Date().toISOString(),
      srcIp: flow.srcIp,
      dstIp: flow.dstIp,
      srcPort: flow.srcPort,
      dstPort: flow.dstPort,
      protocol: flow.protocol,
      type: classification.type,
      severity: classification.severity,
      confidence: classification.confidence,
      flowFeatures,
      blocked: false,
    };

    return {
      threatEvent,
      classification,
    };
  }

  batchDetect(flows: NetworkFlow[]): DetectionResult[] {
    return flows.map(flow => this.detect(flow));
  }
}
