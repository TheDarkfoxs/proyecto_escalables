const mongoose = require("mongoose")

const merchandiseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: ["Clothing", "Accessories", "Collectibles", "Gaming Gear", "Art"],
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    sizes: [
      {
        type: String,
        enum: ["XS", "S", "M", "L", "XL", "XXL"],
      },
    ],
    colors: [
      {
        type: String,
      },
    ],
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Merchandise", merchandiseSchema)
