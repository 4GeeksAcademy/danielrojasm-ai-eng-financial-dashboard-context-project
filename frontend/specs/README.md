# Frontend Specs - Contrato de datos

Este directorio documenta la especificacion de frontend para 3 funcionalidades.

No contiene implementacion de componentes React ni llamadas de red.

## 1) Filtro de rango de fechas en dashboard principal

Endpoints:

- GET /api/metrics/facets
- GET /api/metrics (con filtros opcionales `start_date` y `end_date`)

Tipos usados:

- Respuesta de facetas: `FacetsResponse`
- Filtro de fechas compartido: `DateRangeFilter`

Parametros validos:

- `start_date`: opcional, string con formato YYYY-MM-DD
- `end_date`: opcional, string con formato YYYY-MM-DD
- Ambos vacios: mostrar todos los datos
- Solo uno lleno: estado invalido en UI, no ejecutar consulta

Edge cases y UI esperada:

- Caso A: solo `start_date` completo
  - UI: mensaje de validacion "Completa fecha fin" y boton aplicar deshabilitado.
- Caso B: solo `end_date` completo
  - UI: mensaje de validacion "Completa fecha inicio" y boton aplicar deshabilitado.
- Caso C: `start_date > end_date`
  - UI: error de rango invalido y sin consulta.

## 2) Tabla de alertas de anomalias

Endpoint:

- GET /api/metrics/alerts

Tipos usados:

- Request: `AlertsParams`
- Response: `AlertsResponse` (`AlertEntry[]`)

Parametros validos:

- `threshold`: ratio configurable por usuario (UI: 0.01 a 1.0; backend acepta >= 0)
- `start_date`: opcional, YYYY-MM-DD
- `end_date`: opcional, YYYY-MM-DD
- Debe respetar el rango activo de la funcionalidad 1

Columnas de tabla:

- `period`
- `outcome_total`
- `baseline_average` (media movil de 3 periodos previos calculada por backend)
- `increase_ratio` como porcentaje en UI

Edge cases y UI esperada:

- Caso A: respuesta vacia `[]`
  - UI: estado vacio explicito, la tabla no desaparece.
- Caso B: `threshold` fuera de rango UI (menor a 0.01 o mayor a 1.0)
  - UI: validacion y bloqueo de consulta.
- Caso C: rango incompleto (solo una fecha)
  - UI: validacion y sin consulta.

## 3) Vista comparativa B2B vs B2C

Endpoints:

- GET /api/metrics/categories/top?operation_type=income&limit=5&business_type=B2B
- GET /api/metrics/categories/top?operation_type=income&limit=5&business_type=B2C
- GET /api/metrics/facets

Tipos usados:

- Request base: `TopCategoriesParams`
- Request por segmento: `BusinessTopCategoriesParams`
- Response: `TopCategoriesResponse` (`CategoryEntry[]`)
- Referencia de filtros: `FacetsResponse` y `DateRangeFilter`

Parametros validos y restricciones:

- `operation_type`: "income" para esta funcionalidad
- `limit`: 5 en la vista (API permite 1..20)
- `business_type`: "B2B" o "B2C"
- `start_date` y `end_date`: opcionales, YYYY-MM-DD

Reglas de UI:

- Dos paneles paralelos, uno para B2B y otro para B2C.
- Cada panel muestra categoria, total de ingresos y porcentaje sobre total del grupo.
- El porcentaje se calcula en frontend con base en suma de `total_amount` del panel.
- Debajo de ambos paneles se muestra grafico comparando total ingresos B2B vs B2C.

Edge cases y UI esperada:

- Caso A: panel B2B vacio y B2C con datos
  - UI: B2B muestra estado vacio explicito, B2C renderiza tabla normal.
- Caso B: panel B2C vacio y B2B con datos
  - UI: B2C muestra estado vacio explicito, B2B renderiza tabla normal.
- Caso C: ambos paneles vacios
  - UI: ambos estados vacios + mensaje global de "Sin datos para comparar".
- Caso D: solo una fecha en filtro
  - UI: validacion de rango incompleto y sin consulta.

## Chequeo de consistencia contra API

Las formas incluidas en `api-types.ts` y `param-types.ts` se alinean con:

- modelos `MetricsFacets`, `MetricsAlert`, `TopCategoryItem`
- query params de `/api/metrics/alerts` y `/api/metrics/categories/top`
- restricciones de `limit` (1..20) y `threshold` (>= 0)
