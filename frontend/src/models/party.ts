import { User } from "./user";

export interface Party {
    _id: string;
    contractId: string;
    userId: User;
    role: string;
    status: string;
    requestDate: string;
    responseDate: string;
    expiredDate: string;
}
