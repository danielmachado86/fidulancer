export interface Contract {
    _id: string;
    owner: string;
    name: string;
    type: string;
    parties: [string];
    createdAt: string;
    updatedAt: string;
}
