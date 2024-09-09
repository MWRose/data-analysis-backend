import express, { Request, Response, NextFunction } from "express";
import { getMongoHealthcheck } from "../data/mongo/mongo";
import { getRedisHealthcheck } from "../data/redis/redis";

const router = express.Router();

router.get("/healthcheck", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let mongoHealthcheck;
    let redisHealthcheck;
    try {
        mongoHealthcheck = await getMongoHealthcheck();
        redisHealthcheck = await getRedisHealthcheck();
    } catch (e) {
        console.log('Healthcheck error', e)
    }

    const healthcheck = {
        name: 'express-backend',
        status: mongoHealthcheck?.status === "OK" && redisHealthcheck?.status === "OK" ? "OK": "ERROR",
        uptime: process.uptime(),
        timestamp: Date.now(),
        dependencies: [
            {mongo: mongoHealthcheck ?? {status: "ERROR"}},
            {redis: redisHealthcheck ?? {status: "ERROR"}}
        ]
    };
    try {
        res.send(healthcheck);
    } catch (error: any) {
        healthcheck.status = error;
        res.status(503).send();
        next(error)
    }
});

export default router;