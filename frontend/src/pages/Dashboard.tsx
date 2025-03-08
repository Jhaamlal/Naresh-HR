import React, { useState } from "react"
import PageContainer from "../components/layout/PageContainer"
import TransactionFilters from "../components/transactions/TransactionFilters"
import TransactionTable from "../components/transactions/TransactionTable"
import TransactionForm from "../components/transactions/TransactionForm"
import Spinner from "../components/common/Spinner"
import Alert from "../components/common/Alert"
import { useTransactions } from "../hooks/useTransactions"
import { Transaction } from "../types/transaction"
import { transactionService } from "../services/api"

const Dashboard: React.FC = () => {
  const {
    transactions,
    loading,
    error,
    filters,
    updateFilters,
    refreshTransactions,
  } = useTransactions()
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<
    Transaction | undefined
  >(undefined)
  const [formError, setFormError] = useState<string | null>(null)

  const handleAddClick = () => {
    setEditingTransaction(undefined)
    setShowForm(true)
  }

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setShowForm(true)
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingTransaction(undefined)
    setFormError(null)
  }

  const handleFormSubmit = async (data: Omit<Transaction, "id">) => {
    try {
      if (editingTransaction) {
        await transactionService.update(editingTransaction.id, data)
      } else {
        await transactionService.create(data)
      }
      setShowForm(false)
      setEditingTransaction(undefined)
      refreshTransactions()
    } catch (err) {
      setFormError("Failed to save transaction")
      console.error(err)
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await transactionService.delete(id)
        refreshTransactions()
      } catch (err) {
        console.error("Failed to delete transaction:", err)
      }
    }
  }

  return (
    <PageContainer title="Transaction Dashboard">
      <div className="flex justify-end mb-4">
        <button onClick={handleAddClick} className="btn btn-primary">
          Add Transaction
        </button>
      </div>

      <TransactionFilters filters={filters} onFilterChange={updateFilters} />

      {formError && (
        <Alert
          type="error"
          message={formError}
          onClose={() => setFormError(null)}
        />
      )}

      {showForm && (
        <div className="mb-6">
          <TransactionForm
            transaction={editingTransaction}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      {loading ? (
        <div className="py-10">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <Alert type="error" message={error} />
      ) : (
        <div className="card">
          <TransactionTable
            transactions={transactions}
            onEdit={handleEditClick}
            onDelete={handleDeleteTransaction}
          />
        </div>
      )}
    </PageContainer>
  )
}

export default Dashboard
