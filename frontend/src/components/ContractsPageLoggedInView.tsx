import { useEffect, useState } from "react";
import { Button, Spinner, Table } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { Contract as ContractModel } from "../models/contract";

import * as ContractsApi from "../network/contracts_api";
import styleUtils from "../styles/utils.module.css";
import AddEditContractDialog from "./AddEditContractDialog";
import Contract from "./Contract";
import RequestPartyDialog from "./RequestPartyDialog";

const ContractsPageLoggedInView = () => {
    const [contracts, setContracts] = useState<ContractModel[]>([]);

    const [contractsLoading, setContractsLoading] = useState(true);
    const [showContractsLoadingError, setShowContractsLoadingError] =
        useState(false);

    const [showAddContractDialog, setShowAddContractDialog] = useState(false);
    const [contractToEdit, setContractToEdit] = useState<ContractModel | null>(
        null
    );
    const [requestParty, setRequestParty] = useState<ContractModel | null>(
        null
    );

    useEffect(() => {
        async function loadContracts() {
            try {
                setShowContractsLoadingError(false);
                setContractsLoading(true);
                const contracts = await ContractsApi.fetchContracts();

                setContracts(contracts);
            } catch (error) {
                console.error(error);
                setShowContractsLoadingError(true);
            } finally {
                setContractsLoading(false);
            }
        }
        loadContracts();
    }, []);

    async function deleteContract(contract: ContractModel) {
        try {
            await ContractsApi.deleteContract(contract._id);
            setContracts(
                contracts.filter(
                    (existingContract) => existingContract._id !== contract._id
                )
            );
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    const contractsTable = (
        <Table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    {/* <th>Start Date</th> */}
                    {/* <th>Status</th> */}
                    {/* <th>Completion</th> */}
                    <th>Parties</th>
                </tr>
            </thead>
            <tbody>
                {contracts.map((contract) => (
                    <Contract
                        contract={contract}
                        onContractClicked={setContractToEdit}
                        onRequestPartyClicked={setRequestParty}
                        onDeleteContractClicked={deleteContract}
                    />
                ))}
            </tbody>
        </Table>
    );

    return (
        <>
            <Button
                className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
                onClick={() => setShowAddContractDialog(true)}
            >
                <FaPlus />
                Add new contract
            </Button>
            {contractsLoading && (
                <Spinner animation="border" variant="primary" />
            )}
            {showContractsLoadingError && (
                <p>Something went wrong. Please refresh the page.</p>
            )}
            {!contractsLoading && !showContractsLoadingError && (
                <>
                    {contracts.length > 0 ? (
                        contractsTable
                    ) : (
                        <p>You don't have any contracts yet</p>
                    )}
                </>
            )}
            {showAddContractDialog && (
                <AddEditContractDialog
                    onDismiss={() => setShowAddContractDialog(false)}
                    onContractSaved={(newContract) => {
                        console.log(newContract);
                        setContracts([...contracts, newContract]);
                        setShowAddContractDialog(false);
                    }}
                />
            )}
            {contractToEdit && (
                <AddEditContractDialog
                    contractToEdit={contractToEdit}
                    onDismiss={() => setContractToEdit(null)}
                    onContractSaved={(updatedContract) => {
                        setContracts(
                            contracts.map((existingContract) =>
                                existingContract._id === updatedContract._id
                                    ? updatedContract
                                    : existingContract
                            )
                        );
                        setContractToEdit(null);
                    }}
                />
            )}
            {requestParty && (
                <RequestPartyDialog
                    contractToEdit={requestParty}
                    onDismiss={() => setRequestParty(null)}
                />
            )}
        </>
    );
};

export default ContractsPageLoggedInView;
