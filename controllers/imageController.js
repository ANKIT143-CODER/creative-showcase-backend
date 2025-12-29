import Image from '../models/Image.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 📤 Upload Image
export const uploadImage = async (req, res) => {
  try {
    const image = await Image.create({
      title: req.body.title,
      imageUrl: `/uploads/${req.file.filename}`,
      user: req.user._id,
    })

    res.status(201).json(image)
  } catch (error) {
    res.status(500).json({ message: 'Image upload failed' })
  }
}

// 📥 Get logged-in user's images
export const getMyImages = async (req, res) => {
  try {
    const images = await Image.find({ user: req.user._id }).sort({
      createdAt: -1,
    })
    res.json(images)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch images' })
  }
}

// 🗑 Delete image (OWNER ONLY)
export const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id)

    if (!image) {
      return res.status(404).json({ message: 'Image not found' })
    }

    // Ownership check
    if (image.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    // Delete file from uploads folder
    const filePath = path.join(__dirname, '..', image.imageUrl)

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    // Delete from database
    await image.deleteOne()

    res.json({ message: 'Image deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete image' })
  }
}
