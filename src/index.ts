import express, { Request, Response, NextFunction } from "express";
import riotRouter from "./routes/riotRoute";
import privateRouter from "./routes/private"
import { ENVVARS } from "./util/envvars";

const app = express();

app.get("/", (req: Request, res: Response, next: NextFunction): void => {
    try {
        res.send("OK");
    } catch (error) {
        next(error);
    }
})

app.use('/riot', riotRouter);
app.use('/private', privateRouter);

const PORT = ENVVARS.PORT;

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})