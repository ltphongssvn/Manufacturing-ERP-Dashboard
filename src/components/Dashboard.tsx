// /src/components/Dashboard.tsx
import { useEffect, useMemo, useCallback } from 'react';
import { useDashboardReducer } from '../hooks/useDashboardReducer';
import { generatePlants, generateSensorReadings, generateAlerts } from '../utils/mockDataGenerator';
import { ProductionLineMonitor } from './ProductionLineMonitor';

/**
 * Main Manufacturing ERP Dashboard
 * - 15 global plants
 * - 10,000+ sensor readings/second
 * - Real-time monitoring with useReducer, useMemo, useCallback
 */
export function Dashboard() {
  console.log('Dashboard component rendering');
  
  const [state, dispatch] = useDashboardReducer();
  
  console.log('Dashboard state:', state);

  // Initialize plants on mount
  useEffect(() => {
    console.log('useEffect: Initializing plants');
    const plants = generatePlants();
    console.log('Generated plants:', plants);
    dispatch({ type: 'SET_PLANTS', payload: plants });
  }, [dispatch]);

  // Simulate real-time sensor updates (10k+ readings/sec)
  useEffect(() => {
    if (state.plants.length === 0) return;

    const interval = setInterval(() => {
      // Generate 1000 readings (10 intervals = 10k/sec)
      const readings = generateSensorReadings(state.plants, 1000);
      
      // Update each plant's readings
      readings.forEach((plantReadings, plantId) => {
        dispatch({
          type: 'UPDATE_SENSOR_READINGS',
          payload: { plantId, readings: plantReadings },
        });
      });

      // Generate alerts from critical readings
      const newAlerts = generateAlerts(readings);
      newAlerts.forEach(alert => {
        dispatch({ type: 'ADD_ALERT', payload: alert });
      });

      dispatch({ type: 'UPDATE_TIMESTAMP' });
    }, 100); // 100ms = 10 updates/sec = 10k readings/sec

    return () => clearInterval(interval);
  }, [state.plants, dispatch]);

  // Memoized selected plant
  const selectedPlant = useMemo(() => {
    return state.plants.find(p => p.id === state.selectedPlantId);
  }, [state.plants, state.selectedPlantId]);

  // Memoized global stats
  const globalStats = useMemo(() => {
    return {
      totalPlants: state.plants.length,
      operationalPlants: state.plants.filter(p => p.operationalStatus === 'operational').length,
      totalLines: state.plants.reduce((sum, p) => sum + p.lines.length, 0),
      runningLines: state.plants.reduce(
        (sum, p) => sum + p.lines.filter(l => l.status === 'running').length,
        0
      ),
      totalSensors: state.plants.reduce((sum, p) => sum + p.totalSensors, 0),
      criticalAlerts: state.alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length,
    };
  }, [state.plants, state.alerts]);

  // Memoized plant select handler
  const handlePlantSelect = useCallback((plantId: string) => {
    dispatch({ type: 'SELECT_PLANT', payload: plantId });
  }, [dispatch]);

  // Memoized line select handler
  const handleLineSelect = useCallback((lineId: string) => {
    dispatch({ type: 'SELECT_LINE', payload: lineId });
  }, [dispatch]);

  // Memoized alert acknowledge handler
  const handleAcknowledgeAlert = useCallback((alertId: string) => {
    dispatch({ type: 'ACKNOWLEDGE_ALERT', payload: alertId });
  }, [dispatch]);

  if (state.isLoading) {
    console.log('Showing loading state');
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading Manufacturing Dashboard...</div>
      </div>
    );
  }

  console.log('Rendering full dashboard');
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Manufacturing ERP Dashboard</h1>
        <p className="text-gray-600">
          Real-time monitoring • {globalStats.totalSensors.toLocaleString()} sensors •
          Last update: {new Date(state.lastUpdate).toLocaleTimeString()}
        </p>
      </header>

      {/* Global Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Plants</p>
          <p className="text-2xl font-bold">{globalStats.operationalPlants}/{globalStats.totalPlants}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Production Lines</p>
          <p className="text-2xl font-bold">{globalStats.runningLines}/{globalStats.totalLines}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Active Sensors</p>
          <p className="text-2xl font-bold">{globalStats.totalSensors.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Critical Alerts</p>
          <p className="text-2xl font-bold text-red-600">{globalStats.criticalAlerts}</p>
        </div>
      </div>

      {/* Alerts Section */}
      {state.alerts.length > 0 && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Active Alerts</h2>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {state.alerts.slice(0, 10).map(alert => (
              <div
                key={alert.id}
                className={`flex justify-between items-center p-2 rounded ${
                  alert.acknowledged ? 'bg-gray-100' : 'bg-red-50'
                }`}
              >
                <div>
                  <span className={`font-semibold ${
                    alert.severity === 'critical' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  <span className="ml-2">{alert.message}</span>
                </div>
                {!alert.acknowledged && (
                  <button
                    onClick={() => handleAcknowledgeAlert(alert.id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plant Selection */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Select Plant</h2>
        <div className="flex flex-wrap gap-2">
          {state.plants.map(plant => (
            <button
              key={plant.id}
              onClick={() => handlePlantSelect(plant.id)}
              className={`px-4 py-2 rounded ${
                state.selectedPlantId === plant.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 hover:bg-gray-100'
              } shadow`}
            >
              {plant.name}
              <span className="ml-2 text-xs">
                ({plant.lines.length} lines)
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Production Lines */}
      {selectedPlant && (
        <div>
          <h2 className="text-xl font-semibold mb-3">
            {selectedPlant.name} - Production Lines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedPlant.lines.map(line => (
              <ProductionLineMonitor
                key={line.id}
                line={line}
                sensorReadings={
                  state.sensorReadings.get(selectedPlant.id)?.filter(
                    r => r.lineId === line.id
                  ) || []
                }
                onLineSelect={handleLineSelect}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Plant Selected */}
      {!selectedPlant && (
        <div className="text-center text-gray-600 mt-12">
          <p className="text-lg">Select a plant to view production lines</p>
        </div>
      )}
    </div>
  );
}
