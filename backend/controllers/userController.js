const User = require("../models/User")
const Game = require("../models/Game")
const Merchandise = require("../models/Merchandise")
const { validationResult } = require("express-validator")

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query
    const query = {}

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ]
    }

    const users = await User.find(query)
      .select("-password")
      .populate({
        path: "purchasedGames",
        select: "title price",
      })
      .populate({
        path: "purchasedMerchandise",
        select: "name price",
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await User.countDocuments(query)

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate({
        path: "purchasedGames",
        select: "title description price genre images platform rating",
      })
      .populate({
        path: "purchasedMerchandise",
        select: "name description price category images stock",
      })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // Check if user is updating their own profile or is admin
    if (req.params.id !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" })
    }

    const { password, ...updateData } = req.body

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).select(
      "-password",
    )

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({
      message: "User updated successfully",
      user,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({ message: "User deactivated successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const purchaseGame = async (req, res) => {
  try {
    const { gameId } = req.body

    const game = await Game.findById(gameId)
    if (!game || !game.isActive) {
      return res.status(404).json({ message: "Game not found" })
    }

    const user = await User.findById(req.user._id)

    if (user.purchasedGames.includes(gameId)) {
      return res.status(400).json({ message: "Game already purchased" })
    }

    user.purchasedGames.push(gameId)
    await user.save()

    res.json({
      message: "Game purchased successfully",
      game: {
        _id: game._id,
        title: game.title,
        price: game.price,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const purchaseMerchandise = async (req, res) => {
  try {
    const { merchandiseId, quantity = 1 } = req.body

    const merchandise = await Merchandise.findById(merchandiseId)
    if (!merchandise || !merchandise.isActive) {
      return res.status(404).json({ message: "Merchandise not found" })
    }

    if (merchandise.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" })
    }

    const user = await User.findById(req.user._id)
    user.purchasedMerchandise.push(merchandiseId)
    await user.save()

    // Update stock
    merchandise.stock -= quantity
    await merchandise.save()

    res.json({
      message: "Merchandise purchased successfully",
      merchandise: {
        _id: merchandise._id,
        name: merchandise.name,
        price: merchandise.price,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  purchaseGame,
  purchaseMerchandise,
}
