import { useState, useEffect, useCallback } from "react"
import { Transaction, TransactionFilters } from "../types/transaction"
import { transactionService } from "../services/api"

export const useTransactions = (initialFilters?: TransactionFilters) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filters, setFilters] = useState<TransactionFilters>(
    initialFilters || {}
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await transactionService.getAll(filters)
      setTransactions(data)
    } catch (err) {
      setError("Failed to fetch transactions")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const updateFilters = (newFilters: TransactionFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const refreshTransactions = () => {
    fetchTransactions()
  }

  return {
    transactions,
    loading,
    error,
    filters,
    updateFilters,
    refreshTransactions,
  }
}
