export interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  date: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface TransactionSummary {
  totalIncome: number
  totalExpense: number
  netBalance: number
}

export interface TransactionFilters {
  type?: string
  category?: string
  from?: string
  to?: string
}
