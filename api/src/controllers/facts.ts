import { RequestHandler } from "express";
import FactModel from "../models/fact";

export const getFacts: RequestHandler = async (req, res, next) => {
    try {
        const facts = await FactModel.find().exec();
        res.status(200).json(facts);
    } catch (error) {
        next(error);
    }
};

export const createFact: RequestHandler = async (req, res, next) => {
    const contractId = req.params.contractId;
    const name = req.body.name;
    const value = req.body.value;
    const unit = req.body.unit;
    try {
        const newFact = await FactModel.create({
            contractId: contractId,
            name: name,
            value: value,
            unit: unit,
        });

        res.status(201).json(newFact);
    } catch (error) {
        next(error);
    }
};
