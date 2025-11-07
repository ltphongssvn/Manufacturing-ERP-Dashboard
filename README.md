# Manufacturing ERP Dashboard

Real-time production monitoring system for Fortune 500 auto manufacturer with 15 global facilities.

## Features

- **15 Global Plants** - Detroit, Tokyo, Stuttgart, Shanghai, São Paulo, Chennai, Mexico City, Barcelona, Seoul, Birmingham, Melbourne, Toronto, Bangkok, Prague, Cape Town
- **10,000+ Sensors/Second** - Real-time monitoring with 100ms update intervals
- **Complex State Management** - useReducer for multi-plant operations
- **Performance Optimized** - useMemo/useCallback for data-heavy visualizations
- **Real-time Alerts** - Critical sensor threshold monitoring with acknowledgment

## Tech Stack

- **React 19** + TypeScript
- **Vite** - Fast development and build
- **Tailwind CSS** - Utility-first styling
- **Git Hooks** - Pre-commit validation with pristine workflow

## Quick Start
```bash
npm install
npm run dev
```

Open http://localhost:5173

## Project Structure
```
src/
├── components/       # React components
│   ├── Dashboard.tsx
│   ├── ProductionLineMonitor.tsx
│   └── README.md
├── hooks/           # Custom hooks
│   ├── useDashboardReducer.ts
│   └── README.md
├── types/           # TypeScript definitions
│   ├── sensor.ts
│   ├── state.ts
│   └── README.md
├── utils/           # Helper functions
│   ├── mockDataGenerator.ts
│   └── README.md
└── App.tsx
```

## Key Concepts Implemented

### useReducer - Complex State
Manages 15 plants, 10k+ sensors, alerts, and UI state in single reducer.

### useMemo - Performance
Memoizes expensive calculations:
- Sensor aggregation (temp, pressure, speed, vibration, quality)
- Global statistics
- Critical alert counts

### useCallback - Stable References
Prevents unnecessary re-renders with stable event handlers.

## Architecture

- **Mock Data Generator** - Simulates 15 plants with realistic sensor data
- **Map-based Storage** - O(1) sensor lookups by plantId
- **Batch Updates** - 1000 readings per 100ms interval
- **Automatic Alerts** - Generated from critical/warning thresholds

## Clean Code Practices

- Single Responsibility Principle
- Small functions (< 50 lines)
- Descriptive naming conventions
- Comprehensive documentation
- GitFlow branching strategy

## Development Workflow

See [PROJECT_SETUP.md](PROJECT_SETUP.md) for:
- Git hooks configuration
- Clean commit workflow
- Documentation requirements
- GitFlow patterns

## Documentation

Each directory contains README.md explaining:
- Purpose and functionality
- Usage examples
- Implementation notes
- Performance considerations

## Author

Built following Clean Code principles and React best practices from "Learn React with TypeScript" (Third Edition).

## Deployment

### Production URL
🚀 **Live:** https://manufacturing-erp-dashboard.thanhphongle.net

### Railway Deployment Configuration
Successfully deployed on Railway with dynamic port binding solution.

#### Issue Resolved (Nov 7, 2025)
- **Problem:** 502 Bad Gateway - nginx hardcoded to port 80 incompatible with Railway's dynamic PORT assignment
- **Solution:** Template-based nginx configuration with runtime environment substitution

#### Key Files
- `Dockerfile` - Multi-stage build with Alpine nginx
- `nginx.conf.template` - Dynamic port configuration using `${PORT}`
- Railway environment variable: `PORT=8080`

#### Architecture Changes
```
FROM nginx:alpine
RUN apk add --no-cache gettext
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
CMD ["sh", "-c", "export PORT=${PORT:-8080} && envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
```

#### Deployment Commands
```bash
railway variables --set "PORT=8080"
railway up --detach
railway logs --tail
```

### Build & Deploy
```bash
npm run build          # Creates dist/ folder
git push origin main   # Auto-deploys via Railway GitHub integration
```

### Infrastructure
- **Platform:** Railway
- **Container:** nginx:alpine
- **Build:** Vite production build
- **DNS:** CNAME to railway.app domain
- **SSL:** Automatic HTTPS provisioning
