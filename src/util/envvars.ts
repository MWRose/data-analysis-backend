interface EnvarsT {
    PORT?: string;
    MONGO_URL?: string;
    REDIS_URL?: string;
    RIOT_PUUID?: string;
    RIOT_API_KEY?: string;
}

export const ENVVARS: EnvarsT = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    REDIS_URL: process.env.REDIS_URL,
    RIOT_PUUID: process.env.RIOT_PUUID,
    RIOT_API_KEY: process.env.RIOT_API_KEY,
}