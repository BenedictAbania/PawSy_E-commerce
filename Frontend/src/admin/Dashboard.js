import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faUsers, faDollarSign, faShoppingBag } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const stats = [
    { title: 'Total Products', value: '45', icon: faBox, color: 'text-primary' },
    { title: 'Total Users', value: '1,203', icon: faUsers, color: 'text-info' },
    { title: 'Total Sales', value: '$12,450', icon: faDollarSign, color: 'text-success' },
    { title: 'Orders', value: '12', icon: faShoppingBag, color: 'text-warning' },
  ];

  return (
    <div>
      <h3 className="mb-4 text-dark fw-bold">Dashboard Overview</h3>
      <Row>
        {stats.map((stat, index) => (
          <Col md={3} className="mb-4" key={index}>
            <Card className="border-0 shadow-sm p-3">
              <div className="d-flex align-items-center">
                <div className={`rounded-circle bg-light p-3 me-3 ${stat.color}`}>
                  <FontAwesomeIcon icon={stat.icon} size="lg" />
                </div>
                <div>
                  <h6 className="text-muted mb-1 small fw-bold">{stat.title}</h6>
                  <h3 className="fw-bold mb-0">{stat.value}</h3>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Dashboard;