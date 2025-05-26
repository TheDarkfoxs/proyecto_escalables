const express = require("express")
const { body } = require("express-validator")
const {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  getFeaturedGames,
} = require("../controllers/gameController")
const auth = require("../middleware/auth")
const roleAuth = require("../middleware/roleAuth")
const { uploadMultiple } = require("../middleware/upload")

const router = express.Router()

// Public routes
router.get("/", getAllGames)
router.get("/featured", getFeaturedGames)
router.get("/:id", getGameById)

// Admin only routes
router.post(
  "/",
  [
    auth,
    roleAuth(["admin"]),
    uploadMultiple, // Middleware para manejar imágenes
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("genre").notEmpty().withMessage("Genre is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
    body("releaseDate").isISO8601().withMessage("Valid release date is required"),
  ],
  createGame,
)

router.put(
  "/:id",
  [
    auth,
    roleAuth(["admin"]),
    uploadMultiple, // Middleware para manejar imágenes
    body("title").optional().notEmpty().withMessage("Title cannot be empty"),
    body("description").optional().notEmpty().withMessage("Description cannot be empty"),
    body("price").optional().isNumeric().withMessage("Price must be a number"),
  ],
  updateGame,
)

router.delete("/:id", auth, roleAuth(["admin"]), deleteGame)

module.exports = router
