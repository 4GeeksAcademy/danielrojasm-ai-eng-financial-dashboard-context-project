# Tech Stack

## Frontend

Base:

- React 19
- TypeScript
- Vite 8

UI y visualizacion:

- Tailwind CSS 4
- Recharts
- lucide-react
- class-variance-authority, clsx, tailwind-merge

Calidad y pruebas:

- ESLint 9
- typescript-eslint
- Vitest
- @vitest/coverage-v8

Scripts principales:

- dev
- build
- lint
- test
- test:watch
- test:coverage

## Backend

Base:

- Python
- FastAPI
- Uvicorn

Dependencias clave:

- pydantic para modelos y validacion
- debugpy para depuracion
- pytest, pytest-cov, httpx para testing

## Infraestructura y tooling

Contenedores:

- Dockerfile para frontend y backend
- docker-compose para levantar ambos servicios

Puertos y entorno local:

- frontend: 5173
- backend: 8000
- debug backend: 5678

Flujo de desarrollo:

- El frontend usa proxy de Vite para rutas /api hacia el backend.
- El repo esta preparado para ejecutarse con docker compose up --build.

## Dependencias destacadas por impacto

- Recharts: habilita visualizaciones financieras en dashboard.
- FastAPI + Pydantic: facilitan contratos tipados y documentacion de API.
- Vitest + Pytest: cubren logica critica en frontend y backend.
- Docker Compose: reduce friccion para onboarding y ejecucion local.
