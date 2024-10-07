import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useAuth } from "../context/auth.context.tsx";
import { useApi } from "../util/apiUtil.tsx";
import StatCard from "./dashboard/StatCard.tsx";
import RecentWarnings from "./dashboard/RecentWarnings.tsx";
import RecentIncidents from "./dashboard/RecentIncidents.tsx";
import RecentBans from "./dashboard/RecentBans.tsx";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { fetchWithAuth } = useApi();
  const [stats, setStats] = useState({
    totalIncidents: 0,
    totalWarnings: 0,
    totalBans: 0,
    totalVenues: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await fetchWithAuth("/api/dashboard/stats");
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="mt-4">
      <h1>Welcome to the Dashboard</h1>
      <p>You are logged in as: {user.email}</p>
      <p>Your role is: {user.role}</p>
      
      <Row className="mt-4">
        <Col md={3}>
          <StatCard title="Total Incidents" value={stats.totalIncidents} />
        </Col>
        <Col md={3}>
          <StatCard title="Total Warnings" value={stats.totalWarnings} />
        </Col>
        <Col md={3}>
          <StatCard title="Total Bans" value={stats.totalBans} />
        </Col>
        <Col md={3}>
          <StatCard title="Total Venues" value={stats.totalVenues} />
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Recent Warnings</Card.Title>
              <RecentWarnings />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Recent Incidents</Card.Title>
              <RecentIncidents />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Recent Bans</Card.Title>
              <RecentBans />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
