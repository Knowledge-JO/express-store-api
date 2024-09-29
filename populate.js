import dotenv from "dotenv"
import connectDB from "./db/connect.js"
import Product from "./models/product.js"
import products from "./products.json" with {type: "json"} 
dotenv.config()

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    console.log("Connected to DB")
    await Product.deleteMany()
    await Product.create(products)
    console.log("All products added")
  } catch (error) {
    console.log(error)
  }
}

start()
