import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose, { Types } from "mongoose";
import ContractModel from "../models/contract";
import { assertIsDefined } from "../util/assertIsDefined";

export const getContracts: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const contracts = await ContractModel.find({
            owner: req.session.userId,
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
        const contract = await ContractModel.aggregate([
            { $match: { _id: new Types.ObjectId(contractId) } },
            {
                $lookup: {
                    from: "facts",
                    let: { contractId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$contractId", "$$contractId"] },
                            },
                        },
                    ],
                    as: "facts",
                },
            },
            {
                $project: {
                    _id: 1,
                    type: 1,
                    parties: 1,
                    "facts._id": 1,
                    "facts.name": 1,
                    "facts.value": 1,
                    "facts.unit": 1,
                },
            },
        ]);


const count = contract[0].parties.filter(party => {
    if (party._id.equals(authenticatedUserId)) {
      return true;
    }
  
    return false;
  }).length;

        if(!contract[0].owner.equals(authenticatedUserId) || ){

        }
        res.status(200).json(contract[0]);
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
