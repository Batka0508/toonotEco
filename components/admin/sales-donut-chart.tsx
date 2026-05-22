"use client"

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

type SalesDonutChartProps = {
  apartmentSold: number
  garageSold: number
  reserved: number
}

const COLORS = ["#5d5fef", "#22c55e", "#f59e0b"]

const LEGEND = [
  { key: "apartmentSold" as const, label: "Борлуулсан байр", color: COLORS[0] },
  { key: "garageSold" as const, label: "Борлуулсан гараж", color: COLORS[1] },
  { key: "reserved" as const, label: "Захиалгатай", color: COLORS[2] },
]

export function SalesDonutChart({ apartmentSold, garageSold, reserved }: SalesDonutChartProps) {
  const values = { apartmentSold, garageSold, reserved }
  const chartData = LEGEND.map((item) => ({
    name: item.label,
    value: values[item.key],
    color: item.color,
  })).filter((item) => item.value > 0)

  const total = apartmentSold + garageSold + reserved
  const hasData = total > 0

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center">
      <div className="relative h-44 w-44 shrink-0">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={72}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-dashed border-slate-200 bg-slate-50">
            <span className="px-4 text-center text-xs text-slate-400">Өгөгдөл байхгүй</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-900">{total}</span>
          <span className="text-xs text-slate-500">борлуулалт</span>
        </div>
      </div>

      <ul className="grid w-full max-w-[220px] gap-3">
        {LEGEND.map((item) => {
          const value = values[item.key]
          const pct = total > 0 ? Math.round((value / total) * 100) : 0
          return (
            <li key={item.key} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.label}
              </span>
              <span className="font-semibold text-slate-800">
                {value} <span className="text-xs font-normal text-slate-400">({pct}%)</span>
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
