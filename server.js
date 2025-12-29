import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

// Routes
import authRoutes from './routes/authRoutes.js'
import imageRoutes from './routes/imageRoutes.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config()

const app = express()

// ================= FIX __dirname FOR ES MODULE =================
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ================= CREATE UPLOADS FOLDER (IMPORTANT FIX) =================
const uploadsPath = path.join(__dirname, 'uploads')

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath)
  console.log('📁 uploads folder created')
}

// ================= MIDDLEWARE =================
app.use(cors())
app.use(express.json())

// ================= STATIC FILES =================
app.use('/uploads', express.static(uploadsPath))

// ================= ROUTES =================
app.get('/', (req, res) => {
  res.send('API running...')
})

app.use('/api/auth', authRoutes)
app.use('/api/images', imageRoutes)
app.use('/api/users', userRoutes)

// ================= MONGODB CONNECTION =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully')
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err)
  })

// ================= SERVER =================
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
