import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Offender } from "../../types/types";

interface EditOffenderProps {
  offender: Offender;
  onOffenderEdited: (updatedOffender: Partial<Offender>) => void;
}

const EditOffender: React.FC<EditOffenderProps> = ({ offender, onOffenderEdited }) => {
  const [username, setOffenderUsername] = useState(offender.username);
  const [email, setOffenderEmail] = useState(offender.email);
  const [incident, setIncident] = useState(offender.incident);

  useEffect(() => {
    setOffenderUsername(offender.username);
    setOffenderEmail(offender.email);
    setIncident(offender.incident);
  }, [offender]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOffenderEdited({
      _id: offender._id,
      username,
      email,
      incident
    });
  };

  return (
    <Container>
      <h2>Edit Offender</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setOffenderUsername(e.target.value)}
            required
          />
        </Form.Group>


        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
              type="text"
              value={email}
              onChange={(e) => setOffenderEmail(e.target.value)}
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

        <Button type="submit">Update Offender</Button>
      </Form>
    </Container>
  );
};

export default EditOffender;
