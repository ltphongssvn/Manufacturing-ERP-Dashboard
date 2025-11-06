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
