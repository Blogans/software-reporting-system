import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Offender } from "../../types/types";

interface EditOffenderProps {
  offender: Offender;
  onOffenderEdited: (updatedOffender: Partial<Offender>) => void;
}

const EditOffender: React.FC<EditOffenderProps> = ({ offender, onOffenderEdited }) => {
  const [firstName, setOffenderFirstName] = useState(offender.firstName);
  const [lastName, setOffenderLastName] = useState(offender.lastName);
  const [dateOfBirth, setDateOfBirth] = useState(offender.dateOfBirth);

  useEffect(() => {
    setOffenderFirstName(offender.firstName);
    setOffenderLastName(offender.lastName);
    setDateOfBirth(offender.dateOfBirth);
  }, [offender]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOffenderEdited({
      _id: offender._id,
      firstName,
      lastName,
      dateOfBirth,
    });
  };

  return (
    <Container>
      <h2>Edit Offender</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            value={firstName}
            onChange={(e) => setOffenderFirstName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            value={lastName}
            onChange={(e) => setOffenderLastName(e.target.value)}
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

        <Button type="submit">Update Offender</Button>
      </Form>
    </Container>
  );
};

export default EditOffender;
