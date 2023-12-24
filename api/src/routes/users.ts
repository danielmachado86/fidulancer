import express from "express";
import * as UserController from "../controllers/users";
import { requiresAuth } from "../middleware/auth";
import validate from "../middleware/validation";
import { User } from "../models/user";

const router = express.Router();

router.get("/", requiresAuth, UserController.getAuthenticatedUser);

router.post("/signup", validate(User), UserController.signUp);

router.post("/login", UserController.login);

router.post("/logout", UserController.logout);

export default router;
