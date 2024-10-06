import React, { useState } from 'react';
import { Container, Alert } from 'react-bootstrap';
import { useApi } from '../../util/apiUtil';
import GenerateReportForm from './GenerateReportForm';

const ReportingPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { fetchWithAuth } = useApi();

  const handleGenerateReport = async (startDate: string, endDate: string) => {
    try {
      const response = await fetchWithAuth('/api/reports/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, endDate })
      });

      if (response.headers.get('Content-Type') === 'text/csv') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'incident_report.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setError(null);
      } else {
        throw new Error('Unexpected response type');
      }
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
    </Container>
  );
};

export default ReportingPage;