import { set } from "mongoose";
import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

interface AddOffenderProps {
  onOffenderAdded: (contact: any) => void;
}

const AddOffender: React.FC<AddOffenderProps> = ({ onOffenderAdded }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [incident, setIncident] = useState("");
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
        body: JSON.stringify({ username, email, incident}),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to add contact");
      }

      const newOffender = await response.json();
      onOffenderAdded(newOffender);
      setUsername("");
      setEmail("");
      setIncident("");
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
          <Form.Label>Username</Form.Label>
          <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
          />
        </Form.Group>



        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Incident</Form.Label>
          <Form.Control
              type="text"
              value={incident}
              onChange={(e) => setIncident(e.target.value)}
              required
          />
        </Form.Group>




        <Button type="submit">Add Offender</Button>
      </Form>
  );
};

export default AddOffender;
