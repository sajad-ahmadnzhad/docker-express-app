const express = require('express')
const { config } = require('dotenv')
const { v7: uuidV7 } = require('uuid')
config()
const { redis } = require('./redisConfig')
const pool = require("./db")

const app = express()

app.use(express.json())

const { PORT = 3000 } = process.env

app.get("/set-data", async (req, res) => {
    const { key = uuidV7(), value } = req.query

    if (!value?.trim()) {
        return res.status(400).json({ message: "value is required" })
    }

    await redis.set(key, value)

    res.json({ message: "data set successfully", key, value })
})

app.get("/get-data", async (req, res) => {
    const { key } = req.query

    if (!key?.trim()) {
        return res.status(400).json({ message: "key is required" })
    }

    const data = await redis.get(key)

    if (!data) {
        return res.status(404).json({ message: "data not found with this key" })
    }

    res.json({ data })
})

app.get("/setup", async (req, res) => {
    try {
        await pool.query('CREATE TABLE IF NOT EXISTS schools(id SERIAL PRIMARY KEY , name VARCHAR , address VARCHAR)')
        res.json({ message: "Setup success" })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error !!', error })
    }
})

app.post('/school', async (req, res) => {
    const { name, location } = req.body

    try {
        await pool.query('INSERT INTO schools(name , address) VALUES ($1 , $2)', [name, location])
        res.json({ message: "added child success" })
    } catch (error) {
        res.json({ message: "Internal server error", error })
    }

})

app.get('/school', async (req, res) => {
    try {
        const data = await pool.query("SELECT * FROM schools")
        res.json({ children: data.rows })
    } catch (error) {
        res.json({ message: "Internal server error", error })

    }
})

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})