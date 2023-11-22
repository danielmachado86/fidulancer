import express from "express";
import * as ContractController from "../controllers/contracts";
import { requiresAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", requiresAuth, ContractController.getContracts);
router.get("/:contractId", requiresAuth, ContractController.getContract);
router.post("/", requiresAuth, ContractController.createContract);

export default router;
