# Custom Hooks
# /src/hooks/README.md

## Overview
React hooks for dashboard state and data management.

## Files

### useDashboardReducer.ts
**Purpose:** Complex state management for 15 global plants, 10k+ sensors/sec

**Exports:**
- `dashboardReducer(state, action)`: Pure reducer function
- `useDashboardReducer()`: Hook wrapper returning [state, dispatch]

**State Management:**
- Plants array (all facilities)
- SensorReadings Map for O(1) lookup performance
- Alerts array with acknowledgment tracking
- UI state (loading, error, selections)
- Timestamp for real-time sync

**Actions:**
- `SET_PLANTS`: Load facilities
- `UPDATE_SENSOR_READINGS`: Batch updates per plant
- `ADD_ALERT / ACKNOWLEDGE_ALERT`: Alert lifecycle
- `SELECT_PLANT / SELECT_LINE`: Navigation
- `SET_LOADING / SET_ERROR`: UI state
- `UPDATE_TIMESTAMP`: Refresh tracking

**Performance:**
- Map structure: O(1) sensor lookups vs O(n) arrays
- Immutable updates preserve React optimization
- Batch sensor readings by plantId

## Usage
```typescript
import { useDashboardReducer } from './hooks/useDashboardReducer';

function Dashboard() {
  const [state, dispatch] = useDashboardReducer();
  
  // Load plants
  dispatch({ type: 'SET_PLANTS', payload: plants });
  
  // Update sensors
  dispatch({ 
    type: 'UPDATE_SENSOR_READINGS', 
    payload: { plantId: 'plant-001', readings: [...] }
  });
}
```
