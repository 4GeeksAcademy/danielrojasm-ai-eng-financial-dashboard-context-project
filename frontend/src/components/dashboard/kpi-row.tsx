import { KPICard } from './kpi-card'
import { type KPIMetrics } from '@/lib/financial-types'
import { formatCurrency, formatPercent } from '@/lib/financial-utils'
import { TrendingUp, TrendingDown, DollarSign, BarChart2 } from 'lucide-react'

interface KPIRowProps {
  metrics: KPIMetrics | null
  loading?: boolean
}

export function KPIRow({ metrics, loading }: KPIRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <KPICard
        label="Ingresos totales"
        value={metrics ? formatCurrency(metrics.totalIncome) : '—'}
        helperText="Ingresos acumulados de todos los movimientos de ingreso"
        icon={TrendingUp}
        variant="income"
        loading={loading}
      />
      <KPICard
        label="Egresos totales"
        value={metrics ? formatCurrency(metrics.totalOutcome) : '—'}
        helperText="Gasto total en todas las categorías"
        icon={TrendingDown}
        variant="outcome"
        loading={loading}
      />
      <KPICard
        label="Ganancia"
        value={metrics ? formatCurrency(metrics.profit) : '—'}
        helperText="Ganancia neta: ingresos menos egresos totales"
        icon={DollarSign}
        variant="profit"
        loading={loading}
      />
      <KPICard
        label="Margen de ganancia"
        value={metrics ? formatPercent(metrics.profitPercent) : '—'}
        helperText="Ganancia como porcentaje del ingreso total"
        icon={BarChart2}
        variant="profitPercent"
        loading={loading}
      />
    </div>
  )
}
