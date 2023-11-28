import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import ContractModel from "../models/contract";
import { assertIsDefined } from "../util/assertIsDefined";

export const getContracts: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const contracts = await ContractModel.find({
            $or: [
                { owner: authenticatedUserId },
                { parties: authenticatedUserId },
            ],
        }).exec();
        res.status(200).json(contracts);
    } catch (error) {
        next(error);
    }
};

export const getContract: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const contractId = req.params.contractId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(contractId)) {
            throw createHttpError(400, "Invalid contract id");
        }
        const contract = await ContractModel.findById(contractId);

        if (!contract) {
            throw createHttpError(404, "Contract not found");
        }

        const isOwner = contract.owner.equals(authenticatedUserId);

        const isParty = contract.parties.some((party) => {
            return party._id.equals(authenticatedUserId);
        });

        if (!isOwner && !isParty) {
            throw createHttpError(401, "You cannot access this contract");
        }
        res.status(200).json(contract);
    } catch (error) {
        next(error);
    }
};

interface CreateContractBody {
    name?: string;
    type?: string;
}

export const createContract: RequestHandler<
    unknown,
    unknown,
    CreateContractBody,
    unknown
> = async (req, res, next) => {
    const name = req.body.name;
    const type = req.body.type;
    const authenticatedUserId = req.session.userId;
    try {
        if (!name) {
            throw createHttpError(
                400,
                "Must send the name field to create a contract"
            );
        }

        if (!type) {
            throw createHttpError(
                400,
                "Must send the type field to create a contract"
            );
        }

        const newContract = await ContractModel.create({
            name: name,
            type: type,
            owner: authenticatedUserId,
        });

        res.status(201).json(newContract);
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

        const contract = await ContractModel.findById(contractId).exec();

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

        const contract = await ContractModel.findById(contractId).exec();
        if (!contract) {
            throw createHttpError(404, "Contract not found");
        }

        await contract.deleteOne();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
