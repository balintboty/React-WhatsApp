import React, {useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {useContact} from "../context/ContactProvider";
import {useConversations} from "../context/ConversationsProvider";

const NewConversationModal = ({closeModal}) => {

    const [selectedContactIds, setSelectedContactIds] = useState([]);
    const {contacts} = useContact();
    const {createConversation} = useConversations();

    const handleSubmit = (e) => {
        e.preventDefault();
        createConversation(selectedContactIds);
        closeModal();
    };

    const handleCheckboxChange = (contactID) => {
        setSelectedContactIds(prevSelectedContactIds => {
            if (prevSelectedContactIds.includes(contactID)) {
                return prevSelectedContactIds.filter(prevId => {
                    return contactID !== prevId
                })
            } else {
                return [...prevSelectedContactIds, contactID]
            }
        })
    };

    return (
        <div>
            <Modal.Header closeButton={closeModal}>Create Contact</Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {contacts.map(contact => (
                        <Form.Group controlId={contact.id} key={contact.id}>
                            <Form.Check
                                type="checkbox"
                                value={selectedContactIds.includes(contact.id)}
                                label={contact.name}
                                onChange={() => {
                                    handleCheckboxChange(contact.id)
                                }}
                            />
                        </Form.Group>
                    ))}
                    <Button type="submit">Create</Button>
                </Form>
            </Modal.Body>
        </div>
    );
};

export default NewConversationModal;