import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'

import authRoute from "./routes/auth.route"
import userRoute from "./routes/user.route"

dotenv.config()

const app = express()
app.use(cors(
  {
    origin: 'http://localhost:5173',
    credentials: true,
  }
))
app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('API is running...')
})

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/user', userRoute)

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || ''

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => console.error(err))