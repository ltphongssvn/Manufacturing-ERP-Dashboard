# /Makefile
# Build automation for Manufacturing ERP Dashboard

.PHONY: help build run stop clean test

help:
	@echo "Manufacturing ERP Dashboard - Make commands"
	@echo "  make build    - Build Docker image"
	@echo "  make run      - Run container (port 3000)"
	@echo "  make stop     - Stop container"
	@echo "  make clean    - Remove container and image"
	@echo "  make test     - Run tests"

build:
	docker-compose build

run:
	docker-compose up -d
	@echo "Dashboard running at http://localhost:3000"

stop:
	docker-compose down

clean:
	docker-compose down -v
	docker rmi manufacturing-erp-dashboard || true

test:
	npm run build
