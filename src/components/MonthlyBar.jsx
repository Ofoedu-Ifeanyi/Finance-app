import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatMoney, getMonthLabel } from '../lib/helpers'

export default function MonthlyBar({ data }) {
  if (!data || data.length === 0) {
    return <p className="empty-state">Not enough history yet.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
        <XAxis
          dataKey="month"
          tickFormatter={(m) => getMonthLabel(m).split(' ')[0].slice(0, 3)}
        />
        <YAxis tickFormatter={(v) => (v / 100).toFixed(0)} />
        <Tooltip
          formatter={(value) => formatMoney(value)}
          labelFormatter={(label) => getMonthLabel(label)}
        />
        <Legend />
        <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}