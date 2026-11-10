import { useEffect, useState } from 'react'
import { getTransactions } from '../lib/storage'
import { 
  filterByMonth, 
  sumByType, 
  sumByCategory, 
  getMonthKey, 
  getMonthLabel, 
  formatMoney 
} from '../lib/helpers'
import StatCard from '../components/StatCard'

export default function Reports() {
  const [transactions, setTransactions] = useState(getTransactions)
  const [selectedMonth, setSelectedMonth] = useState(getMonthKey(new Date()))

//   useEffect(() => {
//     setTransactions(getTransactions())
//   }, [])

  const filteredTransactions = filterByMonth(transactions, selectedMonth)
  const income = sumByType(filteredTransactions,'income')
  const expense = sumByType(filteredTransactions, 'expense')
  const net = income - expense

   const expenseCategoryTotals = sumByCategory(
    filteredTransactions.filter((tx) => tx.type === 'expense')
  )

  const incomeCategoryTotals = sumByCategory(
    filteredTransactions.filter((tx) => tx.type === 'income')
  )

  function handleExportCSV() {
    let csv = "Category,Amount\n";
    Object.entries(expenseCategoryTotals).forEach(([name, amount]) => {
        const naira = (amount / 100).toFixed(2);
        csv += `${name},${naira}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `report-${selectedMonth}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  return (
    <div>
        <h1>Reports</h1>
        <div className="month-selector">
            <label> Month:<input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} /> </label>
        </div>
        <div className="stat-grid">
            <StatCard title="Income" amount={formatMoney(income)} color="income" />
            <StatCard title="Expense" amount={formatMoney(expense)} color="expense" />
            <StatCard title="Balance" amount={formatMoney(net)} color="neutral" />
        </div>
        <div className="chart-card">
            <h1>Expense by Category</h1>
            <div style={{ overflowX: 'auto' }}>
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody> 
                        {Object.keys(expenseCategoryTotals).length === 0 && (
                        <tr>
                            <td colSpan="2" style={{ textAlign: 'center', padding: '1rem', color: '#6b7280' }}>
                            No expenses this month
                            </td>
                        </tr>
                        )}
                        {Object.entries(expenseCategoryTotals).map(([name, amount]) => (
                            <tr key={name}>
                                <td>{name}</td>
                                <td>{formatMoney(amount)}</td>
                            </tr>
                        ))}
                        <tr className="total-row">
                            <td><strong>Total</strong></td>
                            <td><strong>{formatMoney(expense)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div className="chart-card">
            <div className="chart-card">
                <h2>Income by Source</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table className="report-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody> 
                        {Object.keys(expenseCategoryTotals).length === 0 && (
                        <tr>
                            <td colSpan="2" style={{ textAlign: 'center', padding: '1rem', color: '#6b7280' }}>
                            No expenses this month
                            </td>
                        </tr>
                        )}
                        {Object.entries(incomeCategoryTotals).map(([name, amount]) => (
                            <tr key={name}>
                                <td>{name}</td>
                                <td>{formatMoney(amount)}</td>
                            </tr>
                        ))}
                        <tr className="total-row">
                            <td><strong>Total</strong></td>
                            <td><strong>{formatMoney(income)}</strong></td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                <button className="export-btn" onClick=        {handleExportCSV}>
                    Export to CSV
                </button>
            </div>
        </div>
    </div>
  )
}