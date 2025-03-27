const redis = require('redis');

const redisClient = redis.createClient({
    host: '127.0.0.1', // Redis server host (localhost)
    port: 6379, // Redis server port
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});

module.exports = redisClient;