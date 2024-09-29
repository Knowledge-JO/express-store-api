import Product from "../models/product.js"

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({ price: { $gt: 30 } })
    .sort("price")
    .select("name price rating")
  res.status(200).json({ products, nbHits: products.length })
}

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query
  const queryObject = {}

  if (featured) {
    queryObject.featured = featured === "true" ? true : false
  }

  if (company) {
    queryObject.company = company
  }

  if (name) {
    queryObject.name = { $regex: name, $options: "i" }
  }

  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    }
    const regEx = /\b(<|>|>=|=|<=)/
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    )

    const options = ["price", "rating"]

    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-")

      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) }
      }
    })
  }

  let result = Product.find(queryObject)
  if (sort) {
    const sortList = sort.split(",").join(" ")
    result = result.sort(sortList)
  } else {
    result = result.sort("createdAt")
  }

  if (fields) {
    const fieldsList = sort.split(",").join(" ")
    console.log(fieldsList)
    result = result.select(fieldsList)
  }

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10

  const skip = (page - 1) * limit

  result = result.skip(skip).limit(limit)

  const products = await result
  res.status(200).json({ products, nbhits: products.length })
}

export { getAllProductsStatic, getAllProducts }
