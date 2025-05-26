const Support = require("../models/Support")
const { validationResult } = require("express-validator")

const getAllSupport = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query
    const query = { isActive: true }

    if (category) query.category = category
    if (search) {
      query.$or = [{ question: { $regex: search, $options: "i" } }, { answer: { $regex: search, $options: "i" } }]
    }

    const supportItems = await Support.find(query)
      .populate("createdBy", "username")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ helpfulCount: -1, createdAt: -1 })

    const total = await Support.countDocuments(query)

    res.json({
      supportItems,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const getSupportById = async (req, res) => {
  try {
    const supportItem = await Support.findById(req.params.id).populate("createdBy", "username")

    if (!supportItem || !supportItem.isActive) {
      return res.status(404).json({ message: "Support item not found" })
    }

    res.json(supportItem)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const createSupport = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const supportItem = new Support({
      ...req.body,
      createdBy: req.user._id,
    })

    await supportItem.save()
    await supportItem.populate("createdBy", "username")

    res.status(201).json({
      message: "Support item created successfully",
      supportItem,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const updateSupport = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const supportItem = await Support.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "username")

    if (!supportItem) {
      return res.status(404).json({ message: "Support item not found" })
    }

    res.json({
      message: "Support item updated successfully",
      supportItem,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const deleteSupport = async (req, res) => {
  try {
    const supportItem = await Support.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })

    if (!supportItem) {
      return res.status(404).json({ message: "Support item not found" })
    }

    res.json({ message: "Support item deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const markHelpful = async (req, res) => {
  try {
    const supportItem = await Support.findByIdAndUpdate(req.params.id, { $inc: { helpfulCount: 1 } }, { new: true })

    if (!supportItem) {
      return res.status(404).json({ message: "Support item not found" })
    }

    res.json({
      message: "Marked as helpful",
      helpfulCount: supportItem.helpfulCount,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = {
  getAllSupport,
  getSupportById,
  createSupport,
  updateSupport,
  deleteSupport,
  markHelpful,
}
