import { Button, Navbar } from "react-bootstrap";
import { User } from "../models/user";
import * as ContractApi from "../network/contracts_api";

interface NavBarLoggedInvViewProps {
    user: User;
    onLogoutSuccessful: () => void;
}

const NavBarLoggedInView = ({
    user,
    onLogoutSuccessful,
}: NavBarLoggedInvViewProps) => {
    async function logout() {
        try {
            await ContractApi.logout();
            onLogoutSuccessful();
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (
        <>
            <Navbar.Text className="me-2">
                Signed in as: {user.username}
            </Navbar.Text>
            <Button onClick={logout}>Log out</Button>
        </>
    );
};

export default NavBarLoggedInView;
