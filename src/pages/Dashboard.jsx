import { useEffect, useState } from 'react'
import { getTransactions } from '../lib/storage'
import {
  filterByMonth,
  sumByType,
  sumByCategory,
  getMonthKey,
  getRecentMonths,
  formatMoney,
} from '../lib/helpers'
import StatCard from '../components/StatCard'
import CategoryPie from '../components/CategoryPie'
import MonthlyBar from '../components/MonthlyBar'

export default function Dashboard() {
  const [transactions, setTransactions] = useState(getTransactions)


  const currentMonth = getMonthKey(new Date())
  const thisMonth = filterByMonth(transactions, currentMonth)

  const income = sumByType(thisMonth, 'income')
  const expense = sumByType(thisMonth, 'expense')
  const net = income - expense

  const expensesByCategory = sumByCategory(
    thisMonth.filter((tx) => tx.type === 'expense')
  )
  const pieData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value,
  }))

  const recentMonths = getRecentMonths(6)
  const barData = recentMonths
    .slice()
    .reverse()
    .map((monthKey) => {
      const monthTx = filterByMonth(transactions, monthKey)
      return {
        month: monthKey,
        income: sumByType(monthTx, 'income'),
        expense: sumByType(monthTx, 'expense'),
      }
    })

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="page-subtitle">{formatMoney(net)} net this month</p>

      <div className="stat-grid">
        <StatCard title="Income" amount={formatMoney(income)} color="income" />
        <StatCard title="Expense" amount={formatMoney(expense)} color="expense" />
        <StatCard title="Balance" amount={formatMoney(net)} color="neutral" />
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h2>Expenses by Category</h2>
          <CategoryPie data={pieData} />
        </div>
        <div className="chart-card">
          <h2>Last 6 Months</h2>
          <MonthlyBar data={barData} />
        </div>
      </div>
    </div>
  )
}