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
            throw createHttpError(400, "Invalid id");
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
            throw createHttpError(401, "You cannot access this note");
        }
        res.status(200).json(contract);
    } catch (error) {
        next(error);
    }
};

export const createContract: RequestHandler = async (req, res, next) => {
    const type = req.body.type;
    const authenticatedUserId = req.session.userId;
    try {
        const newContract = await ContractModel.create({
            type: type,
            owner: authenticatedUserId,
        });

        res.status(201).json(newContract);
    } catch (error) {
        next(error);
    }
};
