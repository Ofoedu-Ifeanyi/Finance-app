import { useEffect, useState } from 'react'
import { getTransactions, addTransaction, deleteTransaction } from '../lib/storage'
import { sumByType, formatMoney } from '../lib/helpers'
import TransactionForm from '../components/TransactionForm'
import TransactionRow from '../components/TransactionRow'

export default function Transactions() {
  const [transactions, setTransactions] = useState([])

  function load() {
    setTransactions(getTransactions())
  }

  useEffect(() => {
    load()
  }, [])

  function handleAdd(tx) {
    addTransaction(tx)
    load()
  }

  function handleDelete(id) {
    deleteTransaction(id)
    load()
  }

  const totalIncome = sumByType(transactions, 'income')
  const totalExpense = sumByType(transactions, 'expense')

  return (
    <div>
      <h1>Transactions</h1>

      <TransactionForm onAdd={handleAdd} />

      <div className="tx-summary">
        <span>Income: <strong className="income">{formatMoney(totalIncome)}</strong></span>
        <span>Expense: <strong className="expense">{formatMoney(totalExpense)}</strong></span>
        <span>Net: <strong>{formatMoney(totalIncome - totalExpense)}</strong></span>
      </div>

      {transactions.length === 0 ? (
        <p className="empty-state">No transactions yet. Add one above to get started.</p>
      ) : (
        <ul className="tx-list">
          {transactions.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} onDelete={handleDelete} />
          ))}
        </ul>
      )}
    </div>
  )
}