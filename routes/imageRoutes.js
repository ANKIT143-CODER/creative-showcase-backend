import express from 'express'
import multer from 'multer'
import protect from '../middleware/authMiddleware.js'
import Image from '../models/Image.js'
import {
  uploadImage,
  getMyImages,
  deleteImage,
} from '../controllers/imageController.js'

const router = express.Router()

// ================= MULTER CONFIG =================
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const upload = multer({ storage })

// ================= ROUTES =================

// 🌍 PUBLIC: Get ALL images (Landing Page)
router.get('/', async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 })
    res.json(images)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch images' })
  }
})

// 🔐 PRIVATE: Upload image
router.post(
  '/upload',
  protect,
  upload.single('image'),
  uploadImage
)

// 🔐 PRIVATE: Get logged-in user's images (Dashboard)
router.get('/my-images', protect, getMyImages)
router.delete('/:id', protect, deleteImage)

export default router
