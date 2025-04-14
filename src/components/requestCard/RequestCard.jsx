import React from 'react';
import { Card } from 'react-bootstrap';

const RequestCard = ({ request }) => {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Card.Title className="fw-bold">{request.nome}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          DRT: {request.drt} | Plantão: {request.plantao}
        </Card.Subtitle>
        <Card.Text>
          <strong>Materiais:</strong><br />
          {request.materiais}
        </Card.Text>
        <Card.Text>
          <strong>Status:</strong> {request.status}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default RequestCard;
