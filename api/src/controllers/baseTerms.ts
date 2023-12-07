import { RequestHandler } from "express";
import BaseTermModel from "../models/baseTerm";

export const getBaseTerms: RequestHandler = async (req, res, next) => {
    const name = req.query.name;
    try {
        let terms;
        if (name) {
            terms = await BaseTermModel.find({ name: name }).exec();
        } else {
            terms = await BaseTermModel.aggregate([
                { $sort: { $createdAt: 1 } },
                {
                    $group: {
                        _id: "$name",
                        lastrecord: {
                            $last: "$$ROOT",
                        },
                    },
                },
            ]).exec();
        }
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
    const result = req.body.result;
    try {
        const newBaseTerm = await BaseTermModel.create({
            name: name,
            facts: facts,
            category: category,
            result: result,
        });

        res.status(201).json(newBaseTerm);
    } catch (error) {
        next(error);
    }
};
