import { RequestHandler } from "express";
import BaseTermModel from "../models/baseTerm";

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
        const terms = await BaseTermModel.aggregate([
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
        ]).exec();
        res.status(200).json(terms);
    } catch (error) {
        next(error);
    }
};

export const getBaseTermsById: RequestHandler = async (req, res, next) => {
    const id = req.params.id;
    try {
        const term = await BaseTermModel.findById(id).exec();
        res.status(200).json(term);
    } catch (error) {
        next(error);
    }
};

export const createBaseTerm: RequestHandler = async (req, res, next) => {
    const name = req.body.name;
    const facts = req.body.facts;
    const category = req.body.category;
    try {
        const newBaseTerm = await BaseTermModel.create({
            name: name,
            facts: facts,
            category: category,
        });

        res.status(201).json(newBaseTerm);
    } catch (error) {
        next(error);
    }
};
