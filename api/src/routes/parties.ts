import express from "express";
import * as PartyController from "../controllers/parties";
import { requiresAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", requiresAuth, PartyController.getParties);
router.get("/:partyId", requiresAuth, PartyController.getParty);
router.post("/", requiresAuth, PartyController.createParty);
// router.patch("/:partyd", requiresAuth, PartyController.updateContract);
// router.delete("/:partyd", requiresAuth, PartyController.deleteContract);

export default router;
