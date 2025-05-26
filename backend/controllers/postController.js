const Post = require("../models/Post")
const { validationResult } = require("express-validator")

const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query
    const query = { isPublished: true }

    if (category) query.category = category
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { content: { $regex: search, $options: "i" } }]
    }

    const posts = await Post.find(query)
      .populate("author", "username firstName lastName avatar")
      .populate("comments.user", "username avatar")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await Post.countDocuments(query)

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username firstName lastName avatar")
      .populate("comments.user", "username avatar")

    if (!post || !post.isPublished) {
      return res.status(404).json({ message: "Post not found" })
    }

    res.json(post)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const createPost = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const post = new Post({
      ...req.body,
      author: req.user._id,
    })

    await post.save()
    await post.populate("author", "username firstName lastName avatar")

    res.status(201).json({
      message: "Post created successfully",
      post,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const updatePost = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    // Check if user is author or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" })
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("author", "username firstName lastName avatar")

    res.json({
      message: "Post updated successfully",
      post: updatedPost,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    // Check if user is author or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" })
    }

    await Post.findByIdAndDelete(req.params.id)

    res.json({ message: "Post deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    const likeIndex = post.likes.indexOf(req.user._id)

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1)
    } else {
      // Like
      post.likes.push(req.user._id)
    }

    await post.save()

    res.json({
      message: "Post like status updated",
      likes: post.likes.length,
      isLiked: post.likes.includes(req.user._id),
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const addComment = async (req, res) => {
  try {
    const { content } = req.body

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Comment content is required" })
    }

    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    const comment = {
      user: req.user._id,
      content: content.trim(),
    }

    post.comments.push(comment)
    await post.save()

    await post.populate("comments.user", "username avatar")

    res.status(201).json({
      message: "Comment added successfully",
      comment: post.comments[post.comments.length - 1],
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
}
