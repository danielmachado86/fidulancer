import express from "express";
import * as BaseTermController from "../controllers/baseTerms";
import { requiresAuth } from "../middleware/auth";
import validate from "../middleware/validation";
import { BaseTermBaseDocument } from "../models/baseTerm";

const router = express.Router({ mergeParams: true });

router.get("/", BaseTermController.getBaseTerms);
router.get("/:id", BaseTermController.getBaseTermsById);
router.post(
    "/",
    validate(BaseTermBaseDocument),
    requiresAuth,
    BaseTermController.createBaseTerm
);

export default router;
