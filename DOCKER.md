# Docker Configuration
# /DOCKER.md

## Overview
Multi-stage Docker build for production deployment with Nginx.

## Files

- **Dockerfile** - Multi-stage build (Node builder + Nginx runtime)
- **docker-compose.yml** - Local development orchestration
- **nginx.conf** - SPA routing configuration
- **.dockerignore** - Exclude unnecessary files
- **Makefile** - Build automation

## Quick Start
```bash
make build    # Build image
make run      # Start container (port 3000)
make stop     # Stop container
make clean    # Remove all
```

## Manual Commands
```bash
# Build
docker-compose build

# Run
docker-compose up -d

# Stop
docker-compose down
```

## Access
http://localhost:3000

## Build Stages

**Stage 1 - Builder (node:20-alpine)**
- Install dependencies
- Build React app
- Output: /app/dist

**Stage 2 - Runtime (nginx:alpine)**
- Copy built files from builder
- Configure Nginx for SPA routing
- Expose port 80
- Final image: ~25MB

## Environment Variables
- NODE_ENV=production

## Deployment
See Railway deployment section in main README.
