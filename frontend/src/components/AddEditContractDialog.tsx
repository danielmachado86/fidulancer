import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Contract } from "../models/contract";
import * as ContractsApi from "../network/contracts_api";
import { ContractInput } from "../network/contracts_api";
import TextInputField from "./form/TextInputField";

interface AddEditContractDialogProps {
    contractToEdit?: Contract;
    onDismiss: () => void;
    onContractSaved: (contract: Contract) => void;
}

const AddEditContractDialog = ({
    contractToEdit,
    onDismiss,
    onContractSaved,
}: AddEditContractDialogProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ContractInput>({
        defaultValues: {
            type: contractToEdit?.type || "",
        },
    });

    async function onSubmit(input: ContractInput) {
        try {
            let contractResponse: Contract;
            if (contractToEdit) {
                contractResponse = await ContractsApi.updateContract(
                    contractToEdit._id,
                    input
                );
            } else {
                contractResponse = await ContractsApi.createContract(input);
            }
            onContractSaved(contractResponse);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {contractToEdit ? "Edit contract" : "Add contract"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form
                    id="addEditContractForm"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <TextInputField
                        name="name"
                        label="Name"
                        type="text"
                        placeholder="Name"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.name}
                    />
                    <TextInputField
                        name="type"
                        label="Type"
                        type="text"
                        placeholder="Type"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.type}
                    />
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    type="submit"
                    form="addEditContractForm"
                    disabled={isSubmitting}
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddEditContractDialog;
