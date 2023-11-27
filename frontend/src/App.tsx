import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginModal from "./components/LoginModal";
import NavBar from "./components/NavBar";
import SignUpModal from "./components/SignUpModal";
import { User } from "./models/user";
import * as ContractsApi from "./network/contracts_api";
import ContractsPage from "./pages/ContractsPages";
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
        <BrowserRouter>
            <div>
                <NavBar
                    loggedInUser={loggedInUser}
                    onLoginClicked={() => setShowLoginModal(true)}
                    onSignUpClicked={() => setShowSignUpModal(true)}
                    onLogoutSuccessful={() => setLoggedInUser(null)}
                />
                <Container className={styles.pageContainer}>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <ContractsPage loggedInUser={loggedInUser} />
                            }
                        />
                        {/* <Route
							path='/privacy'
							element={<PrivacyPage />}
						/>
						<Route
							path='/*'
							element={<NotFoundPage />}
						/> */}
                    </Routes>
                </Container>
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
        </BrowserRouter>
    );
}

export default App;