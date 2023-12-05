import { ReactNode, createContext, useContext, useState } from "react";
import { Contract } from "../models/contract";

type Props = {
    children?: ReactNode;
};

type INewContractProps = {
    newContract: Partial<Contract>;
    setNewContract: (newState: Partial<Contract>) => void;
};

let emptyContract: Partial<Contract> = {};

const initialContract = {
    newContract: emptyContract,
    setNewContract: () => {},
};

export const AppStateContext =
    createContext<INewContractProps>(initialContract);

export function AppProvider({ children }: Props) {
    const [newContract, setNewContract] = useState(initialContract.newContract);
    return (
        <AppStateContext.Provider value={{ newContract, setNewContract }}>
            {children}
        </AppStateContext.Provider>
    );
}

export function useAppState() {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error("useAppState must be used within the AppProvider");
    }
    return context;
}
