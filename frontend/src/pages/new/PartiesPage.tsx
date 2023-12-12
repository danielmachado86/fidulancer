// Steps/Contact.js

import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import TextInputField from "../../components/form/TextInputField";
import { Contract } from "../../models/contract";

import { useEffect } from "react";
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

    let [dogImage, setDogImage] = useState(null);

    // 3. Create out useEffect function
    useEffect(() => {
        fetch("https://dog.ceo/api/breeds/image/random")
            .then((response) => response.json())
            // 4. Setting *dogImage* to the image url that we received from the response above
            .then((data) => setDogImage(data.message));
    }, []);

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
