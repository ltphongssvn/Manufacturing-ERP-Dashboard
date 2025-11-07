// /src/types/state.ts

// Temporarily define types here to bypass import issue
export interface SensorReading {
  id: string;
  plantId: string;
  lineId: string;
  timestamp: number;
  type: 'temperature' | 'pressure' | 'speed' | 'vibration' | 'quality';
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
}

export interface ProductionLine {
  id: string;
  name: string;
  plantId: string;
  status: 'running' | 'idle' | 'maintenance' | 'error';
  currentSpeed: number;
  targetSpeed: number;
  efficiency: number;
  activeSensors: number;
}

export interface Plant {
  id: string;
  name: string;
  location: string;
  timezone: string;
  lines: ProductionLine[];
  totalSensors: number;
  operationalStatus: 'operational' | 'partial' | 'offline';
}

export interface SensorAlert {
  id: string;
  sensorId: string;
  plantId: string;
  lineId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  acknowledged: boolean;
}

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
