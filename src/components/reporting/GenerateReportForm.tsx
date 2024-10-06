import React, { useState } from 'react';
import { Container, Alert, Form, Button } from 'react-bootstrap';
import { useApi } from '../../util/apiUtil';

const GenerateReportForm: React.FC<{ onGenerateReport: (startDate: string, endDate: string) => void }> = ({ onGenerateReport }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onGenerateReport(startDate, endDate);
    };
  
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit">Generate Report</Button>
      </Form>
    );
  };
  
  export default GenerateReportForm;