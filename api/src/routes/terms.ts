import express from "express";
import * as TermController from "../controllers/terms";
import { requiresAuth } from "../middleware/auth";
import validate from "../middleware/validation";
import { TermBaseDocument } from "../models/term";

const router = express.Router();

router.get("/", requiresAuth, TermController.getTerms);
router.post(
    "/",
    validate(TermBaseDocument),
    requiresAuth,
    TermController.createTerm
);

export default router;
