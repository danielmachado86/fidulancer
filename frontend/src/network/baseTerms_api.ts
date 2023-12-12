import { Party } from "../models/party";
import { fetchData } from "../utils/fetchData";

export async function fetchBaseTerms(category: string): Promise<Party[]> {
    const response = await fetchData("/api/terms?category=" + category, {
        method: "GET",
    });
    return response.json();
}

export type PartyInput = {
    userId: string;
};

export async function createParty(
    contractId: string,
    party: PartyInput
): Promise<Party> {
    const response = await fetchData("/api/parties?contractId=" + contractId, {
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
