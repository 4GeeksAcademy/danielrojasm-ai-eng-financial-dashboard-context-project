---
name: dashboard-pre-merge-qa
description: Checklist de QA pre-merge para el dashboard financiero (FastAPI + React/Vite). Úsala antes de abrir o aprobar un PR que toque frontend/ o backend/, o cuando pidan "verificar antes del merge", "QA del dashboard" o "¿esto está listo para main?".
---

# QA pre-merge del dashboard financiero

## Objetivo

Decidir con evidencia si un cambio puede ir a `main` sin romper el build, los tests, la accesibilidad
ni las convenciones de UI de **este** repo. El resultado es un veredicto (LISTO / NO LISTO) con la
salida de cada comando, no una opinión.

## Inputs

- La rama a verificar (por defecto la actual) y su diff de código contra `main`:
  `git diff --stat main...HEAD -- frontend backend` (excluye skills vendorizadas en `.claude/skills/`).
- Docker Desktop en ejecución (el stack se levanta con `docker-compose.yml`).
- Opcional: la URL del PR, para pegar el reporte.

## Pasos

1. **Alcance.** Lista los archivos tocados. Si cambian `frontend/src/lib/` o `backend/app/`, es un
   cambio de lógica: debe venir con test nuevo o modificado (`.agents/rules/testing.md`).
2. **Frontend** (desde `frontend/`): `npm run build`, `npm run lint`, `npm test`.
   - El aviso `Some chunks are larger than 500 kB` es **preexistente y aceptado** (ver más abajo).
     Cualquier otro aviso nuevo es un bloqueo.
3. **Backend:** `docker compose up -d` y luego `docker compose exec -T backend python -m pytest -q`.
   - Si el puerto 8000 del host está ocupado por otro proyecto, **no lo detengas**: usa un override
     temporal fuera del repo que mapee `"8010:8000"` en `backend.ports` con `!override`. El
     frontend sigue funcionando porque el proxy de Vite apunta a `backend:8000` dentro de la red.
4. **App en ejecución.** Abre `http://localhost:5173` y confirma que cargan los KPIs y los dos gráficos.
   - En Windows el bind mount no dispara el watcher de Vite: tras editar, ejecuta
     `docker compose restart frontend` antes de verificar. Lo mismo para archivos nuevos en `public/`.
5. **Accesibilidad y SEO:** `npx lighthouse http://localhost:5173 --only-categories=accessibility,best-practices,seo`.
   Línea base: **100 / 100 / 100**. Luego comprueba a mano lo que Lighthouse no ve:
   - Tab llega a los dos gráficos (`svg[role=application]`) con contorno visible, y las flechas
     mueven el tooltip.
   - Cada gráfico tiene `title`/`desc` en el `LineChart` y un `ChartDataTable` (sr-only) con los mismos datos.
   - Jerarquía de encabezados: `h1` → `h2` (sección KPI y gráficos) → `h3` (etiquetas KPI).
   - El error de API se anuncia con `role="alert"` (simúlalo bloqueando `/api/metrics` en DevTools).
6. **Convenciones de UI del repo:**
   - Textos visibles en **español** y `<html lang="es">`; sin mezclar idiomas en la vista.
   - Meses con `toLocaleDateString("es-ES")` (`"dic 2025"`); importes con `formatCurrency`
     (`"$1,235"`, USD) o `formatCompactCurrency` en ejes (`"$68K"`); porcentajes con
     `formatPercent(v, decimales)` (`"15.6%"`). No crear formateadores ad hoc en componentes.
   - Animaciones JS (Recharts): `isAnimationActive={!usePrefersReducedMotion()}`.
   - Colores solo vía tokens de `src/index.css` (`--chart-*`, `--*-badge*`); el texto requiere ≥ 4.5:1
     y los gráficos/foco ≥ 3:1 sobre `--card` (tema oscuro: `main.dark`).
7. **Decisiones ya medidas (no reabrir sin datos nuevos):** no aplicar lazy-load (`React.lazy`) a los
   gráficos ni dividir el chunk de Recharts: en Lighthouse empeoraron el LCP (+0.4–0.6 s) porque los
   gráficos son contenido del primer render. Ver `memory-bank/progress.md`.
8. **Commits:** un commit por skill o tema, mensaje en español con prefijo (`a11y:`, `perf:`, `seo:`,
   `fix:`, `docs:`) y, si aplica, la skill o regla que lo motiva.

## Output esperado

Un reporte en Markdown, listo para pegar en el PR:

```
## QA pre-merge — <rama>
Veredicto: LISTO | NO LISTO
| Check | Resultado | Evidencia |
| build / lint / test frontend | ✅/❌ | <resumen de la salida> |
| pytest backend | ✅/❌ | N passed |
| Lighthouse a11y/bp/seo | ✅/❌ | 100/100/100 |
| Teclado + lector (paso 5) | ✅/❌ | ... |
| Convenciones UI (paso 6) | ✅/❌ | ... |
Bloqueos: <lista con archivo:línea y acción concreta>
```

## Criterios de aceptación

- Cada fila del reporte cita la salida real de un comando o una observación concreta; nada se marca ✅ por suposición.
- Veredicto LISTO solo si: build sin avisos nuevos, lint limpio, todos los tests pasan, Lighthouse
  sin regresión respecto a 100/100/100 y ningún bloqueo de los pasos 5–6.
- Todo cambio de lógica trae su test, o una justificación escrita en el PR.
- Los bloqueos indican archivo, problema y siguiente acción (`.agents/rules/dx.md`: "error útil").
- No se modificó el entorno de otros proyectos (puertos, contenedores) para hacer pasar la verificación.
