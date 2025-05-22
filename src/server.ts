import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import authRoute from "./routes/auth.route"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('API is running...')
})

app.use('/api/v1/auth', authRoute)

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || ''

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => console.error(err))