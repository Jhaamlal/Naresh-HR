import { Router } from "express"
import * as transactionController from "../controllers/transactionController"

const router = Router()

// List all transactions (with optional filtering)
router.get("/", transactionController.getAllTransactions)

// Get transaction summary
router.get("/summary", transactionController.getTransactionSummary)

// Retrieve a single transaction by ID
router.get("/:id", transactionController.getTransactionById)

// Create a new transaction
router.post("/", transactionController.createTransaction)

// Update an existing transaction
router.put("/:id", transactionController.updateTransaction)

// Delete a transaction
router.delete("/:id", transactionController.deleteTransaction)

export default router
