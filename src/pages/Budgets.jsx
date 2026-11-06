import { useEffect, useState } from 'react'
import { getTransactions, getBudgets, setBudget, deleteBudget } from '../lib/storage'
import { getBudgetStatus, getMonthKey, getMonthLabel, formatMoney, parseMoneyToCents } from '../lib/helpers'
import { DEFAULT_CATEGORIES } from '../data/categories'
import BudgetProgress from '../components/BudgetProgress'

export default function Budgets() {
  const [budgets, setBudgets] = useState([])
  const [transactions, setTransactions] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(getMonthKey(new Date()))
  
  // Form state
  const [category, setCategory] = useState('')
  const [limitInput, setLimitInput] = useState('')
  const [error, setError] = useState('')

  function load() {
    setBudgets(getBudgets())
    setTransactions(getTransactions())
  }

  useEffect(() => {
    load()
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const cents = parseMoneyToCents(limitInput)
    if (cents <= 0) {
      setError('Budget must be greater than zero.')
      return
    }
    if (!category) {
      setError('Please choose a category.')
      return
    }

    setBudget({ category, limit: cents, month: selectedMonth })
    load()
    setLimitInput('')
    setCategory('')
  }

  function handleDelete(id) {
    deleteBudget(id)
    load()
  }

  // Calculate the status array using our helper from Step 8
  const budgetStatuses = getBudgetStatus(budgets, transactions, selectedMonth)

  return (
    <div>
      <h1>Budgets</h1>
      
      <div className="month-selector">
        <label>
          Month: 
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </label>
      </div>

      <form className="tx-form" onSubmit={handleSubmit}>
        <div className="tx-form-grid">
          <label>
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">— select —</option>
              {DEFAULT_CATEGORIES.filter(c => c.type === 'expense').map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </label>
          
          <label>
            Limit (₦)
            <input
              type="number"
              step="0.01"
              value={limitInput}
              onChange={(e) => setLimitInput(e.target.value)}
              placeholder="0.00"
            />
          </label>
        </div>
        
        {error && <p className="tx-form-error">{error}</p>}
        <button type="submit" className="tx-form-submit">Set Budget</button>
      </form>

      <div className="budget-list">
        {budgetStatuses.length === 0 ? (
          <p className="empty-state">No budgets set for {getMonthLabel(selectedMonth)}.</p>
        ) : (
          budgetStatuses.map(b => (
            <div key={b.id} className="budget-card-wrapper">
              <BudgetProgress budget={b} />
              <button className="tx-delete" onClick={() => handleDelete(b.id)}>✕</button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}