import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Venue } from "../../types/types";

interface EditVenueProps {
  venue: Venue;
  onVenueEdited: (updatedVenue: Partial<Venue>) => void;
}

const EditVenue: React.FC<EditVenueProps> = ({ venue, onVenueEdited }) => {
  const [name, setName] = useState(venue.name);
  const [address, setAddress] = useState(venue.address);

  useEffect(() => {
    setName(venue.name);
    setAddress(venue.address);
  }, [venue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVenueEdited({
      _id: venue._id,
      name,
      address,
    });
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="venueName">
          <Form.Label>Venue Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="venueAddress">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit">Save Changes</Button>
      </Form>
    </Container>
  );
};

export default EditVenue;
