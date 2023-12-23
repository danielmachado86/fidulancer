import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel, { UserInput } from "../models/user";
import { assertIsDefined } from "../util/assertIsDefined";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const user = await UserModel.findById(req.session.userId)
            .select("+email")
            .exec();
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const signUp: RequestHandler<
    unknown,
    unknown,
    UserInput,
    unknown
> = async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    try {
        // if (!username || !email || !password) {
        //     throw createHttpError(400, "Parameters missing");
        // }

        const existingUsername = await UserModel.findOne({
            username: username,
        }).exec();

        if (existingUsername) {
            throw createHttpError(
                409,
                "Username already taken. Please choose a different one or log in instead."
            );
        }

        const existingEmail = await UserModel.findOne({ email: email }).exec();

        if (existingEmail) {
            throw createHttpError(
                409,
                "A user with this email address already exists. Please log in instead."
            );
        }

        const newUser = new UserModel({
            username: username,
            email: email,
            password: password,
        });

        await newUser.save();

        req.session.userId = newUser._id;

        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

interface LoginBody {
    username?: string;
    password?: string;
}

export const login: RequestHandler<
    unknown,
    unknown,
    LoginBody,
    unknown
> = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        if (!username || !password) {
            throw createHttpError(400, "Parameters missing");
        }

        const user = await UserModel.findOne({ username: username })
            .select("+password +email")
            .exec();

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
