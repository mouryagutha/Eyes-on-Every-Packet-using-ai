# 🔥 Eyes on Every Packet - AI-Powered Threat Hunting Platform

> Real-time network threat detection and analysis powered by machine learning

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)](https://socket.io/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [ML Pipeline](#ml-pipeline)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

**Eyes on Every Packet** is a sophisticated, real-time threat hunting dashboard designed for Security Operations Centers (SOCs). It simulates network traffic, detects cybersecurity threats using machine learning techniques, and provides security analysts with actionable insights through an interactive, enterprise-grade dashboard.

The system processes network flows, extracts statistical features, classifies threats into multiple categories, and displays everything in real-time using WebSockets with automatic IP blocking capabilities for critical threats.

### 🎥 Demo

**Live Dashboard Features:**
- Real-time threat detection and visualization
- Interactive threat event table with filtering
- Dynamic charts showing threat distribution and timeline
- One-click IP blocking/unblocking
- WebSocket-powered live updates

## ✨ Features

### 🔍 Threat Detection
- **Multi-Type Classification**: Detects DoS, Brute Force, Port Scans, Exploits, and Benign traffic
- **ML-Based Analysis**: Statistical feature extraction and rule-based classification
- **Confidence Scoring**: 0-100% confidence for each detection
- **Real-Time Processing**: Sub-second latency from detection to display

### 🛡️ Security Operations
- **Auto-Blocking**: Critical threats (>95% confidence) automatically blocked
- **Manual Controls**: Security analysts can block/unblock IPs on-demand
- **Audit Trail**: Complete history of blocked IPs with reasons
- **Threat Prioritization**: Severity levels (Critical, High, Medium, Low)

### 📊 Visualization
- **Metric Cards**: Total threats, blocked IPs, average confidence, active sessions
- **Threat Timeline**: 24-hour activity chart with area visualization
- **Distribution Charts**: Doughnut chart showing threat type breakdown
- **Live Event Feed**: Real-time scrolling threat event table

### ⚡ Performance
- **<50ms** detection latency
- **20+ flows/second** throughput
- **<10ms** API response time
- **Sub-second** WebSocket updates

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **TanStack Query** (React Query) - State management & caching
- **Socket.IO Client** - Real-time WebSocket communication
- **shadcn/ui** - Component library (Radix UI primitives)
- **Recharts** - Data visualization
- **TailwindCSS** - Utility-first styling
- **Wouter** - Lightweight routing
- **Lucide React** - Icon library

### Backend
- **Node.js** with Express
- **TypeScript** - Type-safe development
- **Socket.IO Server** - Real-time bidirectional events
- **Zod** - Runtime schema validation
- **In-Memory Storage** - Fast data access (easily replaceable with DB)

### DevOps & Build Tools
- **Vite** - Fast frontend build tool
- **esbuild** - Backend bundling
- **tsx** - TypeScript execution
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  React Dashboard + TanStack Query + Socket.IO Client        │
└────────────────────┬────────────────────────────────────────┘
                     │ WebSocket + REST API
┌────────────────────┴────────────────────────────────────────┐
│                       Server Layer                           │
│  Express API + Socket.IO Server + Background Service        │
└────────────────────┬────────────────────────────────────────┘
                     │ Function Calls
┌────────────────────┴────────────────────────────────────────┐
│                        ML Layer                              │
│  Flow Simulator → Feature Extractor → Threat Classifier     │
└──────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
Dashboard
├── DashboardHeader (Connection status, theme toggle)
├── MetricCards (4 summary cards)
├── Charts
│   ├── ThreatTimeline (Area chart)
│   └── ThreatDistribution (Doughnut chart)
└── Data Tables
    ├── ThreatEventTable (Live threat feed)
    └── IPBlockingPanel (IP management)
```

## 📦 Installation

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**
- **Git**

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/mouryagutha/Eyes-on-Every-Packet-using-ai.git
cd Eyes-on-Every-Packet-using-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
# For Windows
npm exec tsx server/index.ts

# For Linux/Mac
npm run dev
```

4. **Open browser**
```
http://localhost:5000
```

The dashboard will start displaying real-time threats immediately!

## 🚀 Usage

### Starting the Application

```bash
# Development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run check
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
```

## 🤖 ML Pipeline

### 1. Flow Simulation
Generates realistic network traffic patterns:

```typescript
// Attack Types (Probability)
- DoS Attack      (15%) - High packet rate, SYN floods
- Port Scan       (15%) - Few packets, random ports
- Brute Force     (15%) - Service ports, repeated connections
- Exploit         (15%) - Large packets, vulnerable ports
- Benign Traffic  (40%) - Normal HTTP/HTTPS patterns
```

### 2. Feature Extraction
Extracts 9 statistical features from each network flow:

| Feature | Description |
|---------|-------------|
| `totalPackets` | Total number of packets in flow |
| `totalBytes` | Total bytes transferred |
| `avgPacketSize` | Average packet size |
| `duration` | Flow duration in seconds |
| `packetsPerSec` | Packet rate |
| `bytesPerSec` | Byte rate |
| `synCount` | Number of SYN flags |
| `finCount` | Number of FIN flags |
| `rstCount` | Number of RST flags |

### 3. Threat Classification
Rule-based classifier (simulates Random Forest):

**DoS Detection:**
```typescript
if (packetsPerSec > 1000 || bytesPerSec > 10MB)
   AND (rstCount > 50 || synCount > 100)
   → Type: "DoS", Severity: "critical"
```

**Port Scan Detection:**
```typescript
if (totalPackets < 10 && duration < 1s && port > 1024)
   → Type: "Scan", Severity: "medium"
```

**Brute Force Detection:**
```typescript
if (port in [21, 22, 23, 80, 443, 3389])
   AND (packets: 5-100 && duration < 5s)
   → Type: "Brute Force", Severity: "high"
```

**Exploit Detection:**
```typescript
if (avgPacketSize > 1200 || port in [445, 135, 139])
   → Type: "Exploit", Severity: "high"
```

## 📁 Project Structure

```
Eyes-on-Every-Packet-using-ai/
├── client/                      # Frontend application
│   └── src/
│       ├── components/          # React components
│       │   ├── DashboardHeader.tsx
│       │   ├── MetricCard.tsx
│       │   ├── ThreatEventTable.tsx
│       │   ├── ThreatTimeline.tsx
│       │   ├── ThreatDistribution.tsx
│       │   ├── IPBlockingPanel.tsx
│       │   └── ui/              # shadcn/ui components
│       ├── hooks/               # Custom React hooks
│       │   ├── useMetrics.ts
│       │   ├── useThreatEvents.ts
│       │   └── useBlockedIPs.ts
│       ├── pages/               # Page components
│       │   └── Dashboard.tsx
│       ├── lib/                 # Utility functions
│       ├── App.tsx              # Root component
│       └── main.tsx             # Entry point
│
├── server/                      # Backend application
│   ├── index.ts                 # Express server setup
│   ├── routes.ts                # API routes + WebSocket
│   ├── storage.ts               # In-memory data store
│   ├── vite.ts                  # Vite dev server setup
│   └── ml/                      # Machine learning pipeline
│       ├── threatDetector.ts    # Main ML orchestrator
│       ├── flowSimulator.ts     # Network flow generator
│       ├── featureExtractor.ts  # Feature engineering
│       └── threatClassifier.ts  # Classification logic
│
├── shared/                      # Shared types
│   └── schema.ts                # Zod schemas & TypeScript types
│
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── README.md                    # This file
```

## 📡 API Documentation

### REST Endpoints

#### Get Recent Threats
```http
GET /api/threats?limit=100
```

**Response:**
```json
[
  {
    "id": "uuid",
    "timestamp": "2024-01-01T00:00:00Z",
    "srcIp": "192.168.1.105",
    "dstIp": "10.0.0.50",
    "srcPort": 54321,
    "dstPort": 80,
    "protocol": "TCP",
    "type": "DoS",
    "severity": "critical",
    "confidence": 98,
    "flowFeatures": {...},
    "blocked": false
  }
]
```

#### Get Dashboard Metrics
```http
GET /api/metrics
```

**Response:**
```json
{
  "totalThreats": 1250,
  "blockedIPs": 45,
  "avgConfidence": 87.5,
  "activeSessions": 342,
  "threatsByType": {
    "DoS": 320,
    "Brute Force": 280,
    "Scan": 250,
    "Exploit": 200,
    "Benign": 200
  },
  "recentActivity": [...]
}
```

#### Get Blocked IPs
```http
GET /api/blocked-ips
```

#### Block an IP
```http
POST /api/blocked-ips
Content-Type: application/json

{
  "ipAddress": "192.168.1.105",
  "reason": "DoS attack detected",
  "threatCount": 5
}
```

#### Unblock an IP
```http
DELETE /api/blocked-ips/192.168.1.105
```

### WebSocket Events

**Server → Client:**
- `new-threat` - New threat detected
- `ip-blocked` - IP added to blocklist
- `ip-unblocked` - IP removed from blocklist

**Example:**
```javascript
socket.on('new-threat', (threat) => {
  console.log('New threat detected:', threat);
});
```

## 🚧 Future Enhancements

### Short-term (1-2 months)
- [ ] **Database Integration** - PostgreSQL with Drizzle ORM
- [ ] **Authentication** - JWT-based user authentication
- [ ] **Real ML Model** - Train Random Forest on CICIDS2017 dataset
- [ ] **IP Reputation API** - Integrate AbuseIPDB for threat intelligence
- [ ] **Export Reports** - PDF/CSV generation for incidents
- [ ] **Alert System** - Email/Slack notifications

### Long-term (3-6 months)
- [ ] **PCAP Integration** - Parse real network packet captures
- [ ] **Deep Packet Inspection** - Payload analysis
- [ ] **Anomaly Detection** - Unsupervised learning for zero-day threats
- [ ] **Custom Query Language** - Let analysts write detection rules
- [ ] **Multi-tenancy** - Support multiple organizations
- [ ] **Compliance Reports** - GDPR, SOC 2, ISO 27001 reporting
- [ ] **Distributed Architecture** - Kafka/RabbitMQ event streaming
- [ ] **Kubernetes Deployment** - Container orchestration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Follow TypeScript best practices
- Use ESLint and Prettier for formatting
- Write meaningful commit messages
- Add comments for complex logic

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Mourya Gutha**
- GitHub: [@mouryagutha](https://github.com/mouryagutha)
- Repository: [Eyes-on-Every-Packet-using-ai](https://github.com/mouryagutha/Eyes-on-Every-Packet-using-ai)

## 🙏 Acknowledgments

- Design inspired by IBM Carbon Design System
- ML concepts from CICIDS2017 and NSL-KDD datasets
- Real-time architecture patterns from Socket.IO documentation
- UI components from shadcn/ui

## 📊 Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/mouryagutha/Eyes-on-Every-Packet-using-ai)
![GitHub stars](https://img.shields.io/github/stars/mouryagutha/Eyes-on-Every-Packet-using-ai?style=social)
![GitHub forks](https://img.shields.io/github/forks/mouryagutha/Eyes-on-Every-Packet-using-ai?style=social)

---

<div align="center">

**⭐ If you find this project useful, please consider giving it a star! ⭐**

Made with ❤️ for cybersecurity enthusiasts

</div>
