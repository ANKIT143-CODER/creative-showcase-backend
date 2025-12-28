import Image from '../models/Image.js'

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

// 🌍 Get public user's images
export const getUserImages = async (req, res) => {
  try {
    const images = await Image.find({ user: req.params.userId }).sort({
      createdAt: -1,
    })

    res.json(images)
  } catch (error) {
    res.status(404).json({ message: 'User images not found' })
  }
}
