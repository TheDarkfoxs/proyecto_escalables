const express = require("express")
const { body } = require("express-validator")
const {
  getAllMerchandise,
  getMerchandiseById,
  createMerchandise,
  updateMerchandise,
  deleteMerchandise,
  getFeaturedMerchandise,
} = require("../controllers/merchandiseController")
const auth = require("../middleware/auth")
const roleAuth = require("../middleware/roleAuth")

const router = express.Router()

// Public routes
router.get("/", getAllMerchandise)
router.get("/featured", getFeaturedMerchandise)
router.get("/:id", getMerchandiseById)

// Admin only routes
router.post(
  "/",
  [
    auth,
    roleAuth(["admin"]),
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
    body("category").notEmpty().withMessage("Category is required"),
    body("stock").isNumeric().withMessage("Stock must be a number"),
  ],
  createMerchandise,
)

router.put(
  "/:id",
  [
    auth,
    roleAuth(["admin"]),
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("price").optional().isNumeric().withMessage("Price must be a number"),
    body("stock").optional().isNumeric().withMessage("Stock must be a number"),
  ],
  updateMerchandise,
)

router.delete("/:id", auth, roleAuth(["admin"]), deleteMerchandise)

module.exports = router
