import express from "express"
import "express-async-errors"
import dotenv from "dotenv"
import notFound from "./middleware/not-found.js"
import errorHandlerMiddleware from "./middleware/error-handler.js"
import connectDB from "./db/connect.js"
import productRouter from "./routes/products.js"
dotenv.config()

const app = express()
const port = process.env.PORT || 3000

// middleware
app.use(express.json())

// routes

app.get("/", (req, res) => {
  res.send("<h1>Store API</h1><a href='/api/v1/products'>product route</a>")
})

//product route
app.use("/api/v1/products", productRouter)

app.use(notFound)
app.use(errorHandlerMiddleware)

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    console.log("Connected to DB")
    app.listen(port, () => {
      console.log(`Server is online on port ${port}...`)
    })
  } catch (error) {
    console.log("Error starting server", error)
  }
}

start()
