import React, { useState, useEffect, useCallback } from "react";
import { Container, ListGroup, Button, Modal } from "react-bootstrap";
import { Venue, Contact } from "../../types/types";
import AddVenue from "./AddVenue";
import EditVenue from "./EditVenue";
import { usePermissions } from "../../util/usePermissions";
import { useApi } from "../../util/apiUtil";
import SearchBar from "../SearchBar";
import ItemListAndAdd from "../ItemListAndAdd";

const VenueList: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [venueContacts, setVenueContacts] = useState<Contact[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { hasPermission } = usePermissions();
  const { fetchWithAuth } = useApi();

  const getContactName = (contact: Contact) =>
    contact.firstName + " " + contact.lastName;

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const data = await fetchWithAuth("/api/venues");
      setVenues(data);
    } catch (err) {
      setError("Error fetching venues");
    }
  };

  const handleAddVenue = async (newVenue: { name: string; address: string }) => {
    try {
      const response = await fetchWithAuth("/api/venues", {
        method: "POST",
        body: JSON.stringify(newVenue),
      });

      const addedVenue = response.venue;
      setVenues([...venues, addedVenue]);
      setShowAddModal(false);
    } catch (err) {
      setError("Error adding venue");
    }
  };

  const handleEditVenue = async (updatedVenue: Partial<Venue>) => {
    try {
      const response = await fetchWithAuth(`/api/venues/${updatedVenue._id}`, {
        method: "PUT",
        body: JSON.stringify(updatedVenue),
      });

      const editedVenue = response.venue;
      setVenues(
        venues.map((venue) =>
          venue._id === editedVenue._id ? editedVenue : venue
        )
      );
      setShowEditModal(false);
      setError(null);
    } catch (err) {
      console.log(err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  const handleDeleteVenue = async (venueId: string) => {
    try {
      await fetchWithAuth(`/api/venues/${venueId}`, {
        method: "DELETE",
      });

      setVenues(venues.filter((venue) => venue._id !== venueId));
    } catch (err) {
      setError("Error deleting venue");
    }
  };

  const handleDeleteContactFromVenue = async (contactId: string) => {
    if (!selectedVenue) return;
    try {
      await fetchWithAuth(
        `/api/venues/${selectedVenue._id}/contacts/${contactId}`,
        {
          method: "DELETE",
        }
      );

      setVenueContacts(
        venueContacts.filter((contact) => contact._id !== contactId)
      );
    } catch (err) {
      setError("Error deleting contact from venue");
    }
  };

  const renderContact = (contact: Contact) => (
    <div>
      {contact.firstName} {contact.lastName} <br></br>
      Email: {contact.email} <br></br>
      Phone: {contact.phone}
    </div>
  );

  const fetchContacts = useCallback(async () => {
    const data = await fetchWithAuth("/api/contacts");
    return data;
  }, [fetchWithAuth]);

  const addContactToVenue = useCallback(
    async (venueId: string, contactId: string) => {
      try {
        await fetchWithAuth(`/api/venues/${venueId}/contacts/${contactId}`, {
          method: "POST",
        });
        setError(null);
      } catch (error) {
        setError("Error adding contact to venue");
      }
    },
    [fetchWithAuth]
  );

  const handleShowContacts = async (venue: Venue) => {
    setSelectedVenue(venue);
    try {
      const data = await fetchWithAuth(`/api/venues/${venue._id}/contacts`);
      setVenueContacts(data);
      setShowContactsModal(true);
    } catch (err) {
      setError("Error fetching venue contacts");
    }
  };

  const handleContactAdded = () => {
    if (selectedVenue) {
      handleShowContacts(selectedVenue);
    }
  };

  const filterVenues = useCallback(
    (venue: Venue, searchTerm: string) =>
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.address.toLowerCase().includes(searchTerm.toLowerCase()),
    []
  );

  const handleFilter = useCallback((filteredItems: Venue[]) => {
    setFilteredVenues(filteredItems);
  }, []);

  const handleShowEditModal = (venue: Venue) => {
    setSelectedVenue(venue);
    setShowEditModal(true);
  };

  return (
    <Container className="mt-4">
      <h2>Venues</h2>
      {error && <p className="text-danger">{error}</p>}

      <SearchBar<Venue>
        items={venues}
        onFilter={handleFilter}
        filterFunction={filterVenues}
        placeholder="Search Venues by name or address"
      />

      <ListGroup>
        {filteredVenues.length === 0 && <p>No venues found</p>}
        {filteredVenues.map((venue) => (
          <ListGroup.Item
            key={venue._id}
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <h3>{venue.name}</h3>
              <p>Address: {venue.address}</p>
              <Button onClick={() => handleShowContacts(venue)}>
                Manage Contacts
              </Button>
            </div>

            <div>
              {hasPermission("MANAGE_VENUES") && (
                <>
                  <Button
                variant="info"
                className="me-2"
                    onClick={() => handleShowEditModal(venue)}
                  >
                    Edit
                  </Button>{" "}

                  <Button
                    variant="danger"
                    onClick={() => handleDeleteVenue(venue._id)}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
      
      {hasPermission("MANAGE_VENUES") && (
        <Button
          className="mt-3"
          variant="primary"
          onClick={() => setShowAddModal(true)}
        >
          Add New Venue
        </Button>
      )}

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Venue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddVenue onVenueAdded={handleAddVenue} />
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Venue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVenue && (
            <EditVenue venue={selectedVenue} onVenueEdited={handleEditVenue} />
          )}
        </Modal.Body>
      </Modal>

      <Modal
        show={showContactsModal}
        onHide={() => setShowContactsModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Manage Contacts for {selectedVenue?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVenue && (
            <ItemListAndAdd<Contact>
              parentId={selectedVenue._id}
              items={venueContacts}
              onItemAdded={handleContactAdded}
              onDeleteItem={handleDeleteContactFromVenue}
              fetchItems={fetchContacts}
              addItemToParent={addContactToVenue}
              itemType="Contact"
              parentType="Venue"
              getItemName={getContactName}
              renderItem={renderContact}
              canDelete={hasPermission("MANAGE_VENUES")}
              canAdd={hasPermission("MANAGE_VENUES")}
            />
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default VenueList;