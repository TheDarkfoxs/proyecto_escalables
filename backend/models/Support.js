const mongoose = require("mongoose")

const supportSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Technical", "Account", "Billing", "Gameplay", "General"],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Support", supportSchema)
