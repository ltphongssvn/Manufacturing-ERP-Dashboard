// /src/types/sensor.ts

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
