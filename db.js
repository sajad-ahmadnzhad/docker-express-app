const { Pool } = require('pg')

const pool = new Pool({
    database: process.env.DB_NAME || "postgres",
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD
})

pool.on('connect', () => {
    console.log('DB connected successfully')
})

pool.on('error', (err) => {
    console.error(`DB connection error: ${err}`)
    process.exit(1)
})

module.exports = pool