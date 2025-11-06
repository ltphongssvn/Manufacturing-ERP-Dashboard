// /src/components/ProductionLineMonitor.tsx

import { useMemo, useCallback } from 'react';
import { ProductionLine, SensorReading } from '../types/sensor';

interface ProductionLineMonitorProps {
  line: ProductionLine;
  sensorReadings: SensorReading[];
  onLineSelect: (lineId: string) => void;
}

/**
 * Displays real-time production line metrics with 10,000+ sensor readings/sec.
 * Uses useMemo/useCallback for performance optimization.
 */
export function ProductionLineMonitor({ 
  line, 
  sensorReadings, 
  onLineSelect 
}: ProductionLineMonitorProps) {
  
  // Memoized sensor aggregation (expensive calculation)
  const sensorStats = useMemo(() => {
    const stats = {
      temperature: { count: 0, avg: 0, max: 0, critical: 0 },
      pressure: { count: 0, avg: 0, max: 0, critical: 0 },
      speed: { count: 0, avg: 0, max: 0, critical: 0 },
      vibration: { count: 0, avg: 0, max: 0, critical: 0 },
      quality: { count: 0, avg: 0, min: 100, critical: 0 },
    };

    sensorReadings.forEach(reading => {
      const typeStats = stats[reading.type];
      typeStats.count++;
      typeStats.avg += reading.value;
      
      if (reading.type === 'quality') {
        typeStats.min = Math.min(typeStats.min, reading.value);
      } else {
        typeStats.max = Math.max(typeStats.max, reading.value);
      }
      
      if (reading.status === 'critical') {
        typeStats.critical++;
      }
    });

    // Calculate averages
    Object.values(stats).forEach(stat => {
      if (stat.count > 0) {
        stat.avg = Math.round((stat.avg / stat.count) * 100) / 100;
      }
    });

    return stats;
  }, [sensorReadings]);

  // Memoized line status color
  const statusColor = useMemo(() => {
    switch (line.status) {
      case 'running': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'maintenance': return 'bg-blue-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }, [line.status]);

  // Memoized efficiency color
  const efficiencyColor = useMemo(() => {
    if (line.efficiency >= 95) return 'text-green-600';
    if (line.efficiency >= 85) return 'text-yellow-600';
    return 'text-red-600';
  }, [line.efficiency]);

  // Memoized click handler (prevents re-creation)
  const handleClick = useCallback(() => {
    onLineSelect(line.id);
  }, [line.id, onLineSelect]);

  // Memoized critical alerts count
  const criticalCount = useMemo(() => {
    return Object.values(sensorStats).reduce((sum, stat) => sum + stat.critical, 0);
  }, [sensorStats]);

  return (
    <div 
      className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${statusColor}`} />
          <h3 className="font-semibold text-lg">{line.name}</h3>
        </div>
        {criticalCount > 0 && (
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
            {criticalCount} Critical
          </span>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-sm text-gray-600">Speed</p>
          <p className="text-xl font-bold">
            {line.currentSpeed} / {line.targetSpeed}
          </p>
          <p className="text-xs text-gray-500">units/hr</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Efficiency</p>
          <p className={`text-xl font-bold ${efficiencyColor}`}>
            {line.efficiency}%
          </p>
        </div>
      </div>

      {/* Sensor Stats */}
      <div className="space-y-1 text-sm">
        {sensorStats.temperature.count > 0 && (
          <div className="flex justify-between">
            <span>Temp Avg:</span>
            <span className={sensorStats.temperature.critical > 0 ? 'text-red-600 font-semibold' : ''}>
              {sensorStats.temperature.avg}°C
            </span>
          </div>
        )}
        {sensorStats.vibration.count > 0 && (
          <div className="flex justify-between">
            <span>Vibration Max:</span>
            <span className={sensorStats.vibration.critical > 0 ? 'text-red-600 font-semibold' : ''}>
              {sensorStats.vibration.max} mm/s
            </span>
          </div>
        )}
        {sensorStats.quality.count > 0 && (
          <div className="flex justify-between">
            <span>Quality Min:</span>
            <span className={sensorStats.quality.critical > 0 ? 'text-red-600 font-semibold' : ''}>
              {sensorStats.quality.min}%
            </span>
          </div>
        )}
      </div>

      {/* Active Sensors */}
      <div className="mt-3 pt-3 border-t">
        <p className="text-xs text-gray-600">
          {line.activeSensors} active sensors • {sensorReadings.length} readings
        </p>
      </div>
    </div>
  );
}
