import { RequestHandler } from "express";
import AgreementTemplateModel from "../models/agreementTemplate";

type GetAgreementTemplatesQueryParams = {
    name?: string;
    category?: string;
};
export const getAgreementTemplates: RequestHandler<
    unknown,
    unknown,
    unknown,
    GetAgreementTemplatesQueryParams
> = async (req, res, next) => {
    const name = req.query.name;
    const category = req.query.category;

    const query: GetAgreementTemplatesQueryParams = {};

    if (name) {
        query.name = name;
    }
    if (category) {
        query.category = category;
    }

    try {
        const terms = await BaseTermModel.find(query).exec();
        res.status(200).json(terms);
    } catch (error) {
        next(error);
    }
};

export const getAgreementTemplateById: RequestHandler = async (
    req,
    res,
    next
) => {
    const id = req.params.id;
    try {
        const term = await AgreementTemplateModel.findById(id).exec();
        res.status(200).json(term);
    } catch (error) {
        next(error);
    }
};

export const createAgreementTemplate: RequestHandler = async (
    req,
    res,
    next
) => {
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
