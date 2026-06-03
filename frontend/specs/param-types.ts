import type { BusinessType, OperationType } from "./api-types";

/**
 * Filtro compartido de rango de fechas para query params.
 */
export interface DateRangeFilter {
  /**
   * Fecha inicial del rango (inclusive).
   * Formato requerido: YYYY-MM-DD.
   */
  start_date?: string;

  /**
   * Fecha final del rango (inclusive).
   * Formato requerido: YYYY-MM-DD.
   */
  end_date?: string;
}

/**
 * Parametros para GET /api/metrics/alerts.
 */
export interface AlertsParams extends DateRangeFilter {
  /**
   * Umbral de alerta.
   * Valor valido: ratio entre 0.01 y 1.0 para UI.
   * Restriccion backend: >= 0.
   */
  threshold: number;
}

/**
 * Parametros base para GET /api/metrics/categories/top.
 */
export interface TopCategoriesParams extends DateRangeFilter {
  /**
   * Tipo de operacion del ranking.
   * Valores validos: "income" | "outcome".
   */
  operation_type: OperationType;

  /**
   * Maximo de filas retornadas.
   * Restriccion backend: entero entre 1 y 20.
   */
  limit: number;
}

/**
 * Parametros concretos para comparar B2B vs B2C en paneles separados.
 */
export interface BusinessTopCategoriesParams extends TopCategoriesParams {
  /**
   * Segmento de negocio consultado.
   * Valores validos: "B2B" | "B2C".
   */
  business_type: BusinessType;
}
