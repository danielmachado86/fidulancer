export interface Party {
    _id: string;
    contractId: string;
    userId: string;
    role: string;
    status: string;
    requestDate: string;
    responseDate: string;
    expiredDate: string;
}
