// /src/hooks/useDashboardReducer.ts

import { useReducer } from 'react';
import { initialDashboardState } from '../types/state';
import type { DashboardState, DashboardAction } from '../types/state';

/**
 * Reducer for multi-plant ERP dashboard state management.
 * Handles 15 global facilities with 10,000+ sensor readings/second.
 */
export function dashboardReducer(
  state: DashboardState,
  action: DashboardAction
): DashboardState {
  switch (action.type) {
    case 'SET_PLANTS':
      return {
        ...state,
        plants: action.payload,
        isLoading: false,
      };

    case 'UPDATE_SENSOR_READINGS': {
      const newReadings = new Map(state.sensorReadings);
      newReadings.set(action.payload.plantId, action.payload.readings);
      return {
        ...state,
        sensorReadings: newReadings,
        lastUpdate: Date.now(),
      };
    }

    case 'ADD_ALERT':
      return {
        ...state,
        alerts: [action.payload, ...state.alerts],
      };

    case 'ACKNOWLEDGE_ALERT':
      return {
        ...state,
        alerts: state.alerts.map(alert =>
          alert.id === action.payload
            ? { ...alert, acknowledged: true }
            : alert
        ),
      };

    case 'SELECT_PLANT':
      return {
        ...state,
        selectedPlantId: action.payload,
        selectedLineId: null, // Reset line selection
      };

    case 'SELECT_LINE':
      return {
        ...state,
        selectedLineId: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'UPDATE_TIMESTAMP':
      return {
        ...state,
        lastUpdate: Date.now(),
      };

    default:
      return state;
  }
}

/**
 * Custom hook wrapping useReducer for dashboard state.
 * @returns [state, dispatch] tuple
 */
export function useDashboardReducer() {
  return useReducer(dashboardReducer, initialDashboardState);
}
