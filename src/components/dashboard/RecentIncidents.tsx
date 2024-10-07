import React, { useState, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import { useApi } from "../../util/apiUtil";
import { Incident } from "../../types/types";

const RecentIncidents: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const { fetchWithAuth } = useApi();

  useEffect(() => {
    fetchRecentIncidents();
  }, []);

  const fetchRecentIncidents = async () => {
    try {
      const data = await fetchWithAuth("/api/dashboard/recent/incidents");
      setIncidents(data);
    } catch (error) {
      console.error("Error fetching recent incidents:", error);
    }
  };

  return (
    <ListGroup>
      {incidents.map((incident) => (
        <ListGroup.Item key={incident._id}>
          {incident.venue.name} - {new Date(incident.date).toLocaleDateString()}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default RecentIncidents;