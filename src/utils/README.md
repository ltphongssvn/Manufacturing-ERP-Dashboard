# Utility Functions
# /src/utils/README.md

## Overview
Helper utilities for data generation and processing.

## Files

### mockDataGenerator.ts
**Purpose:** Generate realistic manufacturing data for 15 global plants with 10,000+ sensors/sec

**Functions:**

**`generatePlants(): Plant[]`**
- Creates 15 plants across global locations
- Each plant has 3-5 production lines
- 200-300 sensors per line
- Total: ~10,000+ sensors across all plants

**`generateSensorReadings(plants, batchSize): Map<plantId, readings[]>`**
- Simulates real-time sensor data batches
- Default 1000 readings/call (10k+/sec with 10 calls)
- Returns Map for O(1) plant lookup
- Types: temperature, pressure, speed, vibration, quality

**`generateAlerts(readingsMap): SensorAlert[]`**
- Creates alerts from critical/warning readings
- 30% chance for critical readings
- 10% chance for warning readings

**Sensor Thresholds:**
- Temperature: >120°C critical, >100°C warning
- Vibration: >40mm/s critical, >30mm/s warning
- Quality: <85% critical, <90% warning

**Global Locations:**
Detroit, Tokyo, Stuttgart, Shanghai, São Paulo, Chennai, Mexico City, Barcelona, Seoul, Birmingham, Melbourne, Toronto, Bangkok, Prague, Cape Town

## Usage
```typescript
import { generatePlants, generateSensorReadings } from './utils/mockDataGenerator';

const plants = generatePlants(); // 15 plants
const readings = generateSensorReadings(plants, 1000); // 1000 readings
```

## Performance Notes
- Map structure for sensor readings (O(1) vs O(n))
- Batch generation reduces function calls
- Realistic distribution across plants/lines
