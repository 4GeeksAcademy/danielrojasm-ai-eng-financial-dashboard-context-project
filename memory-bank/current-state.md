# Estado Actual del Proyecto

## Features implementadas

Backend:

- Endpoint de salud.
- Endpoint de movimientos financieros con filtros por fecha, categoria y tipo.
- Endpoint de facets para opciones de filtro y rango de fechas.
- Endpoint de summary por dia, semana o mes.
- Endpoint de top categorias por monto.
- Endpoint de comparacion entre periodos.
- Endpoint de alertas por incremento de egresos.
- Endpoints segmentados para B2B y B2C.

Frontend:

- Pantalla principal del dashboard conectada a la API.
- KPIs calculados en cliente a partir de movimientos.
- Grafico de ingresos vs egresos.
- Grafico de porcentaje de ganancia.
- Manejo basico de estado de carga y error.

Testing:

- Backend con pruebas de endpoints y logica de filtros/resumen.
- Frontend con pruebas unitarias de utilidades financieras.

## Gaps conocidos

- No hay autenticacion ni autorizacion en API.
- CORS esta abierto para cualquier origen en configuracion actual.
- No hay pruebas E2E del flujo completo frontend-backend.
- No hay CI configurada en el repositorio para ejecutar tests automaticamente.
- El frontend principal consume /api/metrics y no explota aun todos los endpoints avanzados disponibles.
- Parte de los calculos de negocio se hace en frontend y puede divergir de backend si evoluciona.

## Siguientes prioridades

Prioridad alta:

- Definir seguridad minima de API (auth basica y CORS por entorno).
- Establecer fuente de verdad para metricas de negocio en backend.
- Agregar pipeline de CI para lint y tests.

Prioridad media:

- Integrar en UI endpoints de summary, comparison y alerts.
- Reducir hardcodes de periodo en pantalla.
- Mejorar mensajes de error con contexto accionable.

Prioridad continua:

- Mantener cobertura de pruebas al modificar logica.
- Actualizar documentacion operativa cuando cambie el flujo de ejecucion.
