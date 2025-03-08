import { Request, Response, NextFunction } from "express"
import prisma from "../models/prisma"

// Get all transactions with optional filtering

/**
     {
  type: 'expense',
  category: 'groceries',
  date: {
    gte: new Date('2023-01-01'),
    lte: new Date('2023-01-31')
  }
}
https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting
  */
export const getAllTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, from, to, category } = req.query
    const filter: any = {}

    if (type) filter.type = type
    if (category) filter.category = category
    if (from || to) {
      filter.date = {}
      if (from) filter.date.gte = new Date(from as string)
      if (to) filter.date.lte = new Date(to as string)
    }

    const transactions = await prisma.transaction.findMany({
      where: filter,
      // order by 'ASC' and 'desc' can mbe done
      orderBy: { date: "desc" },
    })

    res.json(transactions)
  } catch (error) {
    next(error)
  }
}

// Get a single transaction by ID
export const getTransactionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const transaction = await prisma.transaction.findUnique({ where: { id } })
    if (!transaction) {
      const error = new Error("Transaction not found")
      ;(error as any).statusCode = 404
      throw error
    }
    res.json(transaction)
  } catch (error) {
    next(error)
  }
}

// Create a new transaction
export const createTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, amount, category, date, description } = req.body

    // enums at this place ,
    if (!type || !["income", "expense"].includes(type)) {
      const error = new Error('Type must be either "income" or "expense"')
      ;(error as any).statusCode = 400
      throw error
    }
    if (amount === undefined || typeof amount !== "number" || amount < 0) {
      const error = new Error("Amount must be a non-negative number")
      ;(error as any).statusCode = 400
      throw error
    }
    if (!category) {
      const error = new Error("Category is required")
      ;(error as any).statusCode = 400
      throw error
    }
    if (!date || isNaN(new Date(date).getTime())) {
      const error = new Error("Valid date is required")
      ;(error as any).statusCode = 400
      throw error
    }
    // https://www.prisma.io/docs/orm/prisma-client/queries/crud#create
    const transaction = await prisma.transaction.create({
      data: {
        type,
        amount,
        category,
        date: new Date(date),
        description,
      },
    })

    res.status(201).json(transaction)
  } catch (error) {
    next(error)
  }
}

// Update an existing transaction
export const updateTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const { type, amount, category, date, description } = req.body

    const existingTransaction = await prisma.transaction.findUnique({
      where: { id },
    })
    if (!existingTransaction) {
      const error = new Error("Transaction not found")
      ;(error as any).statusCode = 404
      throw error
    }

    if (type && !["income", "expense"].includes(type)) {
      const error = new Error('Type must be either "income" or "expense"')
      ;(error as any).statusCode = 400
      throw error
    }
    if (amount !== undefined && (typeof amount !== "number" || amount < 0)) {
      const error = new Error("Amount must be a non-negative number")
      ;(error as any).statusCode = 400
      throw error
    }
    if (date && isNaN(new Date(date).getTime())) {
      const error = new Error("Invalid date format")
      ;(error as any).statusCode = 400
      throw error
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        type: type || undefined,
        amount: amount !== undefined ? amount : undefined,
        category: category || undefined,
        date: date ? new Date(date) : undefined,
        description: description !== undefined ? description : undefined,
      },
    })

    res.json(updatedTransaction)
  } catch (error) {
    next(error)
  }
}

// Delete a transaction
export const deleteTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    const existingTransaction = await prisma.transaction.findUnique({
      where: { id },
    })
    if (!existingTransaction) {
      const error = new Error("Transaction not found")
      ;(error as any).statusCode = 404
      throw error
    }

    await prisma.transaction.delete({ where: { id } })
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

// computes total income, expense, and net balance
export const getTransactionSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { from, to } = req.query
    const dateFilter: any = {}
    if (from || to) {
      dateFilter.date = {}
      if (from) dateFilter.date.gte = new Date(from as string)
      if (to) dateFilter.date.lte = new Date(to as string)
    }

    const incomeTransactions = await prisma.transaction.findMany({
      where: { type: "income", ...dateFilter },
    })
    const expenseTransactions = await prisma.transaction.findMany({
      where: { type: "expense", ...dateFilter },
    })

    const totalIncome = incomeTransactions.reduce(
      (sum: number, t: any) => sum + t.amount,
      0
    )
    const totalExpense = expenseTransactions.reduce(
      (sum: number, t: any) => sum + t.amount,
      0
    )
    const netBalance = totalIncome - totalExpense

    res.json({ totalIncome, totalExpense, netBalance })
  } catch (error) {
    next(error)
  }
}
