import { Party } from "../models/party";
import { fetchData } from "../utils/fetchData";

export async function fetchParties(): Promise<Party[]> {
    const response = await fetchData("/api/parties?extended=true", {
        method: "GET",
    });
    return response.json();
}

export type PartyInput = {
    contractId: string;
    userId: string;
};

export async function createParty(party: PartyInput): Promise<Party> {
    const response = await fetchData("/api/parties", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...party,
            role: "party",
            status: "requested",
            requestDate: new Date(),
        }),
    });
    return response.json();
}

// export async function updateContract(
//     contractId: string,
//     contract: ContractInput
// ): Promise<Contract> {
//     const response = await fetchData("/api/contracts/" + contractId, {
//         method: "PATCH",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(contract),
//     });
//     return response.json();
// }

// export async function deleteContract(contractId: string) {
//     await fetchData("/api/contracts/" + contractId, { method: "DELETE" });
// }
