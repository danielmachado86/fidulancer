import { RequestHandler } from "express";
import createHttpError from "http-errors";

export const requiresAuth: RequestHandler<
    unknown,
    unknown,
    unknown,
    unknown
> = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        next(createHttpError(401, "User not authenticated"));
    }
};
