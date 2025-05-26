const express = require("express")
const { body } = require("express-validator")
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
} = require("../controllers/postController")
const auth = require("../middleware/auth")

const router = express.Router()

// Public routes
router.get("/", getAllPosts)
router.get("/:id", getPostById)

// Authenticated routes
router.post(
  "/",
  [
    auth,
    body("title").notEmpty().withMessage("Title is required"),
    body("content").notEmpty().withMessage("Content is required"),
    body("category").notEmpty().withMessage("Category is required"),
  ],
  createPost,
)

router.put(
  "/:id",
  [
    auth,
    body("title").optional().notEmpty().withMessage("Title cannot be empty"),
    body("content").optional().notEmpty().withMessage("Content cannot be empty"),
  ],
  updatePost,
)

router.delete("/:id", auth, deletePost)
router.post("/:id/like", auth, likePost)
router.post("/:id/comment", auth, addComment)

module.exports = router
