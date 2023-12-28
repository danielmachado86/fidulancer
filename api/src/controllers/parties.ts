import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import { ContractDocument, Contracts } from "../models/contract";
import { Parties, PartyBaseDocument } from "../models/party";
import { Users } from "../models/user";

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
    const authenticatedUserId = new ObjectId(req.session.userId);

    try {
        const contractId = new ObjectId(req.query.contractId);
        assertIsDefined(authenticatedUserId);

        if (!contractId) {
            const parties = await Parties.find({
                userId: authenticatedUserId,
            }).toArray();

            return res.status(200).json(parties);
        }

        const contracts = await Contracts.aggregate<ContractDocument>([
            {
                $match: {
                    _id: contractId,
                },
            },
            {
                $lookup: {
                    from: "parties",
                    localField: "parties",
                    foreignField: "_id",
                    as: "parties",
                },
            },
        ]).toArray();

        if (contracts.length === 0) {
            throw createHttpError(404, "Parties not found");
        }

        const isParty = contracts[0].parties.some((party) => {
            return party.userId.equals(authenticatedUserId);
        });

        if (!isParty) {
            throw createHttpError(401, "You cannot access this parties");
        }

        return res.status(200).json(contracts[0].parties);
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
    const authenticatedUserId = new ObjectId(req.session.userId);

    try {
        const partyId = new ObjectId(req.params.partyId);

        assertIsDefined(authenticatedUserId);

        //q: find the contract that has this partyId
        const contracts = await Contracts.aggregate<ContractDocument>([
            {
                $match: {
                    parties: partyId,
                },
            },
            {
                $lookup: {
                    from: "parties",
                    localField: "parties",
                    foreignField: "_id",
                    as: "parties",
                },
            },
        ]).toArray();

        if (contracts.length === 0) {
            throw createHttpError(404, "Party not found");
        }

        //q: find the party in contracts array that has this partyId
        const party = contracts[0].parties.filter((party) => {
            return party._id.equals(partyId);
        });

        if (!party) {
            throw createHttpError(401, "You cannot access this party");
        }

        res.status(200).json(party);
    } catch (error) {
        next(error);
    }
};

interface CreatePartyQueryParams {
    contractId?: string;
}

export const createParty: RequestHandler<
    unknown,
    unknown,
    PartyBaseDocument,
    CreatePartyQueryParams
> = async (req, res, next) => {
    const authenticatedUserId = new ObjectId(req.session.userId);
    try {
        const contractId = new ObjectId(req.query.contractId);
        const userId = new ObjectId(req.body.userId);
        if (!contractId) {
            throw createHttpError(
                400,
                "Must send contractId field to create a party"
            );
        }

        if (!userId) {
            throw createHttpError(
                400,
                "Must send the userId field to create a party"
            );
        }

        const contracts = await Contracts.aggregate<ContractDocument>([
            {
                $match: {
                    _id: contractId,
                },
            },
            {
                $lookup: {
                    from: "parties",
                    localField: "parties",
                    foreignField: "_id",
                    as: "parties",
                },
            },
        ]).toArray();

        if (contracts.length === 0) {
            throw createHttpError(404, "Contract not found");
        }

        const user = await Users.find({ _id: userId });

        if (!user) {
            throw createHttpError(404, "User not found");
        }

        const isOwner = contracts[0].parties.some((party) => {
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

        const party = {
            userId: userId,
            role: "party",
            status: "requested",
            requestDate: new Date(),
        };

        const newParty = await Parties.insertOne(party);

        Contracts.updateOne(
            { _id: contractId },
            { $push: { parties: newParty.insertedId } }
        );

        res.status(201).json({ _id: newParty.insertedId, ...party });
    } catch (error) {
        next(error);
    }
};

// // interface UpdateContractParams {
// //     contractId: string;
// // }

// // interface UpdateContractBody {
// //     name?: string;
// //     type?: string;
// // }

// // export const updateContract: RequestHandler<
// //     UpdateContractParams,
// //     unknown,
// //     UpdateContractBody,
// //     unknown
// // > = async (req, res, next) => {
// //     const contractId = req.params.contractId;
// //     const newName = req.body.name;
// //     const newType = req.body.type;

// //     try {
// //         if (!mongoose.isValidObjectId(contractId)) {
// //             throw createHttpError(400, "Invalid contract id");
// //         }
// //         if (!newName) {
// //             throw createHttpError(
// //                 400,
// //                 "Must send the type field to create a contract"
// //             );
// //         }
// //         if (!newType) {
// //             throw createHttpError(
// //                 400,
// //                 "Must send the type field to create a contract"
// //             );
// //         }

// //         const contract = await PartyModel.findById(contractId).exec();

// //         if (!contract) {
// //             throw createHttpError(404, "Contract not found");
// //         }

// //         contract.name = newName;
// //         contract.type = newType;

// //         const updatedContract = await contract.save();

// //         res.status(200).json(updatedContract);
// //     } catch (error) {
// //         next(error);
// //     }
// // };

// // export const deleteContract: RequestHandler = async (req, res, next) => {
// //     const contractId = req.params.contractId;

// //     try {
// //         if (!mongoose.isValidObjectId(contractId)) {
// //             throw createHttpError(400, "Invalid contract id");
// //         }

// //         const contract = await PartyModel.findById(contractId).exec();
// //         if (!contract) {
// //             throw createHttpError(404, "Contract not found");
// //         }

// //         await contract.deleteOne();

// //         res.sendStatus(204);
// //     } catch (error) {
// //         next(error);
// //     }
// // };
