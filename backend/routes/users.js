const express = require("express")
const { body } = require("express-validator")
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  purchaseGame,
  purchaseMerchandise,
} = require("../controllers/userController")
const auth = require("../middleware/auth")
const roleAuth = require("../middleware/roleAuth")

const router = express.Router()

// Admin only routes
router.get("/", auth, roleAuth(["admin"]), getAllUsers)
router.delete("/:id", auth, roleAuth(["admin"]), deleteUser)

// Authenticated routes
router.get("/:id", auth, getUserById)
router.put(
  "/:id",
  [
    auth,
    body("email").optional().isEmail().withMessage("Please provide a valid email"),
    body("username").optional().isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
  ],
  updateUser,
)

router.post("/purchase/game", auth, purchaseGame)
router.post("/purchase/merchandise", auth, purchaseMerchandise)

module.exports = router
