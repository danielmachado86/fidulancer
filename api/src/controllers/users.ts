import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import { LoginSchema, UserBaseDocument, Users } from "../models/user";
import { assertIsDefined } from "../util/assertIsDefined";

export const getAuthenticatedUser: RequestHandler<
    unknown,
    Omit<UserBaseDocument, "password">,
    unknown,
    unknown
> = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const user = await Users.findOne({
            _id: new ObjectId(req.session.userId),
        });
        if (!user) {
            throw createHttpError(404, "User not found");
        }
        // Remove password field from the response
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user;

        res.status(200).json(userWithoutPassword);
    } catch (error) {
        next(error);
    }
};

export const signUp: RequestHandler<
    unknown,
    Omit<UserBaseDocument, "password">,
    UserBaseDocument,
    unknown
> = async (req, res, next) => {
    try {
        const existingEmail = await Users.findOne({ email: req.body.email });

        if (existingEmail) {
            throw createHttpError(
                409,
                "A user with this email address already exists. Please log in instead."
            );
        }

        // Remove password field from the response
        const { password, ...userWithoutPassword } = req.body;

        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hashSync(password, salt);

        const newUser = await Users.insertOne(req.body);

        req.session.userId = newUser.insertedId.toString();

        return res.status(201).json({
            ...userWithoutPassword,
        });
    } catch (error) {
        next(error);
    }
};

export const login: RequestHandler<
    unknown,
    Omit<UserBaseDocument, "password">,
    LoginSchema,
    unknown
> = async (req, res, next) => {
    try {
        const user = await Users.findOne({ email: req.body.email });

        if (!user) {
            throw createHttpError(401, "Invalid credentials");
        }

        // Remove password field from the response
        const { password, ...userWithoutPassword } = user;

        const passwordMatch = await bcrypt.compare(req.body.password, password);

        if (!passwordMatch) {
            throw createHttpError(401, "Invalid credentials");
        }

        req.session.userId = user._id.toString();
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        next(error);
    }
};

export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy((error) => {
        if (error) {
            next(error);
        } else {
            res.sendStatus(200);
        }
    });
};
