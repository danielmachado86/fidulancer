// Steps/Contact.js

import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";
import { Term } from "../../models/term";
import { useAppState } from "../../utils/state";
import { titleCase } from "../../utils/titleCase";
import { testTerms } from "./utils/termsLocal";

export const TermsPage = () => {
    const { newContract, setNewContract } = useAppState();
    const [terms, setTerms] = useState<Term[]>([]);

    const navigate = useNavigate();

    const saveData = (data: Term[]) => {
        newContract.terms = data;
        setNewContract({ ...newContract });
        navigate("/new/parties");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let updatedList = [...terms];
        if (e.target.checked) {
            updatedList = [...terms, testTerms[parseInt(e.target.value)]];
        } else {
            updatedList.splice(
                terms.indexOf(testTerms[parseInt(e.target.value)]),
                1
            );
        }
        setTerms(updatedList);
    };

    // Log the main state when it changes
    useEffect(() => console.log(terms), [terms]);

    return (
        <div>
            <fieldset>
                <legend>Terms</legend>
                <ul className="d-flex flex-wrap justify-content-center">
                    {testTerms.map((term, index) => (
                        <li key={index} className="m-1 btn btn-secondary">
                            <Form.Check type="checkbox" id={`${index}`}>
                                <Form.Check.Input
                                    type="checkbox"
                                    value={index}
                                    onChange={handleChange}
                                />
                                <Form.Check.Label className="text-nowrap">
                                    {titleCase(term.name)}
                                </Form.Check.Label>
                            </Form.Check>
                        </li>
                    ))}
                </ul>
            </fieldset>
            <Accordion defaultActiveKey="0">
                {terms.map((term, index) => {
                    return (
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                {titleCase(term.name)}
                            </Accordion.Header>
                            <Accordion.Body>
                                <Form>
                                    {term.facts.map((fact, index1) => {
                                        return (
                                            fact.input_type && (
                                                <div>
                                                    <Form.Group
                                                        as={Row}
                                                        className="mb-3"
                                                    >
                                                        <Form.Label
                                                            column
                                                            sm={2}
                                                        >
                                                            {titleCase(
                                                                fact.name
                                                            )}
                                                        </Form.Label>
                                                        <Col sm={10}>
                                                            <Form.Control
                                                                type={
                                                                    fact.input_type
                                                                        ? fact.input_type
                                                                        : "text"
                                                                }
                                                            />
                                                        </Col>
                                                    </Form.Group>
                                                </div>
                                            )
                                        );
                                    })}
                                </Form>
                            </Accordion.Body>
                        </Accordion.Item>
                    );
                })}
            </Accordion>
            <Button onClick={() => saveData(terms)}>Next {">"}</Button>
        </div>
    );
};
