import { set } from "mongoose";
import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

interface AddOffenderProps {
  onOffenderAdded: (contact: any) => void;
}

const AddOffender: React.FC<AddOffenderProps> = ({ onOffenderAdded }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/offenders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, dateOfBirth}),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to add contact");
      }

      const newOffender = await response.json();
      onOffenderAdded(newOffender);
      setFirstName("");
      setLastName("");
      setDateOfBirth("");
    } catch (err) {
      setError("Error adding offender");
      console.error("Error in handleSubmit:", err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h3>Add New Offender</h3>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </Form.Group>


      <Form.Group>
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control 
              type="date" 
              value={dateOfBirth} 
              onChange={(e) => setDateOfBirth(e.target.value)} 
              required 
            />
      </Form.Group>

      <Button type="submit">Add Offender</Button>
    </Form>
  );
};

export default AddOffender;
