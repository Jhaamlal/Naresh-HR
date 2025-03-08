import React from "react"
import PageContainer from "../components/layout/PageContainer"
import TransactionFilters from "../components/transactions/TransactionFilters"
import Spinner from "../components/common/Spinner"
import Alert from "../components/common/Alert"
import { useTransactionSummary } from "../hooks/useTransactionSummary"
import { formatCurrency } from "../utils/formatters"

const Summary: React.FC = () => {
  const { summary, loading, error, filters, updateFilters } =
    useTransactionSummary()

  return (
    <PageContainer title="Financial Summary">
      <TransactionFilters filters={filters} onFilterChange={updateFilters} />

      {loading ? (
        <div className="py-10">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <Alert type="error" message={error} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-green-50 border-l-4 border-green-500">
            <h2 className="text-lg font-semibold text-green-700 mb-2">
              Total Income
            </h2>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(summary.totalIncome)}
            </p>
          </div>

          <div className="card bg-red-50 border-l-4 border-red-500">
            <h2 className="text-lg font-semibold text-red-700 mb-2">
              Total Expenses
            </h2>
            <p className="text-3xl font-bold text-red-600">
              {formatCurrency(summary.totalExpense)}
            </p>
          </div>

          <div
            className={`card ${
              summary.netBalance >= 0
                ? "bg-blue-50 border-l-4 border-blue-500"
                : "bg-red-50 border-l-4 border-red-500"
            }`}
          >
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Net Balance
            </h2>
            <p
              className={`text-3xl font-bold ${
                summary.netBalance >= 0 ? "text-blue-600" : "text-red-600"
              }`}
            >
              {formatCurrency(summary.netBalance)}
            </p>
          </div>
        </div>
      )}
    </PageContainer>
  )
}

export default Summary
