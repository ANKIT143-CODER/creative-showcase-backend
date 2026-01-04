import Image from '../models/Image.js'
import cloudinary from '../config/cloudinary.js'

// 📤 Upload Image (Cloudinary)
export const uploadImage = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'creative_showcase',
    })

    const image = await Image.create({
      title: req.body.title,
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
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

// 🗑 Delete image (Cloudinary + DB)
export const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id)

    if (!image) {
      return res.status(404).json({ message: 'Image not found' })
    }

    if (image.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.cloudinaryId)

    // Delete from DB
    await image.deleteOne()

    res.json({ message: 'Image deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete image' })
  }
}
