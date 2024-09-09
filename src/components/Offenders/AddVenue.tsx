import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";

interface AddVenueProps {
  onVenueAdded: (venue: { name: string; email: string; phone: string }) => void;
}

const AddVenue: React.FC<AddVenueProps> = ({ onVenueAdded }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    const role = localStorage.getItem('role')
    if (role === 'admin') {
      e.preventDefault();
      onVenueAdded({ name, email, phone });
      setName("");
      setEmail("");
      setPhone("");
    } else {
      alert('No permission');
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </Form.Group>
        
        <Button type="submit">Add Offenders</Button>
      </Form>
    </Container>
  );
};

export default AddVenue;
