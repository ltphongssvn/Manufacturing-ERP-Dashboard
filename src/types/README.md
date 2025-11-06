# Type Definitions
# /src/types/README.md

## Overview
TypeScript interfaces and types for the Manufacturing ERP Dashboard.

## Files

### sensor.ts
Core domain types for production monitoring.

**Interfaces:**
- `SensorReading`: Real-time sensor data (temperature, pressure, speed, vibration, quality)
- `ProductionLine`: Line status, speed, efficiency metrics
- `Plant`: Multi-line facility with location and operational status
- `SensorAlert`: Alert system with severity levels and acknowledgment

**Status Types:**
- Sensor: `normal | warning | critical`
- Line: `running | idle | maintenance | error`
- Plant: `operational | partial | offline`
- Alert: `low | medium | high | critical`

### state.ts
Dashboard state management using useReducer pattern.

**Interfaces:**
- `DashboardState`: Global app state (15 plants, 10k+ sensors/sec)
- `DashboardAction`: Discriminated union for reducer actions

**State Properties:**
- `plants[]`: All facilities
- `sensorReadings`: Map<plantId, readings[]> for performance
- `alerts[]`: Active alerts
- `selectedPlantId/LineId`: Current view selection
- `isLoading/error`: UI states
- `lastUpdate`: Timestamp for real-time sync

**Actions:**
- `SET_PLANTS`: Initialize facilities
- `UPDATE_SENSOR_READINGS`: Batch sensor updates
- `ADD_ALERT`: New alert
- `ACKNOWLEDGE_ALERT`: Clear alert
- `SELECT_PLANT/LINE`: Navigation
- `SET_LOADING/ERROR`: UI state
- `UPDATE_TIMESTAMP`: Refresh tracking

## Usage Example
```typescript
import { Plant, SensorReading } from './types/sensor';
import { DashboardState, initialDashboardState } from './types/state';

const plant: Plant = {
  id: 'plant-001',
  name: 'Detroit Assembly',
  location: 'Detroit, MI',
  // ...
};
```

## Implementation Notes
- Map used for sensorReadings (O(1) lookup vs O(n) array search)
- Discriminated unions ensure type safety in reducer
- Timestamps use Date.now() for performance
- Status enums prevent typos
