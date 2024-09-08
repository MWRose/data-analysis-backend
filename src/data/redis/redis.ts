import { createClient, RedisClientType } from "redis";
import { ENVVARS } from "../../util/envvars";

const getRedisClientPromise = () => {
    const redisUri = `redis://${ENVVARS.REDIS_URL}:6379/`;
    const redisClient: RedisClientType = createClient({ url: redisUri });
    return redisClient.connect();
}

export const redisClientPromise = getRedisClientPromise();

export async function getRedisHealthcheck() {
    try {
        const redisClient = await redisClientPromise;
        const ping = await redisClient.PING();
        return {status: ping === "PONG" ? "OK": "ERROR"};
    } catch (e) {
        return {status: "ERROR", error: e};
    }
}