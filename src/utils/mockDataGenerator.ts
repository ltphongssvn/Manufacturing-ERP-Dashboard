// /src/utils/mockDataGenerator.ts

import { Plant, ProductionLine, SensorReading, SensorAlert } from '../types/sensor';

const PLANT_LOCATIONS = [
  { name: 'Detroit Assembly', location: 'Detroit, MI', timezone: 'America/Detroit' },
  { name: 'Tokyo Manufacturing', location: 'Tokyo, Japan', timezone: 'Asia/Tokyo' },
  { name: 'Stuttgart Plant', location: 'Stuttgart, Germany', timezone: 'Europe/Berlin' },
  { name: 'Shanghai Facility', location: 'Shanghai, China', timezone: 'Asia/Shanghai' },
  { name: 'São Paulo Assembly', location: 'São Paulo, Brazil', timezone: 'America/Sao_Paulo' },
  { name: 'Chennai Production', location: 'Chennai, India', timezone: 'Asia/Kolkata' },
  { name: 'Mexico City Plant', location: 'Mexico City, Mexico', timezone: 'America/Mexico_City' },
  { name: 'Barcelona Factory', location: 'Barcelona, Spain', timezone: 'Europe/Madrid' },
  { name: 'Seoul Manufacturing', location: 'Seoul, South Korea', timezone: 'Asia/Seoul' },
  { name: 'Birmingham Assembly', location: 'Birmingham, UK', timezone: 'Europe/London' },
  { name: 'Melbourne Plant', location: 'Melbourne, Australia', timezone: 'Australia/Melbourne' },
  { name: 'Toronto Facility', location: 'Toronto, Canada', timezone: 'America/Toronto' },
  { name: 'Bangkok Production', location: 'Bangkok, Thailand', timezone: 'Asia/Bangkok' },
  { name: 'Prague Factory', location: 'Prague, Czech Republic', timezone: 'Europe/Prague' },
  { name: 'Cape Town Assembly', location: 'Cape Town, South Africa', timezone: 'Africa/Johannesburg' },
];

const SENSOR_TYPES = ['temperature', 'pressure', 'speed', 'vibration', 'quality'] as const;

/**
 * Generates 15 global manufacturing plants with production lines
 */
export function generatePlants(): Plant[] {
  return PLANT_LOCATIONS.map((loc, idx) => {
    const linesCount = 3 + Math.floor(Math.random() * 3); // 3-5 lines per plant
    const lines = generateProductionLines(`plant-${idx + 1}`, linesCount);
    
    return {
      id: `plant-${idx + 1}`,
      name: loc.name,
      location: loc.location,
      timezone: loc.timezone,
      lines,
      totalSensors: lines.reduce((sum, line) => sum + line.activeSensors, 0),
      operationalStatus: Math.random() > 0.1 ? 'operational' : Math.random() > 0.5 ? 'partial' : 'offline',
    };
  });
}

/**
 * Generates production lines for a plant
 */
function generateProductionLines(plantId: string, count: number): ProductionLine[] {
  return Array.from({ length: count }, (_, idx) => {
    const targetSpeed = 50 + Math.random() * 150; // 50-200 units/hr
    const currentSpeed = targetSpeed * (0.8 + Math.random() * 0.2); // 80-100% of target
    
    return {
      id: `${plantId}-line-${idx + 1}`,
      name: `Line ${idx + 1}`,
      plantId,
      status: Math.random() > 0.15 ? 'running' : Math.random() > 0.5 ? 'idle' : 'maintenance',
      currentSpeed: Math.round(currentSpeed),
      targetSpeed: Math.round(targetSpeed),
      efficiency: Math.round((currentSpeed / targetSpeed) * 100),
      activeSensors: 200 + Math.floor(Math.random() * 100), // 200-300 sensors per line
    };
  });
}

/**
 * Generates batch of sensor readings (simulates 10,000+ readings/sec)
 * @param batchSize - Number of readings to generate
 */
export function generateSensorReadings(plants: Plant[], batchSize: number = 1000): Map<string, SensorReading[]> {
  const readingsMap = new Map<string, SensorReading[]>();
  
  plants.forEach(plant => {
    const readings: SensorReading[] = [];
    const readingsPerPlant = Math.floor(batchSize / plants.length);
    
    plant.lines.forEach(line => {
      const sensorsOnLine = Math.floor(readingsPerPlant / plant.lines.length);
      
      for (let i = 0; i < sensorsOnLine; i++) {
        const sensorType = SENSOR_TYPES[Math.floor(Math.random() * SENSOR_TYPES.length)];
        const reading = generateSingleReading(plant.id, line.id, sensorType);
        readings.push(reading);
      }
    });
    
    readingsMap.set(plant.id, readings);
  });
  
  return readingsMap;
}

/**
 * Generates single sensor reading with realistic values
 */
function generateSingleReading(
  plantId: string,
  lineId: string,
  type: typeof SENSOR_TYPES[number]
): SensorReading {
  const baseValues = {
    temperature: { min: 20, max: 150, unit: '°C' },
    pressure: { min: 1, max: 10, unit: 'bar' },
    speed: { min: 0, max: 3000, unit: 'RPM' },
    vibration: { min: 0, max: 50, unit: 'mm/s' },
    quality: { min: 85, max: 100, unit: '%' },
  };
  
  const config = baseValues[type];
  const value = config.min + Math.random() * (config.max - config.min);
  
  // Status based on thresholds
  let status: 'normal' | 'warning' | 'critical' = 'normal';
  if (type === 'temperature' && value > 120) status = 'critical';
  else if (type === 'temperature' && value > 100) status = 'warning';
  else if (type === 'vibration' && value > 40) status = 'critical';
  else if (type === 'vibration' && value > 30) status = 'warning';
  else if (type === 'quality' && value < 90) status = 'warning';
  else if (type === 'quality' && value < 85) status = 'critical';
  
  return {
    id: `sensor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    plantId,
    lineId,
    timestamp: Date.now(),
    type,
    value: Math.round(value * 100) / 100,
    unit: config.unit,
    status,
  };
}

/**
 * Generates alerts based on critical sensor readings
 */
export function generateAlerts(readingsMap: Map<string, SensorReading[]>): SensorAlert[] {
  const alerts: SensorAlert[] = [];
  
  readingsMap.forEach((readings, plantId) => {
    readings.forEach(reading => {
      if (reading.status === 'critical' && Math.random() > 0.7) {
        alerts.push({
          id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          sensorId: reading.id,
          plantId,
          lineId: reading.lineId,
          severity: 'critical',
          message: `${reading.type.toUpperCase()} critical: ${reading.value}${reading.unit}`,
          timestamp: reading.timestamp,
          acknowledged: false,
        });
      } else if (reading.status === 'warning' && Math.random() > 0.9) {
        alerts.push({
          id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          sensorId: reading.id,
          plantId,
          lineId: reading.lineId,
          severity: 'medium',
          message: `${reading.type.toUpperCase()} warning: ${reading.value}${reading.unit}`,
          timestamp: reading.timestamp,
          acknowledged: false,
        });
      }
    });
  });
  
  return alerts;
}
