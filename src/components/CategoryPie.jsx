import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatMoney } from '../lib/helpers'
import { DEFAULT_CATEGORIES } from '../data/categories'

function colorForCategory(name) {
  const found = DEFAULT_CATEGORIES.find((c) => c.name === name)
  return found ? found.color : '#9ca3af'
}

export default function CategoryPie({ data }) {
  if (!data || data.length === 0) {
    return <p className="empty-state">No expenses this month yet.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={90}
          innerRadius={50}
          paddingAngle={2}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={colorForCategory(entry.name)} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatMoney(value)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}