import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

const validate = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    message: "Validation error",
                    errors: error.errors,
                });
            } else {
                next(error);
            }
        }
    };
};

export default validate;
