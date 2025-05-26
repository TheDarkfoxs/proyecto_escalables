const mongoose = require("mongoose")

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
      enum: ["Action", "Adventure", "RPG", "Strategy", "Simulation", "Sports", "Racing", "Puzzle", "Horror", "Indie"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    developer: {
      type: String,
      required: true,
      default: "Stuffed Entertainment",
    },
    platform: [
      {
        type: String,
        enum: ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"],
      },
    ],
    rating: {
      type: String,
      enum: ["E", "E10+", "T", "M", "AO"],
      default: "E",
    },
    images: [
      {
        type: String,
      },
    ],
    trailer: {
      type: String,
    },
    systemRequirements: {
      minimum: {
        os: String,
        processor: String,
        memory: String,
        graphics: String,
        storage: String,
      },
      recommended: {
        os: String,
        processor: String,
        memory: String,
        graphics: String,
        storage: String,
      },
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

module.exports = mongoose.model("Game", gameSchema)
