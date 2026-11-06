import { formatMoney } from '../lib/helpers'

export default function BudgetProgress({ budget }) {
  const { category, limit, spent, remaining, percent } = budget

  // Decide color based on percentage
  let statusClass = 'safe'
  if (percent >= 100) statusClass = 'over'
  else if (percent >= 80) statusClass = 'warning'

  // Cap the visual bar width at 100% so it doesn't overflow the container
  const barWidth = Math.min(percent, 100)

  return (
    <div className="budget-item">
      <div className="budget-header">
        <strong>{category}</strong>
        <span>
          {formatMoney(spent)} / {formatMoney(limit)}
        </span>
      </div>

      <div className="budget-bar-track">
        <div
          className={`budget-bar-fill ${statusClass}`}
          style={{ width: `${barWidth}%` }}
        />
      </div>

      <div className="budget-footer">
        <span className={`status-text ${statusClass}`}>
          {percent}% used
        </span>
        <span className={remaining < 0 ? 'status-text over' : ''}>
          {remaining < 0
            ? `Over by ${formatMoney(Math.abs(remaining))}`
            : `${formatMoney(remaining)} left`}
        </span>
      </div>
    </div>
  )
}