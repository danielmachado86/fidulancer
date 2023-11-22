import express from "express";
import * as FactController from "../controllers/facts";

const router = express.Router({ mergeParams: true });

router.get("/", FactController.getFacts);
router.post("/", FactController.createFact);

export default router;
