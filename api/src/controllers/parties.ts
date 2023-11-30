import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import ContractModel from "../models/contract";
import PartyModel from "../models/party";
import { assertIsDefined } from "../util/assertIsDefined";

interface GetPartiesQueryParams {
    contractId?: string;
}

export const getParties: RequestHandler<
    unknown,
    unknown,
    unknown,
    GetPartiesQueryParams
> = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const contractId = req.query.contractId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(contractId) && contractId) {
            throw createHttpError(400, "Invalid contract id");
        }

        let parties;
        if (contractId) {
            parties = await PartyModel.find({ contractId: contractId });
        } else {
            parties = await PartyModel.find({
                userId: authenticatedUserId,
            });
        }

        const isParty = parties.some((party) => {
            return party.userId.equals(authenticatedUserId);
        });

        if (parties && !isParty) {
            throw createHttpError(401, "You cannot access this parties");
        }

        res.status(200).json(parties);
    } catch (error) {
        next(error);
    }
};

interface getPartyParams {
    partyId: string;
}

export const getParty: RequestHandler<
    getPartyParams,
    unknown,
    unknown,
    unknown
> = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const partyId = req.params.partyId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(partyId)) {
            throw createHttpError(400, "Invalid party id");
        }

        const party = await PartyModel.findById(partyId).exec();

        if (!party) {
            throw createHttpError(404, "Party not found");
        }

        const parties = await PartyModel.find({
            contractId: party.contractId,
        }).exec();

        const isParty = parties.some((item) => {
            return item.userId.equals(authenticatedUserId);
        });

        if (!isParty) {
            throw createHttpError(401, "You cannot access this party");
        }

        res.status(200).json(party);
    } catch (error) {
        next(error);
    }
};

interface CreatePartyBody {
    contractId?: string;
    userId?: string;
}

export const createParty: RequestHandler<
    unknown,
    unknown,
    CreatePartyBody,
    unknown
> = async (req, res, next) => {
    const contractId = req.body.contractId;
    const userId = req.body.userId;
    const authenticatedUserId = req.session.userId;
    try {
        if (!contractId) {
            throw createHttpError(
                400,
                "Must send contractId field to create a party"
            );
        }
        if (!mongoose.isValidObjectId(contractId)) {
            throw createHttpError(400, "Invalid contract id");
        }

        if (!userId) {
            throw createHttpError(
                400,
                "Must send the owner field to create a party"
            );
        }
        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, "Invalid owner id");
        }

        const contract = await ContractModel.findById(contractId);

        if (!contract) {
            throw createHttpError(404, "Contract not found");
        }

        const parties = await PartyModel.find({ contractId: contractId });
        const isOwner = parties.some((party) => {
            return (
                party.userId.equals(authenticatedUserId) &&
                party.role === "owner"
            );
        });
        if (!isOwner) {
            throw createHttpError(
                401,
                "You cannot create parties for this contract"
            );
        }

        const newParty = await PartyModel.create({
            contractId: contractId,
            userId: userId,
            role: "party",
            status: "requested",
            requestDate: new Date(),
        });

        contract.parties.push(newParty.id);
        contract.save();

        res.status(201).json(newParty);
    } catch (error) {
        next(error);
    }
};

// interface UpdateContractParams {
//     contractId: string;
// }

// interface UpdateContractBody {
//     name?: string;
//     type?: string;
// }

// export const updateContract: RequestHandler<
//     UpdateContractParams,
//     unknown,
//     UpdateContractBody,
//     unknown
// > = async (req, res, next) => {
//     const contractId = req.params.contractId;
//     const newName = req.body.name;
//     const newType = req.body.type;

//     try {
//         if (!mongoose.isValidObjectId(contractId)) {
//             throw createHttpError(400, "Invalid contract id");
//         }
//         if (!newName) {
//             throw createHttpError(
//                 400,
//                 "Must send the type field to create a contract"
//             );
//         }
//         if (!newType) {
//             throw createHttpError(
//                 400,
//                 "Must send the type field to create a contract"
//             );
//         }

//         const contract = await PartyModel.findById(contractId).exec();

//         if (!contract) {
//             throw createHttpError(404, "Contract not found");
//         }

//         contract.name = newName;
//         contract.type = newType;

//         const updatedContract = await contract.save();

//         res.status(200).json(updatedContract);
//     } catch (error) {
//         next(error);
//     }
// };

// export const deleteContract: RequestHandler = async (req, res, next) => {
//     const contractId = req.params.contractId;

//     try {
//         if (!mongoose.isValidObjectId(contractId)) {
//             throw createHttpError(400, "Invalid contract id");
//         }

//         const contract = await PartyModel.findById(contractId).exec();
//         if (!contract) {
//             throw createHttpError(404, "Contract not found");
//         }

//         await contract.deleteOne();

//         res.sendStatus(204);
//     } catch (error) {
//         next(error);
//     }
// };
