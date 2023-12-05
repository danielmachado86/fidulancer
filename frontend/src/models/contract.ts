import { Party } from "./party";
import { Term } from "./term";

export interface Contract {
    _id: string;
    owner: string;
    name: string;
    type: string;
    parties: Party[];
    terms: Term[];
    createdAt: string;
    updatedAt: string;
}
