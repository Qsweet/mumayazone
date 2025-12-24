
import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(redisUrl);

redis.on('error', (err) => {
    // console.error('Redis Error:', err);
    // Don't crash in dev if redis missing, but in prod log it.
});
