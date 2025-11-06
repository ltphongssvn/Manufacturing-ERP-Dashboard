// /src/types/state.ts

import { Plant, SensorReading, SensorAlert } from './sensor';

export interface DashboardState {
  plants: Plant[];
  sensorReadings: Map<string, SensorReading[]>;
  alerts: SensorAlert[];
  selectedPlantId: string | null;
  selectedLineId: string | null;
  isLoading: boolean;
  error: string | null;
  lastUpdate: number;
}

export type DashboardAction =
  | { type: 'SET_PLANTS'; payload: Plant[] }
  | { type: 'UPDATE_SENSOR_READINGS'; payload: { plantId: string; readings: SensorReading[] } }
  | { type: 'ADD_ALERT'; payload: SensorAlert }
  | { type: 'ACKNOWLEDGE_ALERT'; payload: string }
  | { type: 'SELECT_PLANT'; payload: string | null }
  | { type: 'SELECT_LINE'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_TIMESTAMP' };

export const initialDashboardState: DashboardState = {
  plants: [],
  sensorReadings: new Map(),
  alerts: [],
  selectedPlantId: null,
  selectedLineId: null,
  isLoading: true,
  error: null,
  lastUpdate: Date.now(),
};
