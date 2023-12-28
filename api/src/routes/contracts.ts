import express from "express";
import * as ContractController from "../controllers/contracts";
import { requiresAuth } from "../middleware/auth";
import validate from "../middleware/validation";
import { ContractBaseDocument } from "../models/contract";

const router = express.Router();

router.get("/", requiresAuth, ContractController.getContracts);
router.get("/:contractId", requiresAuth, ContractController.getContract);
router.post(
    "/",
    validate(ContractBaseDocument),
    requiresAuth,
    ContractController.createContract
);
router.patch("/:contractId", requiresAuth, ContractController.updateContract);
router.delete("/:contractId", requiresAuth, ContractController.deleteContract);

export default router;
