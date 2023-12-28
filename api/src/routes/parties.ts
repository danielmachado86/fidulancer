import express from "express";
import * as PartyController from "../controllers/parties";
import { requiresAuth } from "../middleware/auth";
import validate from "../middleware/validation";
import { PartyBaseDocument } from "../models/party";

const router = express.Router();

router.get("/", requiresAuth, PartyController.getParties);
router.get("/:partyId", requiresAuth, PartyController.getParty);
router.post(
    "/",
    requiresAuth,
    validate(PartyBaseDocument),
    PartyController.createParty
);
// router.patch("/:partyd", requiresAuth, PartyController.updateContract);
// router.delete("/:partyd", requiresAuth, PartyController.deleteContract);

export default router;
