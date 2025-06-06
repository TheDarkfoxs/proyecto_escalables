const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://localhost:27017/stuffed_entertainment", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error("Database connection error:", error)
    process.exit(1)
  }
}

module.exports = connectDB
