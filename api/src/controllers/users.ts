import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import { LoginSchema, UserDocument, UserWithId, Users } from "../models/user";
import { assertIsDefined } from "../util/assertIsDefined";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const user = await Users.findOne({
            _id: new ObjectId(req.session.userId),
        });
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const signUp: RequestHandler<
    unknown,
    UserWithId,
    UserDocument,
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

        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hashSync(req.body.password, salt);

        const newUser = await Users.insertOne(req.body);

        req.session.userId = newUser.insertedId;

        res.status(201).json({
            _id: newUser.insertedId,
            ...req.body,
        });
    } catch (error) {
        next(error);
    }
};

export const login: RequestHandler<
    unknown,
    unknown,
    LoginSchema,
    unknown
> = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await Users.findOne({ email: email });

        if (!user) {
            throw createHttpError(401, "Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw createHttpError(401, "Invalid credentials");
        }

        req.session.userId = user._id;
        res.status(201).json(user);
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
