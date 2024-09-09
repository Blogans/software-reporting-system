import React, { useState, useEffect } from "react";
import { Form, Button, ListGroup } from "react-bootstrap";
import { Contact } from "../../types/types";
import { usePermissions } from "../../util/usePermissions";
import { useApi } from "../../util/apiUtil";

interface AddContactToVenueProps {
  venueId: string;
  onContactAdded: () => void;
}

const AddContactToVenue: React.FC<AddContactToVenueProps> = ({
  venueId,
  onContactAdded,
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<string>("");
  const { hasPermission } = usePermissions();
  const { fetchWithAuth } = useApi();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const data = await fetchWithAuth("/api/contacts");
      setContacts(data);
    } catch (err) {
      // Error handled elsewhere
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact) return;

    try {
      const response = await fetch(
        `/api/venues/${venueId}/contacts/${selectedContact}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        onContactAdded();
        setSelectedContact("");
      }
    } catch (error) {
      console.error("Error adding contact to venue:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Select a contact to add:</Form.Label>
        <Form.Control
          as="select"
          value={selectedContact}
          onChange={(e) => setSelectedContact(e.target.value)}
        >
          <option value="">Select a contact</option>
          {contacts.map((contact) => (
            <option key={contact._id} value={contact._id}>
              {contact.firstName} {contact.lastName}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Button type="submit" disabled={!selectedContact}>
        Add Contact to Venue
      </Button>
    </Form>
  );
};

export default AddContactToVenue;
