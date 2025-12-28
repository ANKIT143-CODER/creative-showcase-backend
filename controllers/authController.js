import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// 🔐 Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

// 📝 REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Check if user exists
    const userExists = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (userExists) {
      return res.status(400).json({
        message: 'User already exists',
      })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    })

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token: generateToken(user._id),
    })
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' })
  }
}

// 🔑 LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token: generateToken(user._id),
    })
  } catch (error) {
    res.status(500).json({ message: 'Login failed' })
  }
}
