const redisClient = require('./config/redis');

redisClient.subscribe('user:created', 'user:updated', 'user:deleted');

redisClient.on('message', (channel, message) => {
    const userData = JSON.parse(message);
    switch (channel) {
        case 'user:created':
            console.log(`New user created: ${userData.username} (ID: ${userData.userId})`);
            // Add notification logic here (e.g., send email).
            break;
        case 'user:updated':
            console.log(`User updated: ${userData.username} (ID: ${userData.userId})`);
            // Add notification logic here (e.g., send email).
            break;
        case 'user:deleted':
            console.log(`User deleted: (ID: ${userData.userId})`);
            // Add notification logic here (e.g., logging).
            break;
        default:
            console.log(`Unknown channel: ${channel}`);
    }
});