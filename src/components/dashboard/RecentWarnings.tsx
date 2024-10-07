import React, { useState, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import { useApi } from "../../util/apiUtil";
import { Warning } from "../../types/types";

const RecentWarnings: React.FC = () => {
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const { fetchWithAuth } = useApi();

  useEffect(() => {
    fetchRecentWarnings();
  }, []);

  const fetchRecentWarnings = async () => {
    try {
      const data = await fetchWithAuth("/api/dashboard/recent/warnings");
      setWarnings(data);
    } catch (error) {
      console.error("Error fetching recent warnings:", error);
    }
  };

  return (
    <ListGroup>
      {warnings.map((warning) => (
        <ListGroup.Item key={warning._id}>
          {warning.offender.firstName} {warning.offender.lastName} - {new Date(warning.date).toLocaleDateString()}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default RecentWarnings;