# AI-Based Threat Hunting Dashboard - Design Guidelines

## Design Approach

**Selected Framework:** Carbon Design System (IBM) - optimized for data-heavy enterprise applications with real-time monitoring requirements

**Key Principles:**
- Clarity in complexity: Dense information presented with clear hierarchy
- Immediate comprehension: Critical threats identifiable at a glance  
- Operational efficiency: Minimize cognitive load for security analysts
- Real-time responsiveness: Visual feedback for live data updates

## Typography System

**Font Family:** IBM Plex Sans (primary), IBM Plex Mono (code/IPs)

**Hierarchy:**
- Dashboard title: text-3xl font-semibold (36px)
- Section headers: text-xl font-semibold (20px)
- Metric labels: text-sm font-medium uppercase tracking-wide (14px)
- Data values: text-2xl font-bold for key metrics (24px)
- Table headers: text-xs font-semibold uppercase (12px)
- Body/table content: text-sm (14px)
- IP addresses/technical data: font-mono text-sm (14px)
- Timestamps: text-xs (12px)

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16 (e.g., p-4, gap-6, mb-8)

**Grid Structure:**
- Dashboard container: max-w-screen-2xl mx-auto px-6
- Main grid: 12-column responsive grid
- Metrics row: 4-column grid (lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1)
- Charts section: 2-column grid (lg:grid-cols-2 gap-6)
- Table: full-width with internal column definitions

**Component Spacing:**
- Card padding: p-6
- Section margins: mb-8
- Element gaps: gap-4 (internal), gap-6 (between cards)
- Page padding: px-6 py-8

## Component Library

### Header/Navigation
- Fixed top bar (h-16) with dashboard title and real-time status indicator
- Right-aligned: connection status badge, settings icon, user menu
- Subtle bottom border for separation

### Metric Cards (Top Row)
- Fixed height cards (min-h-32)
- Large number display with label below
- Trend indicator (arrow + percentage) in corner
- Subtle icon relevant to metric type
- Hover: subtle elevation increase

### Chart Containers
- Equal-height cards (min-h-96) for visual consistency
- Chart title in header with time range selector
- Legend positioned top-right or bottom
- Responsive canvas with maintained aspect ratio

### Threat Event Table
- Sticky header with sortable columns
- Row height: h-12 for scannable density
- Alternating row treatment for readability
- Threat level indicator: left border accent (w-1)
- Expandable rows for detailed flow information
- Action buttons: small icon buttons aligned right

### Alert/Notification System
- Toast notifications: fixed top-right position
- Stack multiple alerts with gap-2
- Auto-dismiss timer with progress indicator
- Critical alerts: larger size, persistent until dismissed

### IP Blocking Panel
- Compact form with search/filter capability
- Action buttons: clear primary/secondary hierarchy
- Blocked IPs: chip-style display with remove button
- Action history: condensed timeline view

### Real-time Status Indicators
- Pulsing dot animation for "live" status
- Connection quality: icon + text label
- Last updated timestamp in muted text

## Data Visualization Standards

**Charts (Chart.js implementation):**
- Timeline chart: Area chart with gradient fill, smooth curves
- Distribution charts: Doughnut with center metric, bar charts for comparisons
- Consistent axis styling, grid lines, tooltips
- Responsive sizing: maintain readability at all breakpoints

**Table Design:**
- Fixed header with column sorting indicators
- Column widths: timestamp (120px), IP (140px), type (100px), confidence (80px), actions (100px)
- Text alignment: left for text, right for numbers
- Truncate long values with tooltip on hover

## Interaction Patterns

**Hover States:**
- Cards: subtle elevation shadow increase
- Table rows: background treatment
- Buttons: standard button component states
- Chart elements: highlight + tooltip

**Loading States:**
- Skeleton screens for initial load
- Shimmer effect for data refreshing
- Spinner only for actions (block/unblock)

**Real-time Updates:**
- Smooth transitions when new data arrives (no jarring jumps)
- Highlight flash for new threat events (brief accent glow, fade out)
- Counter animations for incrementing metrics

## Accessibility

- ARIA labels for all interactive elements
- Keyboard navigation: tab order follows visual hierarchy
- Focus indicators: clear ring on all focusable elements
- Screen reader announcements for critical alerts
- Minimum contrast ratios maintained throughout

## Responsive Behavior

**Breakpoints:**
- Desktop (lg): 4-column metrics, 2-column charts, full table
- Tablet (md): 2-column metrics, stacked charts, horizontal scroll table
- Mobile (sm): Single column stack, card-based table (convert to cards)

**Mobile Adaptations:**
- Collapsible sections for dense content
- Sticky metric summary bar
- Swipeable chart navigation
- Simplified table view (most critical columns only)

## Critical UI Requirements

**Threat Level Differentiation:**
- Visual weight hierarchy: critical > high > medium > low
- Border treatments on threat event rows
- Badge styling for classification labels
- Consistent iconography across threat types

**Operational Controls:**
- Action buttons: clear disabled/enabled states
- Confirmation modals for destructive actions (blocking)
- Bulk selection controls for multi-IP operations
- Quick filters: chip-style toggles above table

**Dashboard Density:**
- Information-dense but scannable
- Strategic use of whitespace in critical decision areas
- Compact metric displays (no excessive padding)
- Efficient vertical space usage (analyst time is critical)

This dashboard prioritizes operational efficiency and real-time decision-making for security analysts working in high-stress, time-sensitive environments.