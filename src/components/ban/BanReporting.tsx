import React, { useState, useEffect, ChangeEvent } from 'react';
import { Container, Form, Button, ListGroup, Alert } from 'react-bootstrap';
import { useApi } from '../../util/apiUtil';
import { usePermissions } from '../../util/usePermissions';
import { Ban, Offender, Warning } from '../../types/types';

const BanManagement: React.FC = () => {
  const [bans, setBans] = useState<Ban[]>([]);
  const [offenders, setOffenders] = useState<Offender[]>([]);
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [date, setDate] = useState('');
  const [offenderId, setOffenderId] = useState('');
  const [selectedWarnings, setSelectedWarnings] = useState<string[]>([]);
  const [selectedWarning, setSelectedWarning] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { fetchWithAuth } = useApi();
  const { hasPermission } = usePermissions();

  useEffect(() => {
    fetchBans();
    fetchOffenders();
  }, []);

  const fetchBans = async () => {
    try {
      const data = await fetchWithAuth('/api/bans');
      setBans(data);
    } catch (err) {
      setError('Error fetching bans');
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

  const fetchWarningsForOffender = async (offenderId: string) => {
    try {
      const data = await fetchWithAuth(`/api/warnings/offender/${offenderId}`);
      console.log(data);
      setWarnings(data);
    } catch (err) {
      setError('Error fetching warnings for offender');
    }
  };

  const handleOffenderChange = (e: ChangeEvent<HTMLElement>) => {
    if (e.target instanceof HTMLSelectElement) {
      const newOffenderId = e.target.value;
      setOffenderId(newOffenderId);
      if (newOffenderId) {
        fetchWarningsForOffender(newOffenderId);
      } else {
        setWarnings([]);
      }
      setSelectedWarnings([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetchWithAuth('/api/bans', {
        method: 'POST',
        body: JSON.stringify({ date, offender: offenderId, warnings: selectedWarnings }),
      });
      setBans([...bans, response.ban]);
      setDate('');
      setOffenderId('');
      setSelectedWarnings([]);
    } catch (err) {
      setError('Error submitting ban');
    }
  };

  const handleAddWarning = () => {
    if (selectedWarning && !selectedWarnings.includes(selectedWarning)) {
      setSelectedWarnings([...selectedWarnings, selectedWarning]);
      setSelectedWarning('');
    }
  };

  const handleRemoveWarning = (warningId: string) => {
    setSelectedWarnings(selectedWarnings.filter(id => id !== warningId));
  };

  const handleDeleteBan = async (banId: string) => {
    try {
      await fetchWithAuth(`/api/bans/${banId}`, {
        method: 'DELETE',
      });
      setBans(bans.filter(b => b._id !== banId));
    } catch (err) {
      setError('Error deleting ban');
    }
  };

  return (
    <Container className="mt-4">
      <h2>Ban Management</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      
      {hasPermission('MANAGE_BANS') && (
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
            onChange={handleOffenderChange}
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
            <Form.Label>Add Warnings</Form.Label>
            <div className="d-flex">
              <Form.Control
                as="select"
                value={selectedWarning}
                onChange={(e) => setSelectedWarning(e.target.value)}
              >
                <option value="">Select a warning</option>
                {warnings.map((warning) => (
                  <option key={warning._id} value={warning._id}>
                    {new Date(warning.date).toLocaleDateString()} - {warning.incidents.length} incident(s)
                  </option>
                ))}
              </Form.Control>
              <Button onClick={handleAddWarning} className="ml-2">Add</Button>
            </div>
          </Form.Group>
          <ListGroup className="mb-3">
            {selectedWarnings.map((warningId) => {
              const warning = warnings.find(w => w._id === warningId);
              return (
                <ListGroup.Item key={warningId} className="d-flex justify-content-between align-items-center">
                  {warning ? `${new Date(warning.date).toLocaleDateString()} - ${warning.incidents.length} incident(s)` : 'Unknown Warning'}
                  <Button variant="danger" size="sm" onClick={() => handleRemoveWarning(warningId)}>Remove</Button>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
          <Button variant="primary" type="submit">
            Submit Ban
          </Button>
        </Form>
      )}

      <h3 className="mt-4">Active Bans</h3>
      <ListGroup>
        {bans.map((ban) => (
          <ListGroup.Item key={ban._id} className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Date:</strong> {new Date(ban.date).toLocaleDateString()}<br />
              <strong>Offender:</strong> {`${ban.offender.firstName} ${ban.offender.lastName}`}<br />
              <strong>Warnings:</strong> {ban.warnings.length}<br />
              <strong>Submitted by:</strong> {ban.submittedBy.username || 'Unknown'}
            </div>
            {hasPermission('MANAGE_BANS') && (
              <Button variant="danger" onClick={() => handleDeleteBan(ban._id)}>
                Delete
              </Button>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default BanManagement;