import express from "express"
import cors from "cors"
import logger from "./middleware/logger"
import errorHandler from "./middleware/errorHandler"
import transactionRoutes from "./routes/transactionRoutes"

const app = express()

app.use(cors())
app.use(express.json())
app.use(logger)
app.use("/transactions", transactionRoutes)
app.use(errorHandler)

export default app
