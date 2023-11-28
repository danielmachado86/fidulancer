import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import PartyModel from "../models/party";
import { assertIsDefined } from "../util/assertIsDefined";

export const getParties: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const parties = await PartyModel.find({
            $or: [
                { owner: authenticatedUserId },
                { party: authenticatedUserId },
            ],
        }).exec();
        res.status(200).json(parties);
    } catch (error) {
        next(error);
    }
};

export const getParty: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const partyId = req.params.partyId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(partyId)) {
            throw createHttpError(400, "Invalid party id");
        }
        const party = await PartyModel.findById(partyId);

        if (!party) {
            throw createHttpError(404, "Party not found");
        }

        const isOwner = party.owner.equals(authenticatedUserId);

        const isParty = party.party.equals(authenticatedUserId);

        if (!isOwner && !isParty) {
            throw createHttpError(401, "You cannot access this party");
        }
        res.status(200).json(party);
    } catch (error) {
        next(error);
    }
};

export const getContractParties: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const contractId = req.params.partyId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(partyId)) {
            throw createHttpError(400, "Invalid party id");
        }
        const parties = await PartyModel.find({
            contractId: contractId,
        });

        const isParty = parties.some((party) => {
            return (
                party.owner.equals(authenticatedUserId) ||
                party.party.equals(authenticatedUserId)
            );
        });

        if (!isParty) {
            throw createHttpError(401, "You cannot access this parties");
        }
        res.status(200).json(parties);
    } catch (error) {
        next(error);
    }
};

export const getContractParty: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const partyId = req.params.partyId;
    const contractId = req.query.contractId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(partyId)) {
            throw createHttpError(400, "Invalid party id");
        }
        if (!mongoose.isValidObjectId(contractId)) {
            throw createHttpError(400, "Invalid contract id");
        }
        const parties = await PartyModel.find({
            contractId: contractId,
        });

        const isParty = parties.some((party) => {
            return (
                party.owner.equals(authenticatedUserId) ||
                party.party.equals(authenticatedUserId)
            );
        });

        if (!isParty) {
            throw createHttpError(401, "You cannot access this party");
        }

        const party = parties.filter((party) => party._id === partyId);

        res.status(200).json(party);
    } catch (error) {
        next(error);
    }
};

interface CreatePartyBody {
    contractId?: string;
    party?: string;
}

export const createParty: RequestHandler<
    unknown,
    unknown,
    CreatePartyBody,
    unknown
> = async (req, res, next) => {
    const contractId = req.body.contractId;
    const party = req.body.party;
    const authenticatedUserId = req.session.userId;
    try {
        if (!contractId) {
            throw createHttpError(
                400,
                "Must send the owner field to create a party"
            );
        }

        if (!mongoose.isValidObjectId(contractId)) {
            throw createHttpError(400, "Invalid contract id");
        }

        if (!owner) {
            throw createHttpError(
                400,
                "Must send the owner field to create a party"
            );
        }
        if (!mongoose.isValidObjectId(owner)) {
            throw createHttpError(400, "Invalid owner id");
        }

        if (!party) {
            throw createHttpError(
                400,
                "Must send the party field to create a party"
            );
        }

        if (!mongoose.isValidObjectId(party)) {
            throw createHttpError(400, "Invalid party id");
        }

        const contract = await ContractModel.findById(contractId);

        if (!contract) {
            throw createHttpError(404, "Contract not found");
        }

        const isOwner = contract.owner.equals(authenticatedUserId);

        if (!isOwner) {
            throw createHttpError(
                401,
                "You cannot add parties to this contract"
            );
        }

        const newParty = await PartyModel.create({
            contractId: contractId,
            owner: authenticatedUserId,
            party: party,
            status: "requested",
            requestDate: new Date(),
        });

        res.status(201).json(newParty);
    } catch (error) {
        next(error);
    }
};

interface UpdateContractParams {
    contractId: string;
}

interface UpdateContractBody {
    name?: string;
    type?: string;
}

export const updateContract: RequestHandler<
    UpdateContractParams,
    unknown,
    UpdateContractBody,
    unknown
> = async (req, res, next) => {
    const contractId = req.params.contractId;
    const newName = req.body.name;
    const newType = req.body.type;

    try {
        if (!mongoose.isValidObjectId(contractId)) {
            throw createHttpError(400, "Invalid contract id");
        }
        if (!newName) {
            throw createHttpError(
                400,
                "Must send the type field to create a contract"
            );
        }
        if (!newType) {
            throw createHttpError(
                400,
                "Must send the type field to create a contract"
            );
        }

        const contract = await PartyModel.findById(contractId).exec();

        if (!contract) {
            throw createHttpError(404, "Contract not found");
        }

        contract.name = newName;
        contract.type = newType;

        const updatedContract = await contract.save();

        res.status(200).json(updatedContract);
    } catch (error) {
        next(error);
    }
};

export const deleteContract: RequestHandler = async (req, res, next) => {
    const contractId = req.params.contractId;

    try {
        if (!mongoose.isValidObjectId(contractId)) {
            throw createHttpError(400, "Invalid contract id");
        }

        const contract = await PartyModel.findById(contractId).exec();
        if (!contract) {
            throw createHttpError(404, "Contract not found");
        }

        await contract.deleteOne();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
