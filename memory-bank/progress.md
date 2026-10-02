# Progreso

## 2026-10-02 — Mejora con skills de agentes (rama `feature/agent-skills`)

Skills comunitarias instaladas con `npx skills add ... -a claude-code --copy` en `.claude/skills/`,
versiones fijadas en `skills-lock.json`. Un commit por skill.

### 1. `accessibility` (addyosmani/web-quality-skills) — commit `4967ca3`

Lighthouse a11y ya daba 100 antes; la skill advierte que 100 no equivale a WCAG, así que se
auditó el árbol de accesibilidad, el teclado y estados que Lighthouse no ve (carga, error).

| Hallazgo (evidencia) | Cambio | Criterio |
|---|---|---|
| Foco con `outline-ring/50` = 2.03:1 sobre card | `:focus-visible` 2px `--ring` (4.68:1) | 2.4.7 / 1.4.11 |
| Gráficos `svg[role=application]` sin nombre | `title`/`desc` en `LineChart` + `ChartDataTable` sr-only | 1.1.1 / 4.1.2 |
| Solo existía `h1` | `h2` en sección KPI y gráficos, `h3` en etiquetas KPI | estructura de encabezados |
| Error y carga no se anunciaban | `role="alert"`, `role="status"`, `aria-busy` | 4.1.3 |
| UI en inglés con error en español, `lang="en"` | UI completa en español, `lang="es"`, meses `es-ES` | 3.1.1 + regla de naming |
| `<title>frontend</title>` | título descriptivo | 2.4.2 |
| Sin soporte de movimiento reducido | `prefers-reduced-motion` | 2.3 |

Rechazado: skip link (una sola vista sin navegación repetida) y `aria-label` en iconos (lucide ya pone `aria-hidden`).
Contraste de texto verificado con cálculo directo de los tokens oklch: el mínimo es 5.17:1 (muted sobre card).
Seguimiento (revisión del PR #2): las animaciones de Recharts (JS) ahora respetan
`prefers-reduced-motion` mediante `usePrefersReducedMotion` + `isAnimationActive`.

### 2. `vercel-react-best-practices` (vercel-labs/agent-skills) — commit `e6c3572`

Es una guía de rendimiento React/Next (70 reglas). El repo es **Vite**, así que `next/image`,
`next/font`, `next/dynamic`, `server-*` y RSC no aplican.

- Aplicado: `js-combine-iterations` en `computeKPIs` (un recorrido en lugar de cuatro).
- Rechazado con medición (Lighthouse perf, mediana de 3 corridas, build de producción):

| Variante | Score | LCP | TBT |
|---|---|---|---|
| Base (un bundle de 586 kB) | 69 | 4363 ms | 323 ms |
| `React.lazy` en gráficos (`bundle-dynamic-imports`) | 56 | 4944 ms | 773 ms |
| Chunks vendor separados (`codeSplitting`) | 60 | 4736 ms | 513 ms |
| Preload de `/api/metrics` (`rendering-resource-hints`) | 58 | 4467 ms | 694 ms |

El LCP es el valor de un KPI, que depende del fetch y de la ejecución de JS. Los gráficos son
contenido del primer render, no un componente diferible. **Decisión:** se mantiene un solo bundle y
el aviso de chunk > 500 kB del build queda aceptado como preexistente.

### 3. Ecosistema: `seo` (addyosmani/web-quality-skills) — commit `cc92d30`

Búsquedas: `npx skills find performance`, `seo`, `testing`. Se eligió `seo` porque el Lighthouse
de base marcaba SEO 82 con dos fallos concretos y medibles; las opciones de `testing` (TDD, browser
agents) no atacaban un fallo verificado del repo.

- Meta description añadida; `public/robots.txt` (antes `/robots.txt` devolvía el `index.html`).
- Resultado: SEO 82 → 100.
- No aplicado: sitemap y canonical (no hay URL de producción), JSON-LD, hreflang.

### 4. Skill interna: `.skills/dashboard-pre-merge-qa` — commit `a1c34f3`

QA pre-merge específico del repo (objetivo, inputs, pasos, output, criterios de aceptación).
Probada sobre esta rama: veredicto LISTO. Detectó como deuda los `tickFormatter` ad hoc del eje Y,
ya resuelta con `formatCompactCurrency` y `formatPercent(v, 0)` (tests incluidos).

### Verificación final de la sesión

- `npm run build` OK (solo el aviso de chunk aceptado), `npm run lint` limpio, `npm test` 7/7.
- `docker compose exec -T backend python -m pytest -q`: 15 passed.
- Lighthouse (dev server): accesibilidad 100, buenas prácticas 100, SEO 100.
- Teclado: Tab llega a ambos gráficos con foco visible; las flechas recorren los meses con tooltip en español.

### Lecciones operativas

- En Windows, el contenedor `frontend` no detecta cambios del bind mount: `docker compose restart frontend`.
- Si el puerto 8000 está ocupado, usa un override temporal `"8010:8000"`, sin tocar otros proyectos.
- Las skills comunitarias suponen Next.js; hay que filtrar sus reglas según el stack real y medir antes de aceptar.
