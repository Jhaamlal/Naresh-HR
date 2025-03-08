import { useState, useEffect, useCallback } from "react"
import { TransactionSummary, TransactionFilters } from "../types/transaction"
import { transactionService } from "../services/api"

export const useTransactionSummary = (initialFilters?: TransactionFilters) => {
  const [summary, setSummary] = useState<TransactionSummary>({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
  })
  const [filters, setFilters] = useState<TransactionFilters>(
    initialFilters || {}
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await transactionService.getSummary(filters)
      setSummary(data)
    } catch (err) {
      setError("Failed to fetch summary")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  const updateFilters = (newFilters: TransactionFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  return { summary, loading, error, filters, updateFilters }
}
