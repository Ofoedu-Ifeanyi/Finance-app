import { useState } from 'react'
import { DEFAULT_CATEGORIES } from '../data/categories'
import { parseMoneyToCents } from '../lib/helpers'

function todayISO() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export default function TransactionForm({ onAdd }) {
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(todayISO())
  const [error, setError] = useState('')

  const availableCategories = DEFAULT_CATEGORIES.filter((c) => c.type === type)

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const cents = parseMoneyToCents(amount)
    if (cents <= 0) {
      setError('Amount must be greater than zero.')
      return
    }
    if (!category) {
      setError('Please choose a category.')
      return
    }
    if (!date) {
      setError('Please pick a date.')
      return
    }

    onAdd({
      type,
      amount: cents,
      category,
      description: description.trim(),
      date,
    })

    setAmount('')
    setDescription('')
    setError('')
  }

  return (
    <form className="tx-form" onSubmit={handleSubmit}>
      <div className="tx-form-toggle">
        <button
          type="button"
          className={type === 'expense' ? 'toggle active expense' : 'toggle'}
          onClick={() => { setType('expense'); setCategory('') }}
        >
          Expense
        </button>
        <button
          type="button"
          className={type === 'income' ? 'toggle active income' : 'toggle'}
          onClick={() => { setType('income'); setCategory('') }}
        >
          Income
        </button>
      </div>

      <div className="tx-form-grid">
        <label>
          Amount
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>

        <label>
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">— select —</option>
            {availableCategories.map((c) => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </label>

        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label className="tx-form-desc">
          Description (optional)
          <input
            type="text"
            placeholder="e.g. Lunch with team"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </div>

      {error && <p className="tx-form-error">{error}</p>}

      <button type="submit" className="tx-form-submit">
        Add {type === 'expense' ? 'Expense' : 'Income'}
      </button>
    </form>
  )
}