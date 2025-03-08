import React, { useState } from "react"
import { TransactionFilters as Filters } from "../../types/transaction"

interface TransactionFiltersProps {
  filters: Filters
  onFilterChange: (filters: Filters) => void
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const [localFilters, setLocalFilters] = useState<Filters>(filters)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setLocalFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilterChange(localFilters)
  }

  const handleReset = () => {
    const resetFilters = { type: "", category: "", from: "", to: "" }
    setLocalFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  return (
    <div className="card mb-6">
      <h2 className="text-lg font-semibold mb-4">Filter Transactions</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label htmlFor="type" className="form-label">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={localFilters.type || ""}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={localFilters.category || ""}
              onChange={handleChange}
              placeholder="Any category"
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="from" className="form-label">
              From Date
            </label>
            <input
              type="date"
              id="from"
              name="from"
              value={localFilters.from || ""}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="to" className="form-label">
              To Date
            </label>
            <input
              type="date"
              id="to"
              name="to"
              value={localFilters.to || ""}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="flex space-x-2">
          <button type="submit" className="btn btn-primary">
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  )
}

export default TransactionFilters
