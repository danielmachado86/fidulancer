// Steps/Contact.js

import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
                <Form>
                    <div className="mb-3">
                        <Form.Check // prettier-ignore
                            type="radio"
                            id="rs-radio"
                            name="group1"
                            label="Real state lease"
                        />
                    </div>
                    <div className="mb-3">
                        <Form.Check // prettier-ignore
                            type="radio"
                            id="fr-radio"
                            name="group1"
                            label="Freelance"
                        />
                    </div>
                    <div className="mb-3">
                        <Form.Check // prettier-ignore
                            type="radio"
                            id="sp-radio"
                            name="group1"
                            label="Sales and Purchase Agreement"
                        />
                    </div>
                </Form>
                <Button type="submit">Next {">"}</Button>
            </fieldset>
        </Form>
    );
};
