import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import { ContractDocument, Contracts } from "../models/contract";
import { Parties, PartyBaseDocument } from "../models/party";
import { assertIsDefined } from "../util/assertIsDefined";

export const getContracts: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = new ObjectId(req.session.userId);

    try {
        assertIsDefined(authenticatedUserId);

        const parties = await Parties.find({
            userId: authenticatedUserId,
        }).toArray();

        if (parties.length === 0) {
            throw createHttpError(404, "Contracts not found");
        }
        const partyIds = parties.map((party) => party._id);

        const contracts = await Contracts.aggregate<ContractDocument>([
            {
                $match: {
                    parties: { $in: partyIds },
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

        return res.status(200).json(contracts);
    } catch (error) {
        next(error);
    }
};

export const getContract: RequestHandler = async (req, res, next) => {
    try {
        const authenticatedUserId = new ObjectId(req.session.userId);
        const contractId = new ObjectId(req.params.contractId);
        assertIsDefined(authenticatedUserId);
        assertIsDefined(contractId);

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

        const isParty = contracts[0].parties.some((party) => {
            return party.userId.equals(authenticatedUserId);
        });

        if (!isParty) {
            throw createHttpError(401, "You cannot access this contract");
        }
        res.status(200).json(contracts[0]);
    } catch (error) {
        next(error);
    }
};

export const createContract: RequestHandler<
    unknown,
    unknown,
    ContractDocument,
    unknown
> = async (req, res, next) => {
    const authenticatedUserId = new ObjectId(req.session.userId);
    try {
        assertIsDefined(authenticatedUserId);

        const party = await PartyBaseDocument.parseAsync({
            userId: authenticatedUserId,
            role: "owner",
            status: "approved",
            requestDate: new Date(),
        });

        await Parties.insertOne(party);

        const contract = {
            ...req.body,
            parties: [party._id],
        };

        await Contracts.insertOne(contract);

        res.status(201).json({
            ...req.body,
            parties: [party],
        });
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
    const contractId = new ObjectId(req.params.contractId);
    const newName = req.body.name;
    const newType = req.body.type;

    try {
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

        const contract = await Contracts.findOne({ _id: contractId });

        if (!contract) {
            throw createHttpError(404, "Contract not found");
        }

        contract.name = newName;
        contract.type = newType;

        const updatedContract = await Contracts.findOneAndUpdate(
            { _id: contractId },
            contract
        );

        res.status(200).json(updatedContract);
    } catch (error) {
        next(error);
    }
};

export const deleteContract: RequestHandler = async (req, res, next) => {
    const contractId = new ObjectId(req.params.contractId);

    try {
        assertIsDefined(contractId);

        const contract = await Contracts.findOne({ _id: contractId });
        if (!contract) {
            throw createHttpError(404, "Contract not found");
        }

        await Contracts.deleteOne({ _id: contractId });

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
