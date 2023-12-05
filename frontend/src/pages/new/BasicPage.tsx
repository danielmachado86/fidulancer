// Steps/Contact.js

import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import TextInputField from "../../components/form/TextInputField";
import { Contract } from "../../models/contract";

import { useAppState } from "../../utils/state";

export const BasicPage = () => {
    const { newContract, setNewContract } = useAppState();
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({ defaultValues: newContract, mode: "onSubmit" });
    const navigate = useNavigate();

    const saveData = (data: Partial<Contract>) => {
        setNewContract({ ...newContract, ...data });
        navigate("/new/terms");
    };

    return (
        <Form onSubmit={handleSubmit(saveData)}>
            <fieldset>
                <legend>Basic Info</legend>
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
                <Button type="submit">Next {">"}</Button>
            </fieldset>
        </Form>
    );
};
