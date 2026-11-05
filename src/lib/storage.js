// ---- Storage keys (the "names" of our database tables) ----
const TRANSACTIONS_KEY = 'pf_transactions'
const BUDGETS_KEY = 'pf_budgets'

// ---- Safe read from localStorage ----
// Returns the parsed array, or an empty array if nothing is stored yet.
function readJSON(key) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return []
    const parsed = JSON.parse(raw)
    // Defensive: always return an array, even if data got corrupted somehow
    return Array.isArray(parsed) ? parsed : []
  } catch {
    // If JSON parsing fails, don't crash the app — return empty
    return []
  }
}

// ---- Safe write to localStorage ----
// Converts the array to JSON text and stores it.
function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

// ---- Generate a unique ID ----
// Uses crypto.randomUUID if available (modern browsers), else a fallback.
function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

// TRANSACTIONS

// Get all transactions (newest first)
export function getTransactions() {
  const list = readJSON(TRANSACTIONS_KEY)
  return [...list].sort((a, b) => (a.date < b.date ? 1 : -1))
}

// Add a new transaction
export function addTransaction(tx) {
  const list = readJSON(TRANSACTIONS_KEY)
  const newTx = {
    id: generateId(),
    type: tx.type,
    amount: Math.round(Number(tx.amount)),  // force integer (cents)
    category: tx.category,
    description: (tx.description || '').trim(),
    date: tx.date,
    createdAt: new Date().toISOString(),
  }
  const updated = [...list, newTx]
  writeJSON(TRANSACTIONS_KEY, updated)
  return newTx
}

// Delete a transaction by ID
export function deleteTransaction(id) {
  const list = readJSON(TRANSACTIONS_KEY)
  const updated = list.filter((tx) => tx.id !== id)
  writeJSON(TRANSACTIONS_KEY, updated)
  return updated
}

// BUDGETS

// Get all budgets
export function getBudgets() {
  return readJSON(BUDGETS_KEY)
}

// Set (create or update) a budget for a category in a month
export function setBudget({ category, limit, month }) {
  const list = readJSON(BUDGETS_KEY)
  const existing = list.find(
    (b) => b.category === category && b.month === month
  )
  if (existing) {
    existing.limit = Math.round(Number(limit))
    writeJSON(BUDGETS_KEY, list)
    return existing
  }
  const newBudget = {
    id: generateId(),
    category,
    limit: Math.round(Number(limit)),
    month,
  }
  const updated = [...list, newBudget]
  writeJSON(BUDGETS_KEY, updated)
  return newBudget
}

// Delete a budget by ID
export function deleteBudget(id) {
  const list = readJSON(BUDGETS_KEY)
  const updated = list.filter((b) => b.id !== id)
  writeJSON(BUDGETS_KEY, updated)
  return updated
}