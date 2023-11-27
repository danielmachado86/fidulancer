import { Card } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { Contract as ContractModel } from "../models/contract";
import styles from "../styles/Contract.module.css";
import styleUtils from "../styles/utils.module.css";
import { formatDate } from "../utils/formatDate";

interface ContractProps {
    contract: ContractModel;
    onContractClicked: (contract: ContractModel) => void;
    onDeleteContractClicked: (contract: ContractModel) => void;
    className?: string;
}

const Contract = ({
    contract,
    onContractClicked,
    onDeleteContractClicked,
    className,
}: ContractProps) => {
    const { type, createdAt, updatedAt } = contract;

    let createdUpdatedText: string;
    if (updatedAt > createdAt) {
        createdUpdatedText = "Updated: " + formatDate(updatedAt);
    } else {
        createdUpdatedText = "Created: " + formatDate(createdAt);
    }

    return (
        <Card
            className={`${styles.contractCard} ${className}`}
            onClick={() => onContractClicked(contract)}
        >
            <Card.Body className={styles.cardBody}>
                <Card.Title className={styleUtils.flexCenter}>
                    {type}
                    <MdDelete
                        className="text-muted ms-auto"
                        onClick={(e) => {
                            onDeleteContractClicked(contract);
                            e.stopPropagation();
                        }}
                    />
                </Card.Title>
                <Card.Text className={styles.cardText}>{type}</Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted">
                {createdUpdatedText}
            </Card.Footer>
        </Card>
    );
};

export default Contract;
