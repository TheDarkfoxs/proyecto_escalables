const multer = require("multer")
const path = require("path")
const fs = require("fs")

// Crear directorio de uploads si no existe
const uploadDir = "uploads"
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "uploads/"

    // Crear subdirectorios según el tipo
    if (req.baseUrl.includes("games")) {
      uploadPath += "games/"
    } else if (req.baseUrl.includes("merchandise")) {
      uploadPath += "merchandise/"
    } else if (req.baseUrl.includes("posts")) {
      uploadPath += "posts/"
    } else {
      uploadPath += "general/"
    }

    // Crear directorio si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }

    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    // Generar nombre único
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

// Filtro de archivos
const fileFilter = (req, file, cb) => {
  // Permitir solo imágenes
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new Error("Solo se permiten archivos de imagen"), false)
  }
}

// Configuración de multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
})

module.exports = {
  uploadSingle: upload.single("image"),
  uploadMultiple: upload.array("images", 5), // Máximo 5 imágenes
  uploadFields: upload.fields([
    { name: "images", maxCount: 5 },
    { name: "thumbnail", maxCount: 1 },
  ]),
}
