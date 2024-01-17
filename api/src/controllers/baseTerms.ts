import { RequestHandler } from "express";
import { ObjectId } from "mongodb";
import { BaseTermBaseDocument, BaseTerms } from "../models/baseTerm";

type GetBaseTermsQueryParams = {
    name?: string;
    category?: string;
};
export const getBaseTerms: RequestHandler<
    unknown,
    unknown,
    unknown,
    GetBaseTermsQueryParams
> = async (req, res, next) => {
    const name = req.query.name;
    const category = req.query.category;

    const query: GetBaseTermsQueryParams = {};

    if (name) {
        query.name = name;
    }
    if (category) {
        query.category = category;
    }

    try {
        const terms = await BaseTerms.aggregate([
            { $match: query },
            { $sort: { createdAt: 1 } },
            {
                $group: {
                    _id: "$name",
                    lastrecord: {
                        $last: "$$ROOT",
                    },
                },
            },
            {
                $project: { lastrecord: 1, _id: 0 },
            },
            {
                $replaceRoot: {
                    newRoot: "$lastrecord",
                },
            },
        ]).toArray();
        res.status(200).json(terms);
    } catch (error) {
        next(error);
    }
};

type GetBaseTermsByIdUrlParams = {
    id: string;
};

export const getBaseTermsById: RequestHandler<
    GetBaseTermsByIdUrlParams,
    unknown,
    unknown,
    unknown
> = async (req, res, next) => {
    try {
        const isValid = ObjectId.isValid(req.params.id);
        if (!isValid) {
            return res.status(404).json({
                message: "id url param must be a valid ObjectId",
            });
        }
        const id = new ObjectId(req.params.id);

        const term = await BaseTerms.find({ _id: id }).toArray();
        return res.status(200).json(term);
    } catch (error) {
        next(error);
    }
};

export const createBaseTerm: RequestHandler<
    unknown,
    unknown,
    BaseTermBaseDocument,
    unknown
> = async (req, res, next) => {
    try {
        await BaseTerms.insertOne(req.body);

        res.status(201).json(req.body);
    } catch (error) {
        next(error);
    }
};
