import express from "express";
import * as UserController from "../controllers/users";
import { requiresAuth } from "../middleware/auth";
import validate from "../middleware/validation";
import { UserDocument } from "../models/user";

const router = express.Router();

router.get("/", requiresAuth, UserController.getAuthenticatedUser);

router.post("/signup", validate(UserDocument), UserController.signUp);

router.post("/login", UserController.login);

router.post("/logout", UserController.logout);

export default router;
