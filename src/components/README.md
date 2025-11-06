# React Components
# /src/components/README.md

## Overview
UI components for Manufacturing ERP Dashboard.

## Files

### ProductionLineMonitor.tsx
**Purpose:** Real-time production line metrics display with performance optimization

**Props:**
- `line: ProductionLine` - Line data (status, speed, efficiency)
- `sensorReadings: SensorReading[]` - Current sensor data
- `onLineSelect: (lineId: string) => void` - Click handler

**Performance Optimizations:**

**useMemo:**
- `sensorStats` - Aggregates 10k+ readings (temp, pressure, speed, vibration, quality)
- `statusColor` - Line status indicator color
- `efficiencyColor` - Efficiency text color based on thresholds
- `criticalCount` - Total critical alerts

**useCallback:**
- `handleClick` - Prevents re-creation on every render

**Why Optimize:**
- Component re-renders every second with new sensor data
- 10,000+ readings processed per update
- Aggregation is expensive without memoization
- Prevents unnecessary child re-renders

**Display Logic:**
- Status dot (green/yellow/blue/red)
- Speed: current vs target
- Efficiency % with color coding (>95% green, >85% yellow, <85% red)
- Sensor aggregates (avg temp, max vibration, min quality)
- Critical alert badge
- Active sensor count

## Usage
```typescript
import { ProductionLineMonitor } from './components/ProductionLineMonitor';

function PlantView({ plant, sensorReadings }) {
  const handleLineSelect = (lineId: string) => {
    dispatch({ type: 'SELECT_LINE', payload: lineId });
  };

  return (
    <>
      {plant.lines.map(line => (
        <ProductionLineMonitor
          key={line.id}
          line={line}
          sensorReadings={sensorReadings.get(plant.id) || []}
          onLineSelect={handleLineSelect}
        />
      ))}
    </>
  );
}
```

## Performance Notes
- Without useMemo: 10k+ calculations per render
- With useMemo: Only recalculates when sensorReadings change
- useCallback prevents function identity changes

### Dashboard.tsx
**Purpose:** Main ERP dashboard integrating all features

**Features:**
- 15 global plants with real-time data
- 10,000+ sensor readings/second simulation
- useReducer for complex state (plants, sensors, alerts)
- useMemo for expensive calculations (stats aggregation)
- useCallback for event handlers (prevent re-renders)

**State Management:**
- `useDashboardReducer` - Global state hook
- Interval updates every 100ms (10k sensors/sec)
- Automatic alert generation from critical readings

**Optimizations:**
- `selectedPlant` - Memoized plant lookup
- `globalStats` - Memoized aggregation across all plants
- `handlePlantSelect/LineSelect/AcknowledgeAlert` - Stable callbacks

**UI Sections:**
- Global stats (plants, lines, sensors, alerts)
- Active alerts with acknowledgment
- Plant selection buttons
- Production line grid (3 columns)

**Data Flow:**
1. Mount: Load 15 plants
2. Interval: Generate 1000 readings per 100ms
3. Dispatch readings to reducer
4. Generate alerts from critical readings
5. UI updates via memoized selectors

## Usage
```typescript
import { Dashboard } from './components/Dashboard';

function App() {
  return <Dashboard />;
}
```
