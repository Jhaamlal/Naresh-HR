/**
 * Generate a random ID (for demo purposes)
 */
export const generateId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  )
}

/**
 * Delay function for simulating API calls (for demo purposes)
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Group transactions by category
 */
export const groupByCategory = (transactions: any[]) => {
  return transactions.reduce((acc, transaction) => {
    const category = transaction.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(transaction)
    return acc
  }, {})
}
