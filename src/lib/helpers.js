
// Format integer kobo into a Naira string: 125000 → "₦1,250.00"
export function formatMoney(cents) {
  const num = Number(cents) || 0
  const naira = (num / 100).toFixed(2)
  // Add thousands separators: "1234.56" → "1,234.56"
  const [whole, decimals] = naira.split('.')
  const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return '₦' + withCommas + '.' + decimals
}

// Parse user input like "12.50" into integer cents: "12.50" → 1250
export function parseMoneyToCents(input) {
  if (input === '' || input === null || input === undefined) return 0
  const num = Number(input)
  if (isNaN(num)) return 0
  return Math.round(num * 100)
}
// DATES
// Format ISO date "2025-01-15" → "Jan 15, 2025"
export function formatDate(isoDate) {
  if (!isoDate) return ''
  const d = new Date(isoDate + 'T00:00:00')
  if (isNaN(d.getTime())) return isoDate
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Extract month key "2025-01" from any date or ISO string
export function getMonthKey(dateInput) {
  if (!dateInput) return ''
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}$/.test(dateInput)) {
    return dateInput
  }
  const d = new Date(
    typeof dateInput === 'string' ? dateInput + 'T00:00:00' : dateInput
  )
  if (isNaN(d.getTime())) return ''
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

// Convert "2025-01" → "January 2025"
export function getMonthLabel(monthKey) {
  if (!monthKey) return ''
  const [year, month] = monthKey.split('-')
  const d = new Date(Number(year), Number(month) - 1, 1)
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

// Get the last N month keys (including current), newest first.
// Example: getRecentMonths(3) → ["2025-01", "2024-12", "2024-11"]
export function getRecentMonths(n) {
  const out = []
  const now = new Date()
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    out.push(`${year}-${month}`)
  }
  return out
}

// FILTERS
// Return only transactions belonging to the given month key
export function filterByMonth(transactions, monthKey) {
  if (!Array.isArray(transactions)) return []
  return transactions.filter(
    (tx) => getMonthKey(tx.date) === monthKey
  )
}

// AGGREGATIONS
// Sum all transaction amounts (ignores type) — integer cents
export function sumAmount(transactions) {
  if (!Array.isArray(transactions)) return 0
  return transactions.reduce((total, tx) => total + (Number(tx.amount) || 0), 0)
}

// Sum only income or only expenses
export function sumByType(transactions, type) {
  if (!Array.isArray(transactions)) return 0
  return transactions
    .filter((tx) => tx.type === type)
    .reduce((total, tx) => total + (Number(tx.amount) || 0), 0)
}

// Group totals by category: [{category:'Food',amount:1800}, ...] → { Food: 1800 }
export function sumByCategory(transactions) {
  const result = {}
  if (!Array.isArray(transactions)) return result
  for (const tx of transactions) {
    const key = tx.category || 'Other'
    result[key] = (result[key] || 0) + (Number(tx.amount) || 0)
  }
  return result
}

// BUDGETS
// For each budget in the given month, return { ...budget, spent, remaining, percent }
// Only expense transactions count toward budgets.
export function getBudgetStatus(budgets, transactions, monthKey) {
  if (!Array.isArray(budgets) || !Array.isArray(transactions)) return []
  const monthly = filterByMonth(transactions, monthKey).filter(
    (tx) => tx.type === 'expense'
  )
  const spentByCategory = sumByCategory(monthly)

  return budgets
    .filter((b) => b.month === monthKey)
    .map((b) => {
      const spent = spentByCategory[b.category] || 0
      const remaining = b.limit - spent
      const percent = b.limit > 0 ? Math.round((spent / b.limit) * 100) : 0
      return { ...b, spent, remaining, percent }
    })
}