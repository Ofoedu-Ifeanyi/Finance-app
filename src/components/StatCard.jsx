export default function StatCard({ title, amount, color = 'neutral' }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-card-title">{title}</div>
      <div className="stat-card-amount">{amount}</div>
    </div>
  )
}