import React, { useState, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import { useApi } from "../../util/apiUtil";
import { Ban } from "../../types/types";

const RecentBans: React.FC = () => {
  const [bans, setBans] = useState<Ban[]>([]);
  const { fetchWithAuth } = useApi();

  useEffect(() => {
    fetchRecentBans();
  }, []);

  const fetchRecentBans = async () => {
    try {
      const data = await fetchWithAuth("/api/dashboard/recent/bans");
      setBans(data);
    } catch (error) {
      console.error("Error fetching recent bans:", error);
    }
  };

  return (
    <ListGroup>
      {bans.map((ban) => (
        <ListGroup.Item key={ban._id}>
          {ban.offender.firstName} {ban.offender.lastName} - {new Date(ban.date).toLocaleDateString()}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default RecentBans;
