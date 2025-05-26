const Merchandise = require("../models/Merchandise")
const { validationResult } = require("express-validator")

const getAllMerchandise = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query
    const query = { isActive: true }

    if (category) query.category = category
    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    const merchandise = await Merchandise.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await Merchandise.countDocuments(query)

    res.json({
      merchandise,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const getMerchandiseById = async (req, res) => {
  try {
    const merchandise = await Merchandise.findById(req.params.id)

    if (!merchandise || !merchandise.isActive) {
      return res.status(404).json({ message: "Merchandise not found" })
    }

    res.json(merchandise)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const createMerchandise = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const merchandise = new Merchandise(req.body)
    await merchandise.save()

    res.status(201).json({
      message: "Merchandise created successfully",
      merchandise,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const updateMerchandise = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const merchandise = await Merchandise.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!merchandise) {
      return res.status(404).json({ message: "Merchandise not found" })
    }

    res.json({
      message: "Merchandise updated successfully",
      merchandise,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const deleteMerchandise = async (req, res) => {
  try {
    const merchandise = await Merchandise.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })

    if (!merchandise) {
      return res.status(404).json({ message: "Merchandise not found" })
    }

    res.json({ message: "Merchandise deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const getFeaturedMerchandise = async (req, res) => {
  try {
    const merchandise = await Merchandise.find({ featured: true, isActive: true }).limit(6).sort({ createdAt: -1 })

    res.json(merchandise)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = {
  getAllMerchandise,
  getMerchandiseById,
  createMerchandise,
  updateMerchandise,
  deleteMerchandise,
  getFeaturedMerchandise,
}
