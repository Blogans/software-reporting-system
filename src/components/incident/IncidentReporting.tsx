import React, { useState, useEffect } from 'react';
import { Container, Form, Button, ListGroup, Alert } from 'react-bootstrap';
import { useApi } from '../../util/apiUtil';
import { usePermissions } from '../../util/usePermissions';
import { Incident, Venue } from '../../types/types';

const IncidentReporting: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [venues, setVenues] = useState<Venue[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { fetchWithAuth } = useApi();
  const { hasPermission } = usePermissions();

  useEffect(() => {
    fetchIncidents();
    fetchVenues();
  }, []);

  const fetchIncidents = async () => {
    try {
      const data = await fetchWithAuth('/api/incidents');
      setIncidents(data);
    } catch (err) {
      setError('Error fetching incidents');
    }
  };

  const fetchVenues = async () => {
    try {
      const data = await fetchWithAuth('/api/venues');
      setVenues(data);
    } catch (err) {
      setError('Error fetching venues');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetchWithAuth('/api/incidents', {
        method: 'POST',
        body: JSON.stringify({ date, description, venue }),
      });
      setIncidents([...incidents, response.incident]);
      setDate('');
      setDescription('');
      setVenue('');
    } catch (err) {
      setError('Error submitting incident');
    }
  };

  const handleDeleteIncident = async (incidentId: string) => {
    try {
      await fetchWithAuth(`/api/incidents/${incidentId}`, {
        method: 'DELETE',
      });
      setIncidents(incidents.filter(incident => incident._id !== incidentId));
    } catch (err) {
      setError('Error deleting incident');
    }
  };

  return (
    <Container className="mt-4">
      <h2>Incident Reporting</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      
      {hasPermission('MANAGE_INCIDENTS') && (
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
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Venue</Form.Label>
            <Form.Control
              as="select"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
            >
              <option value="">Select a venue</option>
              {venues.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit Incident
          </Button>
        </Form>
      )}

      <h3 className="mt-4">Recent Incidents</h3>
      <ListGroup>
        {incidents.map((incident) => (
          <ListGroup.Item key={incident._id} className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Date:</strong> {new Date(incident.date).toLocaleDateString()}<br />
              <strong>Description:</strong> {incident.description}<br />
              <strong>Venue:</strong> {incident.venue.name || 'Unknown'}<br />
              <strong>Submitted by:</strong> {incident.submittedBy.username || 'Unknown'}
            </div>
            {hasPermission('MANAGE_INCIDENTS') && (
              <Button variant="danger" onClick={() => handleDeleteIncident(incident._id)}>
                Delete
              </Button>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default IncidentReporting;