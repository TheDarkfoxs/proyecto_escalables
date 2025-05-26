const Game = require("../models/Game")
const { validationResult } = require("express-validator")
const fs = require("fs")
const path = require("path")

const getAllGames = async (req, res) => {
  try {
    const { page = 1, limit = 10, genre, platform, search } = req.query
    const query = { isActive: true }

    if (genre) query.genre = genre
    if (platform) query.platform = { $in: [platform] }
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    const games = await Game.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await Game.countDocuments(query)

    res.json({
      games,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)

    if (!game || !game.isActive) {
      return res.status(404).json({ message: "Game not found" })
    }

    res.json(game)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const createGame = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // Procesar imágenes subidas
    const images = []
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        // Guardar la ruta relativa para servir las imágenes
        images.push(`/uploads/${path.relative("uploads", file.path)}`)
      })
    }

    const gameData = {
      ...req.body,
      images: images,
    }

    // Convertir platform de string a array si es necesario
    if (typeof gameData.platform === "string") {
      gameData.platform = [gameData.platform]
    }

    const game = new Game(gameData)
    await game.save()

    res.status(201).json({
      message: "Game created successfully",
      game,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const updateGame = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const game = await Game.findById(req.params.id)
    if (!game) {
      return res.status(404).json({ message: "Game not found" })
    }

    // Procesar nuevas imágenes si se subieron
    const updateData = { ...req.body }
    if (req.files && req.files.length > 0) {
      const newImages = []
      req.files.forEach((file) => {
        newImages.push(`/uploads/${path.relative("uploads", file.path)}`)
      })

      // Agregar nuevas imágenes a las existentes o reemplazar
      updateData.images = [...(game.images || []), ...newImages]
    }

    const updatedGame = await Game.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })

    res.json({
      message: "Game updated successfully",
      game: updatedGame,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const deleteGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })

    if (!game) {
      return res.status(404).json({ message: "Game not found" })
    }

    res.json({ message: "Game deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const getFeaturedGames = async (req, res) => {
  try {
    const games = await Game.find({ featured: true, isActive: true }).limit(6).sort({ createdAt: -1 })

    res.json(games)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  getFeaturedGames,
}
