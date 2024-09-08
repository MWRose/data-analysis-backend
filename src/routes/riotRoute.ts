import express, { Request, Response, NextFunction } from "express";
import { getAccount, getMatch, getMatches, getRelevantMatchData, updateMatchData } from "../api/riotApi";
import { ENVVARS } from "../util/envvars";

const router = express.Router();

router.get("/getriotaccount", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const account = await getAccount(ENVVARS.RIOT_PUUID ?? "");
    try {
        res.send(account);
    } catch (e: any) {
        res.status(503).send();
        next(e);
    }
});

router.get("/getriotmatches", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const account = await getMatches(ENVVARS.RIOT_PUUID ?? "");
    try {
        res.send(account);
    } catch (e: any) {
        res.status(503).send();
        next(e);
    }
});

router.get("/getriotmatch/:matchId", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const matchId = req.params.matchId;
        const account = await getMatch(matchId);
        res.send(account);
    } catch (e: any) {
        res.status(503).send();
        next(e)
    }
});

router.get("/getmatchdata", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const matchResults = await getRelevantMatchData(ENVVARS.RIOT_PUUID ?? '', 5);
    try {
        res.send(matchResults);
    } catch (e: any) {
        res.status(503).send();
        next(e);
    }
});

router.get("/updateMatchData", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const matchResults = await updateMatchData(ENVVARS.RIOT_PUUID ?? '', 10);
    try {
        res.send(matchResults);
    } catch (e: any) {
        res.status(503).send();
        next(e);
    }
});

export default router;