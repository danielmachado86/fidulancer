import express from "express";
import * as UserController from "../controllers/users";
import { requiresAuth } from "../middleware/auth";
import validate from "../middleware/validation";
import { LoginSchema, UserBaseDocument } from "../models/user";

const router = express.Router();

router.get("/", requiresAuth, UserController.getAuthenticatedUser);

router.post("/signup", validate(UserBaseDocument), UserController.signUp);

router.post("/login", validate(LoginSchema), UserController.login);

router.post("/logout", requiresAuth, UserController.logout);

export default router;
