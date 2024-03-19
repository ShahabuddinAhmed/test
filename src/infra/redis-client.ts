import { createClient, RedisClientType } from "redis";
import config from "../config/config";

export class Redis {
    redisClient: RedisClientType;
    constructor(redisClient: RedisClientType) {
        this.redisClient = redisClient;
    }
}

export const newRedis = async (redisClient: RedisClientType): Promise<Redis> => {
    return new Redis(redisClient);
};

export const newRedisClient = async () => {
    try {
        const redisClient = createClient({
            url: config.REDIS_URL,
        });

        redisClient.on("error", (error) => console.error(`Error : ${error}`));
        redisClient.on("connect", () => console.log("Redis client connected"));

        if (!redisClient.isReady) {
			await redisClient.connect();
		}

        return redisClient;
    } catch (err) {
        console.log("Failed to connect the Redis Server");
        console.log(err);
        process.exit(1);
        return;
    }
};