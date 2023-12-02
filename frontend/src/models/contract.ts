import { Party } from "./party";

export interface Contract {
    _id: string;
    owner: string;
    name: string;
    type: string;
    parties: [Party];
    createdAt: string;
    updatedAt: string;
}
