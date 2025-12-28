import express from 'express'
import User from '../models/User.js'
import Image from '../models/Image.js'

const router = express.Router()

// 🌍 Public user images by username
router.get('/:username/images', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const images = await Image.find({ user: user._id }).sort({
      createdAt: -1,
    })

    res.json(images)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
