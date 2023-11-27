import { Contract } from "../models/contract";
import { User } from "../models/user";

async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        throw Error(errorMessage);
    }
}

export async function getLoggedInUser(): Promise<User> {
    const response = await fetchData("/api/users", { method: "GET" });
    return response.json();
}

export interface SignUpCredentials {
    username: string;
    email: string;
    password: string;
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
    const response = await fetchData("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
    return response.json();
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export async function login(credentials: LoginCredentials): Promise<User> {
    const response = await fetchData("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
    return response.json();
}

export async function logout() {
    await fetchData("/api/users/logout", { method: "POST" });
}

export async function fetchContracts(): Promise<Contract[]> {
    const response = await fetchData("/api/contracts", { method: "GET" });
    return response.json();
}

export interface ContractInput {
    type: string;
}

export async function createContract(
    contract: ContractInput
): Promise<Contract> {
    const response = await fetchData("/api/contracts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(contract),
    });
    return response.json();
}

export async function updateContract(
    contractId: string,
    contract: ContractInput
): Promise<Contract> {
    const response = await fetchData("/api/contracts/" + contractId, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(contract),
    });
    return response.json();
}

export async function deleteContract(contractId: string) {
    await fetchData("/api/contracts/" + contractId, { method: "DELETE" });
}
