const { Redis } = require("ioredis")

const redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT || 6379)
});

redis.on('connect', () => {
    console.log(`Redis connected successfully`)
})

redis.on('error', (err) => {
    console.error(`Redis connection error: ${err}`)
    process.exit(1)
})

module.exports = {
    redis
}