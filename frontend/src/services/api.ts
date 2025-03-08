import axios from "axios"
import {
  Transaction,
  TransactionSummary,
  TransactionFilters,
} from "../types/transaction"

const API_URL = "http://localhost:8080"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export const transactionService = {
  getAll: async (filters?: TransactionFilters): Promise<Transaction[]> => {
    const response = await api.get("/transactions", { params: filters })
    return response.data
  },

  getById: async (id: string): Promise<Transaction> => {
    const response = await api.get(`/transactions/${id}`)
    return response.data
  },

  create: async (
    transaction: Omit<Transaction, "id">
  ): Promise<Transaction> => {
    const response = await api.post("/transactions", transaction)
    return response.data
  },

  update: async (
    id: string,
    transaction: Partial<Transaction>
  ): Promise<Transaction> => {
    const response = await api.put(`/transactions/${id}`, transaction)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`)
  },

  getSummary: async (
    filters?: TransactionFilters
  ): Promise<TransactionSummary> => {
    const response = await api.get("/transactions/summary", { params: filters })
    return response.data
  },
}
