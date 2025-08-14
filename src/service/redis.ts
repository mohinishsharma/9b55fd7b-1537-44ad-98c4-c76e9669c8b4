import { Redis } from 'ioredis'
import { loadConfig } from '../config';

let redis: Redis | null = null;

/**
 * Get the Redis client instance.
 * @returns The Redis client instance.
 */
export default function () {
    if (!redis) {
        const config = loadConfig();
        redis = new Redis({
            host: config.REDIS_HOST,
            port: Number(config.REDIS_PORT)
        });
    }
    return redis;
}

