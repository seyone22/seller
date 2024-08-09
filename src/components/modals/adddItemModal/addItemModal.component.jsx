'use client'
import styles from './addItemModal.module.css'
import {useState} from "react";
import {Button, Modal} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {pushItemToAPI} from "@/services/client/item.service";

const AddItemModal = ({ show, handleClose, onItemAdded }) => {
    const [newItem, setNewItem] = useState({})
    const [isValid, setIsValid] = useState(true);

    const handleAddNewItem = () => {
        console.log(newItem)
        pushItemToAPI(newItem).then(() => {
            handleClose();
            onItemAdded();
        })
    };

    const handleItemChange = (e) => {
        setNewItem({ ...newItem, itemCode: e.target.value });
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add new Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="itemCode">
                        <Form.Label>Item Code</Form.Label>
                        <Form.Control
                            type="text"
                            value={newItem.itemCode}
                            onChange={(e) => setNewItem({ ...newItem, itemCode: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            value={newItem.description}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group controlId="price">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type="number"
                            value={newItem.price}
                            onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                        />
                    </Form.Group>
                    <Form.Group controlId="quantity">
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control
                            type="number"
                            value={newItem.quantity}
                            onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={handleAddNewItem}>Add Item</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddItemModal;