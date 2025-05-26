const express = require("express")
const { body } = require("express-validator")
const {
  getAllSupport,
  getSupportById,
  createSupport,
  updateSupport,
  deleteSupport,
  markHelpful,
} = require("../controllers/supportController")
const auth = require("../middleware/auth")
const roleAuth = require("../middleware/roleAuth")

const router = express.Router()

// Public routes
router.get("/", getAllSupport)
router.get("/:id", getSupportById)
router.post("/:id/helpful", markHelpful)

// Admin only routes
router.post(
  "/",
  [
    auth,
    roleAuth(["admin"]),
    body("question").notEmpty().withMessage("Question is required"),
    body("answer").notEmpty().withMessage("Answer is required"),
    body("category").notEmpty().withMessage("Category is required"),
  ],
  createSupport,
)

router.put(
  "/:id",
  [
    auth,
    roleAuth(["admin"]),
    body("question").optional().notEmpty().withMessage("Question cannot be empty"),
    body("answer").optional().notEmpty().withMessage("Answer cannot be empty"),
  ],
  updateSupport,
)

router.delete("/:id", auth, roleAuth(["admin"]), deleteSupport)

module.exports = router
