const express = require("express")
const { body } = require("express-validator")
const { register, login, getProfile } = require("../controllers/authController")
const auth = require("../middleware/auth")

const router = express.Router()

// Register
router.post(
  "/register",
  [
    body("username").isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
  ],
  register,
)

// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login,
)

// Get profile
router.get("/profile", auth, getProfile)

module.exports = router
