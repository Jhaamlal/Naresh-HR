import React, { useState, useEffect } from "react"
import { Transaction } from "../../types/transaction"
import Alert from "../common/Alert"

interface TransactionFormProps {
  transaction?: Transaction
  onSubmit: (transaction: Omit<Transaction, "id">) => Promise<void>
  onCancel: () => void
}

const initialState = {
  type: "expense" as "income" | "expense",
  amount: "",
  category: "",
  date: new Date().toISOString().split("T")[0],
  description: "",
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        category: transaction.category,
        date: new Date(transaction.date).toISOString().split("T")[0],
        description: transaction.description || "",
      })
    }
  }, [transaction])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError("Amount must be a positive number")
      return
    }

    if (!formData.category.trim()) {
      setError("Category is required")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      await onSubmit({
        type: formData.type as "income" | "expense",
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        description: formData.description || undefined,
      })

      // Reset form if not editing
      if (!transaction) {
        setFormData(initialState)
      }
    } catch (err) {
      setError("Failed to save transaction")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">
        {transaction ? "Edit Transaction" : "Add New Transaction"}
      </h2>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="type" className="form-label">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label htmlFor="amount" className="form-label">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              placeholder="0.00"
              className="form-input"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Food, Rent, Salary"
              className="form-input"
              required
            />
          </div>

          <div>
            <label htmlFor="date" className="form-label">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="form-label">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Add more details about this transaction"
            className="form-input"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : transaction ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TransactionForm
