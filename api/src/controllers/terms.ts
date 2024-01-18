import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import { BaseTerms } from "../models/baseTerm";
import { ContractDocument, Contracts } from "../models/contract";
import { TermBaseDocument, Terms } from "../models/term";
import { assertIsDefined } from "../util/assertIsDefined";

interface GetTermsQueryParams {
    contractId?: string;
}

export const getTerms: RequestHandler<
    unknown,
    unknown,
    unknown,
    GetTermsQueryParams
> = async (req, res, next) => {
    try {
        if (!req.query.contractId) {
            return res.status(400).json({
                message: "contractId query param must be provided",
            });
        }
        if (!ObjectId.isValid(req.query.contractId)) {
            return res.status(404).json({
                message: "contractId query param must be a valid ObjectId",
            });
        }
        const contractId = new ObjectId(req.query.contractId);

        const terms = await Terms.find({ contractId: contractId }).toArray();

        return res.status(200).json(terms);
    } catch (error) {
        next(error);
    }
};

interface GetTermUrlParams {
    id: string;
}

export const getTerm: RequestHandler<
    GetTermUrlParams,
    unknown,
    unknown,
    unknown
> = async (req, res, next) => {
    const authenticatedUserId = new ObjectId(req.session.userId);

    try {
        assertIsDefined(authenticatedUserId);

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(404).json({
                message: "id url param must be a valid ObjectId",
            });
        }
        const id = new ObjectId(req.params.id);

        const term = await Terms.findOne({ _id: id });

        if (!term) {
            throw createHttpError(404, "Term not found");
        }

        const contracts = await Contracts.aggregate<ContractDocument>([
            {
                $match: {
                    _id: term.contractId,
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
            throw createHttpError(401, "You cannot access this term");
        }

        res.status(200).json(term);
    } catch (error) {
        next(error);
    }
};

interface CreateTermQueryParams {
    contractId?: string;
}

export const createTerm: RequestHandler<
    unknown,
    unknown,
    TermBaseDocument,
    CreateTermQueryParams
> = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId);

        if (!req.query.contractId) {
            return res.status(400).json({
                message: "contractId query param must be provided",
            });
        }
        if (!ObjectId.isValid(req.query.contractId)) {
            return res.status(404).json({
                message: "contractId query param must be a valid ObjectId",
            });
        }
        const contractId = new ObjectId(req.query.contractId);

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
            throw createHttpError(401, "You must be a party to this contract");
        }

        const { baseTermId, ...Term } = req.body;

        const baseTerm = await BaseTerms.findOne(
            { _id: baseTermId },
            { projection: { _id: 0 } }
        );

        if (!baseTerm) {
            throw createHttpError(404, "Base term not found");
        }

        const term = {
            ...Term,
            baseTerm: baseTerm,
            contractId: contractId,
        };

        await Terms.insertOne(term);

        res.status(201).json(term);
    } catch (error) {
        next(error);
    }
};

// export const deleteTerm: RequestHandler = async (req, res, next) => {
//     const contractId = new ObjectId(req.params.contractId);

//     try {
//         assertIsDefined(contractId);

//         const contract = await Terms.findOne({ _id: contractId });
//         if (!contract) {
//             throw createHttpError(404, "Contract not found");
//         }

//         await Terms.deleteOne({ _id: contractId });

//         res.sendStatus(204);
//     } catch (error) {
//         next(error);
//     }
// };
