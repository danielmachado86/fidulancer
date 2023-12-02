import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginModal from "./components/LoginModal";
import NavBar from "./components/NavBar";
import SignUpModal from "./components/SignUpModal";
import { User } from "./models/user";
import * as ContractsApi from "./network/contracts_api";
import styles from "./styles/App.module.css";

function App() {
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        async function fetchLoggedInUser() {
            try {
                const user = await ContractsApi.getLoggedInUser();
                setLoggedInUser(user);
            } catch (error) {
                console.error(error);
            }
        }
        fetchLoggedInUser();
    }, []);

    return (
        <div>
            <NavBar
                loggedInUser={loggedInUser}
                onLoginClicked={() => setShowLoginModal(true)}
                onSignUpClicked={() => setShowSignUpModal(true)}
                onLogoutSuccessful={() => setLoggedInUser(null)}
            />
            <Router>
                <Container className={styles.pageContainer}>
                    <Routes>
                        <Route
                            path="new/basic"
                            element={
                                loggedInUser ? (
                                    <div>Basic info page</div>
                                ) : (
                                    <div>Please log in...</div>
                                )
                            }
                        />
                        <Route
                            path="new/terms"
                            element={
                                loggedInUser ? (
                                    <div>Terms page</div>
                                ) : (
                                    <div>Please log in...</div>
                                )
                            }
                        />
                        <Route
                            path="new/parties"
                            element={
                                loggedInUser ? (
                                    <div>Parties page</div>
                                ) : (
                                    <div>Please log in...</div>
                                )
                            }
                        />
                        <Route
                            path="new/confirm"
                            element={
                                loggedInUser ? (
                                    <div>Confirm page</div>
                                ) : (
                                    <div>Please log in...</div>
                                )
                            }
                        />
                        <Route path="/*" element={<div>Not found page</div>} />
                    </Routes>
                </Container>
            </Router>
            {showSignUpModal && (
                <SignUpModal
                    onDismiss={() => setShowSignUpModal(false)}
                    onSignUpSuccessful={(user) => {
                        setLoggedInUser(user);
                        setShowSignUpModal(false);
                    }}
                />
            )}
            {showLoginModal && (
                <LoginModal
                    onDismiss={() => setShowLoginModal(false)}
                    onLoginSuccessful={(user) => {
                        setLoggedInUser(user);
                        setShowLoginModal(false);
                    }}
                />
            )}
        </div>
    );
}

export default App;
