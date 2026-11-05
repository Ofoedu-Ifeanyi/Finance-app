import { formatMoney, formatDate } from '../lib/helpers'

export default function TransactionRow({ tx, onDelete }) {
  const isIncome = tx.type === 'income'
  const amountClass = isIncome ? 'amount income' : 'amount expense'

  return (
    <li className="tx-row">
      <div className="tx-main">
        <div className="tx-description">
          {tx.description || tx.category}
        </div>
        <div className="tx-meta">
          <span className="tx-category">{tx.category}</span>
          <span className="tx-date">{formatDate(tx.date)}</span>
        </div>
      </div>
      <div className={amountClass}>
        {isIncome ? '+' : '−'} {formatMoney(tx.amount)}
      </div>
      <button
        type="button"
        className="tx-delete"
        onClick={() => onDelete(tx.id)}
        aria-label="Delete transaction"
      >
        ✕
      </button>
    </li>
  )
}