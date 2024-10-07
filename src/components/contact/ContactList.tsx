import React, { useState, useEffect, useCallback } from "react";
import { Container, ListGroup, Button, Modal } from "react-bootstrap";
import { Contact } from "../../types/types";
import AddContact from "./AddContact";
import EditContact from "./EditContact";
import SearchBar from "../SearchBar";
import { usePermissions } from "../../util/usePermissions";
import { useApi } from "../../util/apiUtil";

const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [error, setError] = useState<string | null>(null);
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
      // Error handled elseewhere
    }
  };

  const handleAddContact = (newContact: Contact) => {
    setContacts([...contacts, newContact]);
    setShowAddModal(false);
  };

  const handleEditContact = async (updatedContact: Partial<Contact>) => {
    try {
      const response = await fetchWithAuth(`/api/contacts/${updatedContact._id}`, {
        method: "PUT",
        body: JSON.stringify(updatedContact),
      });

      const editedContact = response.contact;
      setContacts(
        contacts.map((contact) => (contact._id === editedContact._id ? editedContact : contact))
      );
      setShowEditModal(false);
      console.log(editedContact);

      // Clear any previous errors
      setError(null);
    } catch (err) {
      console.error("Error editing contact:", err);
      // The error message from the server will be in err.message
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to delete contact");
      }
      setContacts(contacts.filter((contact) => contact._id !== contactId));
    } catch (err) {
      setError("Error deleting contact");
      console.error("Error in handleDeleteContact:", err);
    }
  };

  const handleShowEditModal = (contact: Contact) => {
    setSelectedContact(contact);
    setShowEditModal(true);
  };

  const filterContacts = useCallback(
    (contact: Contact, searchTerm: string) =>
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchTerm.toLowerCase()),
    []
  );

  const handleFilter = useCallback((filteredItems: Contact[]) => {
    setFilteredContacts(filteredItems);
  }, []);

  return (
    <Container className="mt-4">
      <h2>Contacts</h2>
      {error && <p className="text-danger">{error}</p>}
      <SearchBar<Contact>
        items={contacts}
        onFilter={handleFilter}
        filterFunction={filterContacts}
        placeholder="Search contact by name, email or phone"
      />
      <ListGroup>
        {filteredContacts.length === 0 && <p>No contacts found</p>}
        {filteredContacts.map((contact) => (
          <ListGroup.Item
            key={contact._id}
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <h3>
                {contact.firstName} {contact.lastName}
              </h3>
              <p>Email: {contact.email}</p>
              <p>Phone: {contact.phone}</p>
            </div>
            <div>
              {hasPermission("MANAGE_CONTACTS") && (
                <>
                  <Button
                variant="info"
                className="me-2"
                    onClick={() => handleShowEditModal(contact)}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteContact(contact._id)}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
      {hasPermission("MANAGE_CONTACTS") && (
        <Button
          className="mt-3"
          variant="primary"
          onClick={() => setShowAddModal(true)}
        >
          Add New Contact
        </Button>
      )}

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddContact onContactAdded={handleAddContact} />
        </Modal.Body>
      </Modal>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedContact && (
            <EditContact contact={selectedContact} onContactEdited={handleEditContact} />
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ContactList;
