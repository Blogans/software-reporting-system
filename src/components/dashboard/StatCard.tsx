import React from "react";
import { Card } from "react-bootstrap";

interface StatCardProps {
  title: string;
  value: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text className="h2">{value}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default StatCard;