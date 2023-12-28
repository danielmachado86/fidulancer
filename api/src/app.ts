import MongoStore from "connect-mongo";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import createHttpError, { isHttpError } from "http-errors";
import morgan from "morgan";

import contractsRoutes from "./routes/contracts";
import partiesRoutes from "./routes/parties";
import usersRoutes from "./routes/users";

import env from "./util/validateEnv";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use(
    session({
        secret: env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60 * 60 * 1000,
        },
        rolling: true,
        store: MongoStore.create({
            mongoUrl: env.MONGO_CONNECTION_STRING,
        }),
    })
);

app.use("/api/contracts", contractsRoutes);
// app.use("/api/contracts/:contractId/facts", factsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/parties", partiesRoutes);
// app.use("/api/baseTerms", baseTermsRoutes);

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found."));
});

app.use(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (error: unknown, req: Request, res: Response, next: NextFunction) => {
        console.error(error);
        let errorMessage = "An unknown error ocurred";
        let statusCode = 500;
        if (isHttpError(error)) {
            statusCode = error.status;
            errorMessage = error.message;
        }
        res.status(statusCode).json({ error: errorMessage });
    }
);

export default app;
