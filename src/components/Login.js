import React, {useRef} from 'react';
import {Button, Container, Form} from "react-bootstrap";
import {v4 as uuidV4} from 'uuid';

export default function Login( {onIdSubmit} ) {

    const idRef = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        onIdSubmit(idRef.current.value);
    };

    const createNewId = () => {
        onIdSubmit(uuidV4())
    };

    return (
        <Container className="align-items-center d-flex" style={{height: '100vh'}}>
            <Form onSubmit={handleSubmit} className="w-100">
                <Form.Group>
                    <Form.Label>Enter Your ID</Form.Label>
                    <Form.Control type="text" ref={idRef} required></Form.Control>
                </Form.Group>
                <Button type="submit">Login</Button>
                <Button variant="secondary" onClick={createNewId}>Create a new ID</Button>
            </Form>
        </Container>
    )
}