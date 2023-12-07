import express from "express";
import * as BaseTermController from "../controllers/baseTerms";

const router = express.Router({ mergeParams: true });

router.get("/", BaseTermController.getBaseTerms);
router.get("/:id", BaseTermController.getBaseTermsById);
router.post("/", BaseTermController.createBaseTerm);

export default router;
