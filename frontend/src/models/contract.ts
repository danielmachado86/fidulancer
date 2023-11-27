import { User } from "./user";

export interface Contract {
    _id: string;
    type: string;
    parties: [User];
    createdAt: string;
    updatedAt: string;
}
