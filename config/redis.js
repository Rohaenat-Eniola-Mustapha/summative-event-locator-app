// redis.js
const redis = require('redis');

const redisClient = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

redisClient.connect().then(() => {
    console.log("Redis Connected");
}).catch(console.error);

module.exports = redisClient;