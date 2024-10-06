import React, { useState, useEffect } from 'react';
import { Container, Form, Button, ListGroup, Alert } from 'react-bootstrap';
import { useApi } from '../../util/apiUtil';
import { usePermissions } from '../../util/usePermissions';
import { Warning, Offender, Incident } from '../../types/types';

const WarningManagement: React.FC = () => {
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [offenders, setOffenders] = useState<Offender[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [date, setDate] = useState('');
  const [offenderId, setOffenderId] = useState('');
  const [selectedIncidents, setSelectedIncidents] = useState<string[]>([]);
  const [selectedIncident, setSelectedIncident] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { fetchWithAuth } = useApi();
  const { hasPermission } = usePermissions();

  useEffect(() => {
    fetchWarnings();
    fetchOffenders();
    fetchIncidents();
  }, []);

  const fetchWarnings = async () => {
    try {
      const data = await fetchWithAuth('/api/warnings');
      setWarnings(data);
    } catch (err) {
      setError('Error fetching warnings');
    }
  };

  const fetchOffenders = async () => {
    try {
      const data = await fetchWithAuth('/api/offenders');
      setOffenders(data);
    } catch (err) {
      setError('Error fetching offenders');
    }
  };

  const fetchIncidents = async () => {
    try {
      const data = await fetchWithAuth('/api/incidents');
      setIncidents(data);
    } catch (err) {
      setError('Error fetching incidents');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetchWithAuth('/api/warnings', {
        method: 'POST',
        body: JSON.stringify({ date, offender: offenderId, incidents: selectedIncidents }),
      });
      setWarnings([...warnings, response.warning]);
      setDate('');
      setOffenderId('');
      setSelectedIncidents([]);
    } catch (err) {
      setError('Error submitting warning');
    }
  };

  const handleAddIncident = () => {
    if (selectedIncident && !selectedIncidents.includes(selectedIncident)) {
      setSelectedIncidents([...selectedIncidents, selectedIncident]);
      setSelectedIncident('');
    }
  };

  const handleRemoveIncident = (incidentId: string) => {
    setSelectedIncidents(selectedIncidents.filter(id => id !== incidentId));
  };

  const handleDeleteWarning = async (warningId: string) => {
    try {
      await fetchWithAuth(`/api/warnings/${warningId}`, {
        method: 'DELETE',
      });
      setWarnings(warnings.filter(w => w._id !== warningId));
    } catch (err) {
      setError('Error deleting warning');
    }
  };

  return (
    <Container className="mt-4">
      <h2>Warning Management</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      
      {hasPermission('MANAGE_WARNINGS') && (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Offender</Form.Label>
            <Form.Control
              as="select"
              value={offenderId}
              onChange={(e) => setOffenderId(e.target.value)}
              required
            >
              <option value="">Select an offender</option>
              {offenders.map((offender) => (
                <option key={offender._id} value={offender._id}>
                  {offender.firstName} {offender.lastName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Add Incidents</Form.Label>
            <div className="d-flex">
              <Form.Control
                as="select"
                value={selectedIncident}
                onChange={(e) => setSelectedIncident(e.target.value)}
              >
                <option value="">Select an incident</option>
                {incidents.map((incident) => (
                  <option key={incident._id} value={incident._id}>
                    {new Date(incident.date).toLocaleDateString()} - {incident.description.substring(0, 80)}...
                  </option>
                ))}
              </Form.Control>
              <Button onClick={handleAddIncident} className="ml-2">Add</Button>
            </div>
          </Form.Group>
          <ListGroup className="mb-3">
            {selectedIncidents.map((incidentId) => {
              const incident = incidents.find(i => i._id === incidentId);
              return (
                <ListGroup.Item key={incidentId} className="d-flex justify-content-between align-items-center">
                  {incident ? `${new Date(incident.date).toLocaleDateString()} - ${incident.description.substring(0, 50)}...` : 'Unknown Incident'}
                  <Button variant="danger" size="sm" onClick={() => handleRemoveIncident(incidentId)}>Remove</Button>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
          <Button variant="primary" type="submit">
            Submit Warning
          </Button>
        </Form>
      )}

      <h3 className="mt-4">Recent Warnings</h3>
      <ListGroup>
        {warnings.map((warning) => (
          <ListGroup.Item key={warning._id} className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Date:</strong> {new Date(warning.date).toLocaleDateString()}<br />
              <strong>Offender:</strong> {`${warning.offender.firstName} ${warning.offender.lastName}`}<br />
              <strong>Incidents:</strong> {warning.incidents.length}<br />
              <strong>Submitted by:</strong> {warning.submittedBy.username || 'Unknown'}
            </div>
            {hasPermission('MANAGE_WARNINGS') && (
              <Button variant="danger" onClick={() => handleDeleteWarning(warning._id)}>
                Delete
              </Button>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default WarningManagement;