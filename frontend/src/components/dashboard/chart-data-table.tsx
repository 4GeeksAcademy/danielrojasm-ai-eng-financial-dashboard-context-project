import { type MonthlyDataPoint } from '@/lib/financial-types'

interface ChartDataColumn {
  key: keyof Omit<MonthlyDataPoint, 'month'>
  label: string
  format: (value: number) => string
}

interface ChartDataTableProps {
  id: string
  caption: string
  data: MonthlyDataPoint[]
  columns: ChartDataColumn[]
}

// Text alternative for a chart: visually hidden, read by screen readers.
export function ChartDataTable({ id, caption, data, columns }: ChartDataTableProps) {
  return (
    <table id={id} className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">Mes</th>
          {columns.map((column) => (
            <th key={column.key} scope="col">
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((point) => (
          <tr key={point.month}>
            <th scope="row">{point.month}</th>
            {columns.map((column) => (
              <td key={column.key}>{column.format(point[column.key])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
