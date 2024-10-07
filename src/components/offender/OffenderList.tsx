import React, {useState, useEffect, useCallback} from "react";
import { Container, ListGroup, Button, Modal } from "react-bootstrap";
import {Offender, User} from "../../types/types";
import AddOffender from "./AddOffender";
import { usePermissions } from "../../util/usePermissions";
import { useApi } from "../../util/apiUtil";
import EditOffender from "./EditOffender";
import { off } from "process";
import SearchBar from "../SearchBar";
const ContactList: React.FC = () => {
  const [offenders, setOffenders] = useState<Offender[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOffender, setSelectedOffender] = useState<Offender | null>(null);
  const [filteredOffender, setFilteredOffender] = useState<Offender[]>([]);
  const { hasPermission } = usePermissions();
  const { fetchWithAuth } = useApi();

  useEffect(() => {
    fetchOffenders();
  }, []);

  const fetchOffenders = async () => {
    try {
      const data = await fetchWithAuth("/api/offenders");
      setOffenders(data);
    } catch (err) {
      // Error handled elseewhere
    }
  };

  const handleAddOffender = (newOffender: Offender) => {
    setOffenders([...offenders, newOffender]);
    setShowAddModal(false);
  };

  const handleShowEditModal = (offender: Offender) => {
    setSelectedOffender(offender);
    setShowEditModal(true);
  };

  const handleDeleteOffender = async (offenderId: string) => {
    try {
      const response = await fetch(`/api/offenders/${offenderId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to delete offender");
      }
      setOffenders(offenders.filter((offender) => offender._id !== offenderId));
    } catch (err) {
      setError("Error deleting offender");
      console.error("Error in handleDeleteOffender:", err);
    }
  };


  const handleEditOffender = async (updatedOffender: Partial<Offender>) => {
    try {
      const response = await fetchWithAuth(`/api/offenders/${updatedOffender._id}`, {
        method: "PUT",
        body: JSON.stringify(updatedOffender),
      });

      const editedOffender = response.offender;
      setOffenders(
        offenders.map((offender) =>
          offender._id === editedOffender._id ? editedOffender : offender
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

  const handleFilter = useCallback((filteredItems: Offender[]) => {
    setFilteredOffender(filteredItems);
  }, []);
  const filterOffenders = useCallback(
      (offender: Offender, searchTerm: string) =>
          offender.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          offender.email.toLowerCase().includes(searchTerm.toLowerCase()),
      []
  );

  return (
    <Container className="mt-4">
      <h2>Offenders</h2>
      {error && <p className="text-danger">{error}</p>}
      <SearchBar<Offender>
          items={offenders}
          onFilter={handleFilter}
          filterFunction={filterOffenders}
          placeholder="Search offenders by name or email"
      />
      <ListGroup>
        {filteredOffender.length === 0 && <p>No offenders found</p>}

        {filteredOffender.map((offender) => (
          <ListGroup.Item
            key={offender._id}
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <h3>
                {offender.username}
              </h3>
              <p>Email: {offender.email}</p>
              <p>Incident: {offender.incident}</p>
              {/*<p>Date of Birth: {new Date(offender.dateOfBirth).toLocaleDateString()}</p>*/}
            </div>

            <div>
              {hasPermission("MANAGE_OFFENDERS") && (
                <>
                  <Button
                variant="info"
                className="me-2"
                    onClick={() => handleShowEditModal(offender)}
                  >
                    Edit
                  </Button>{" "}

                  <Button
                    variant="danger"
                    onClick={() => handleDeleteOffender(offender._id)}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {hasPermission("MANAGE_OFFENDERS") && (

        <Button
          className="mt-3"
          variant="primary"
          onClick={() => setShowAddModal(true)}
        >
          Add New Offender
        </Button>
      )}

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Offender</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddOffender onOffenderAdded={handleAddOffender} />
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Offender</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOffender && (
            <EditOffender offender={selectedOffender} onOffenderEdited={handleEditOffender} />
          )}
        </Modal.Body>
      </Modal>


    </Container>
  );
};

export default ContactList;
