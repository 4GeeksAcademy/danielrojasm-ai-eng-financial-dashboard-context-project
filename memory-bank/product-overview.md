# Product Overview

## Resumen

Este repositorio implementa un dashboard de metricas financieras para visualizar ingresos, egresos y rentabilidad en una interfaz web.

El producto tiene dos partes:

- Backend API con FastAPI que genera datos financieros simulados, aplica filtros y expone endpoints de analitica.
- Frontend con React y TypeScript que consume la API y muestra KPIs y graficos.

## Problema que resuelve

Permite revisar el desempeno financiero de forma rapida, con foco en:

- balances de ingresos vs egresos
- evolucion por periodos
- comparacion de periodos
- deteccion de alertas en comportamiento de egresos

## Experiencia de uso actual

- La pantalla principal carga datos desde la API y muestra:
  - encabezado del dashboard
  - fila de KPIs
  - grafico de ingresos y egresos
  - grafico de margen o porcentaje de ganancia
- Si la API falla, se muestra un mensaje de error en pantalla.

## Evidencia verificable del repositorio

- README describe dashboard financiero full stack y puertos locales.
- App del frontend consume /api/metrics y calcula KPIs para render.
- API backend expone endpoints de metrics, summary, comparison, alerts y segmentacion B2B/B2C.
- docker-compose levanta frontend y backend en puertos esperados.
