/**
 * Tipos de contrato para respuestas de API usadas en especificaciones frontend.
 */

/**
 * Tipo de operacion permitido por la API.
 * - "income": ingresos
 * - "outcome": egresos
 */
export type OperationType = "income" | "outcome";

/**
 * Tipo de negocio permitido por la API.
 * - "B2B": empresa a empresa
 * - "B2C": empresa a consumidor
 */
export type BusinessType = "B2B" | "B2C";

/**
 * Categoria financiera permitida por la API.
 */
export type Category =
  | "suppliers"
  | "sales"
  | "operational"
  | "administrative"
  | "others";

/**
 * Respuesta del endpoint GET /api/metrics/facets.
 */
export interface FacetsResponse {
  /**
   * Lista de tipos de operacion disponibles para filtrar.
   * Valores validos: "income" | "outcome".
   */
  operation_types: OperationType[];

  /**
   * Lista de tipos de negocio disponibles para filtrar.
   * Valores validos: "B2B" | "B2C".
   */
  business_types: BusinessType[];

  /**
   * Lista de categorias disponibles para filtrar.
   * Valores validos: Category.
   */
  categories: Category[];

  /**
   * Fecha minima disponible en el dataset.
   * Formato: YYYY-MM-DD.
   */
  min_date: string;

  /**
   * Fecha maxima disponible en el dataset.
   * Formato: YYYY-MM-DD.
   */
  max_date: string;
}

/**
 * Registro individual de anomalia para tabla de alertas.
 */
export interface AlertEntry {
  /**
   * Periodo agregado evaluado por backend.
   * Formato esperado segun agrupacion: YYYY-MM-DD, YYYY-WNN o YYYY-MM.
   */
  period: string;

  /**
   * Total de egresos observados en el periodo.
   * Numero decimal >= 0.
   */
  outcome_total: number;

  /**
   * Promedio base historico usado para comparacion.
   * Numero decimal >= 0.
   */
  baseline_average: number;

  /**
   * Incremento relativo vs promedio base.
   * Ejemplo: 0.3 equivale a +30%.
   */
  increase_ratio: number;
}

/**
 * Respuesta del endpoint GET /api/metrics/alerts.
 */
export type AlertsResponse = AlertEntry[];

/**
 * Registro individual de categoria top por monto.
 */
export interface CategoryEntry {
  /**
   * Nombre de categoria financiera.
   * Valores validos: Category.
   */
  category: Category;

  /**
   * Tipo de operacion usado para calcular el ranking.
   * Valores validos: "income" | "outcome".
   */
  operation_type: OperationType;

  /**
   * Monto total acumulado para la categoria.
   * Numero decimal >= 0.
   */
  total_amount: number;
}

/**
 * Respuesta del endpoint GET /api/metrics/categories/top.
 */
export type TopCategoriesResponse = CategoryEntry[];
