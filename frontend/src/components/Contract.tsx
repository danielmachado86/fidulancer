import { Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Contract as ContractModel } from "../models/contract";

interface ContractProps {
    contract: ContractModel;
    onContractClicked: (contract: ContractModel) => void;
    onRequestPartyClicked: (contract: ContractModel) => void;
    onDeleteContractClicked: (contract: ContractModel) => void;
    className?: string;
}

const Contract = ({
    contract,
    onContractClicked,
    onRequestPartyClicked,
    onDeleteContractClicked,
    className,
}: ContractProps) => {
    return (
        <tr key={contract._id}>
            <td onClick={() => onContractClicked(contract)}>{contract.name}</td>
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
                <div className="d-flex">
                    <Button
                        className="btn btn-secondary"
                        onClick={() => onRequestPartyClicked(contract)}
                    >
                        <FaPlus />
                    </Button>
                    {contract.parties.map((party) => {
                        return (
                            <div key={party._id}>
                                <Button>{party.userId.username}</Button>
                            </div>
                        );
                    })}
                </div>
            </td>
            <MdDelete
                className="text-muted ms-auto"
                onClick={(e) => {
                    onDeleteContractClicked(contract);
                    e.stopPropagation();
                }}
            />
        </tr>
    );
};

export default Contract;
