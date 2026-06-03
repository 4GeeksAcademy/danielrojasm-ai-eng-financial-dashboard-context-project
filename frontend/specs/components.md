# Especificacion de componentes

Este documento describe componentes, props y reglas de render para 3 funcionalidades.

## Funcionalidad 1: Filtro de rango de fechas en dashboard principal

### DateRangeReference

Props:

- facets: FacetsResponse | null
- loading: boolean
- errorMessage?: string

Render condicional:

- `loading = true`: mostrar skeleton o texto "Cargando rango disponible...".
- `errorMessage` con valor: mostrar aviso de error y accion de reintento.
- `facets` disponible: mostrar `min_date` y `max_date` como referencia.
- `facets = null` y sin error: mostrar estado vacio "Rango no disponible".

### DateRangeFilterBar

Props:

- value: DateRangeFilter
- minDate?: string
- maxDate?: string
- onChange: (next: DateRangeFilter) => void
- onApply: () => void
- onClear: () => void

Render condicional:

- Solo `start_date` lleno: mostrar validacion "Falta fecha fin" y deshabilitar aplicar.
- Solo `end_date` lleno: mostrar validacion "Falta fecha inicio" y deshabilitar aplicar.
- Rango invertido (`start_date > end_date`): mostrar error y deshabilitar aplicar.
- Ambos vacios: permitir aplicar para mostrar dataset completo.
- Ambos validos: habilitar aplicar.

## Funcionalidad 2: Tabla de alertas de anomalias

### AlertsThresholdControl

Props:

- value: number
- min: number
- max: number
- step: number
- onChange: (next: number) => void

Render condicional:

- Valor fuera de [0.01, 1.0]: mostrar error de validacion y bloquear carga.

### AlertsTableSection

Props:

- params: AlertsParams
- rows: AlertsResponse
- loading: boolean
- errorMessage?: string
- onRefresh: () => void

Render condicional:

- `loading = true`: mostrar skeleton de tabla.
- `errorMessage` con valor: mostrar error y boton "Reintentar".
- `rows.length === 0` y sin error: mostrar estado vacio explicito
  "No se detectaron anomalias para el umbral y rango actuales".
- `rows.length > 0`: mostrar tabla con columnas:
  - periodo
  - outcome registrado
  - media movil de 3 periodos anteriores (baseline_average)
  - incremento porcentual (increase_ratio * 100)

Regla de integracion con funcionalidad 1:

- Si el filtro de fechas esta activo, la consulta de alertas debe reutilizar ese rango.
- Si solo un campo de fecha esta completo, no consultar alertas y mostrar validacion.

## Funcionalidad 3: Vista comparativa B2B vs B2C

### TopCategoriesPanel

Props:

- title: "B2B" | "B2C"
- rows: TopCategoriesResponse
- loading: boolean
- errorMessage?: string

Render condicional:

- `loading = true`: skeleton de filas.
- `errorMessage` con valor: mensaje de error del panel.
- `rows.length === 0`: estado vacio especifico:
  - B2B: "Sin categorias top para B2B en este rango"
  - B2C: "Sin categorias top para B2C en este rango"
- `rows.length > 0`: tabla con columnas:
  - categoria
  - total de ingresos (`total_amount`)
  - porcentaje sobre total del grupo (calculado en frontend)

### B2BvsB2CIncomeChart

Props:

- b2bTotalIncome: number
- b2cTotalIncome: number
- loading: boolean
- hasData: boolean

Render condicional:

- `loading = true`: mostrar placeholder de grafico.
- `hasData = false`: mostrar estado vacio "Sin datos para comparar".
- `hasData = true`: graficar comparativa total ingresos B2B vs B2C.

### B2BvsB2CView

Props:

- dateRange: DateRangeFilter
- onDateRangeChange: (next: DateRangeFilter) => void
- onApplyFilters: () => void
- b2b: TopCategoriesResponse
- b2c: TopCategoriesResponse
- loadingB2B: boolean
- loadingB2C: boolean
- errorB2B?: string
- errorB2C?: string

Render condicional:

- Solo un input de fecha lleno: mostrar validacion y no disparar consultas.
- Ambos paneles vacios: mostrar estado vacio en cada panel y mensaje resumen global.
- Al menos un panel con datos: render normal por panel y grafico comparativo.
