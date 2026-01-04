import express from 'express'
import multer from 'multer'
import protect from '../middleware/authMiddleware.js'
import {
  uploadImage,
  getMyImages,
  deleteImage,
} from '../controllers/imageController.js'
import Image from '../models/Image.js'

const router = express.Router()

// ================= MULTER (TEMP STORAGE) =================
// Files are stored temporarily in /temp and sent to Cloudinary
const upload = multer({ dest: 'temp/' })

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

// 🔐 PRIVATE: Upload image (Cloudinary)
router.post(
  '/upload',
  protect,
  upload.single('image'),
  uploadImage
)

// 🔐 PRIVATE: Get logged-in user's images (Dashboard)
router.get('/my-images', protect, getMyImages)

// 🔐 PRIVATE: Delete image (Cloudinary + DB)
router.delete('/:id', protect, deleteImage)

export default router
