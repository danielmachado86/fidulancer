import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Contract } from "../models/contract";
import * as PartiesApi from "../network/parties_api";

import { PartyInput } from "../network/parties_api";
import TextInputField from "./form/TextInputField";

interface RequestPartyDialogProps {
    contractToEdit: Contract;
    onDismiss: () => void;
}

const RequestPartyDialog = ({
    contractToEdit,
    onDismiss,
}: RequestPartyDialogProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<PartyInput>();

    async function onSubmit(input: PartyInput) {
        console.log(input);
        try {
            await PartiesApi.createParty(contractToEdit._id, input);
            onDismiss();
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>Request Party</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form id="RequestPartyForm" onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="userId"
                        label="User"
                        type="text"
                        placeholder="User"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.userId}
                    />
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    type="submit"
                    form="RequestPartyForm"
                    disabled={isSubmitting}
                >
                    Request
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RequestPartyDialog;
