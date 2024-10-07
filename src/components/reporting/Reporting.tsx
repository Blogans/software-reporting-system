import React, { useState } from 'react';
import { Container, Alert, Table } from 'react-bootstrap';
import { useApi } from '../../util/apiUtil';
import GenerateReportForm from './GenerateReportForm';

interface ReportData {
  startDate: string;
  endDate: string;
  totalIncidents: number;
  incidents: Array<{
    date: string;
    description: string;
    venue: string;
    submittedBy: string;
  }>;
}

const Reporting: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const { fetchWithAuth } = useApi();

  const handleGenerateReport = async (startDate: string, endDate: string) => {
    try {
      const response = await fetchWithAuth('/api/reports/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, endDate })
      });

      setReportData(response);
      setError(null);
    } catch (err) {
      setError('Error generating report. Please try again.');
      console.error('Error generating report:', err);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Generate Incident Report</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <GenerateReportForm onGenerateReport={handleGenerateReport} />
      
      {reportData && (
        <div className="mt-4">
          <h3>Report Results</h3>
          <p>Date Range: {reportData.startDate} to {reportData.endDate}</p>
          <p>Total Incidents: {reportData.totalIncidents}</p>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Venue</th>
                <th>Submitted By</th>
              </tr>
            </thead>
            <tbody>
              {reportData.incidents.map((incident, index) => (
                <tr key={index}>
                  <td>{new Date(incident.date).toLocaleString()}</td>
                  <td>{incident.description}</td>
                  <td>{incident.venue}</td>
                  <td>{incident.submittedBy}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default Reporting;