// Steps/Contact.js

import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import TextInputField from "../../components/form/TextInputField";
import { Contract } from "../../models/contract";

import { useAppState } from "../../utils/state";

export const PartiesPage = () => {
    const { newContract, setNewContract } = useAppState();
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({ defaultValues: newContract, mode: "onSubmit" });
    const navigate = useNavigate();

    const saveData = (data: Partial<Contract>) => {
        setNewContract({ ...newContract, ...data });
        navigate("/new/parties");
    };

    return (
        <Form onSubmit={handleSubmit(saveData)}>
            <fieldset>
                <legend>Parties</legend>
                <div className="d-flex">
                    <TextInputField
                        name="email"
                        label="email"
                        type="email"
                        placeholder="email"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.parties?.[0]?.userId?.email}
                    />
                    <Button>Add</Button>
                </div>
                <Button type="submit">Next {">"}</Button>
            </fieldset>
        </Form>
    );
};
