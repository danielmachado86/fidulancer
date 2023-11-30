import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner, Table } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { Contract as ContractModel } from "../models/contract";
import { Party as PartyModel } from "../models/party";

import * as ContractsApi from "../network/contracts_api";
import * as PartiesApi from "../network/parties_api";
import styles from "../styles/ContractsPage.module.css";
import styleUtils from "../styles/utils.module.css";
import AddEditContractDialog from "./AddEditContractDialog";
import Contract from "./Contract";

const ContractsPageLoggedInView = () => {
    const [contracts, setContracts] = useState<ContractModel[]>([]);
    const [parties, setParties] = useState<PartyModel[]>([]);

    const [contractsLoading, setContractsLoading] = useState(true);
    const [showContractsLoadingError, setShowContractsLoadingError] =
        useState(false);

    const [showAddContractDialog, setShowAddContractDialog] = useState(false);
    const [contractToEdit, setContractToEdit] = useState<ContractModel | null>(
        null
    );

    useEffect(() => {
        async function loadContracts() {
            try {
                setShowContractsLoadingError(false);
                setContractsLoading(true);
                const contracts = await ContractsApi.fetchContracts();
                const parties = await PartiesApi.fetchParties();

                setContracts(contracts);
                setParties(parties);
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

    const contractsGrid = (
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.contractsGrid}`}>
            {contracts.map((contract) => (
                <Col key={contract._id}>
                    <Contract
                        contract={contract}
                        className={styles.contract}
                        onContractClicked={setContractToEdit}
                        onDeleteContractClicked={deleteContract}
                    />
                </Col>
            ))}
        </Row>
    );

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
                {contracts.map((contract) => {
                    return (
                        <tr key={contract._id}>
                            <td>{contract.name}</td>
                            <td>{contract.type}</td>
                            {/* <td>nov. 24 2023</td> */}
                            {/* <td>
                                <Badge bg="info">Active</Badge>
                            </td> */}
                            {/* <td>
                                <div>
                                    <div>35%</div>
                                    <ProgressBar
                                        title="progress-bar"
                                        variant="success"
                                        now={35}
                                    />
                                </div>
                            </td> */}
                            <td>
                                {parties.map((party) => {
                                    return party._id;
                                })}
                            </td>
                        </tr>
                    );
                })}
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
        </>
    );
};

export default ContractsPageLoggedInView;
