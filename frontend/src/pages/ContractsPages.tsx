import { Container } from "react-bootstrap";
import ContractsPageLoggedInView from "../components/ContractsPageLoggedInView";
import ContractsPageLoggedOutView from "../components/ContractsPageLoggedOutView";
import { User } from "../models/user";
import styles from "../styles/ContractsPage.module.css";

interface ContractsPageProps {
    loggedInUser: User | null;
}

const ContractsPage = ({ loggedInUser }: ContractsPageProps) => {
    return (
        <Container className={styles.contractsPage}>
            <>
                {loggedInUser ? (
                    <ContractsPageLoggedInView />
                ) : (
                    <ContractsPageLoggedOutView />
                )}
            </>
        </Container>
    );
};

export default ContractsPage;
