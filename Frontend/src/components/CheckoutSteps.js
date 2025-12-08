import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CheckoutSteps.css';

const CheckoutSteps = ({ activeStep }) => {
  const navigate = useNavigate();

  return (
    <div className="checkout-steps-container">
      {/* Step 1: Address */}
      <div 
        className={`step-item ${activeStep === 'address' ? 'active' : 'completed'}`}
        onClick={() => navigate('/checkout')}
      >
        <span className="step-label">Address</span>
      </div>

      <div className="step-line"></div>

      {/* Step 2: Shipping */}
      <div 
        className={`step-item ${activeStep === 'shipping' ? 'active' : ''} ${activeStep === 'payment' ? 'completed' : ''}`}
        onClick={() => activeStep !== 'address' && navigate('/shipping')}
        style={{ cursor: activeStep === 'address' ? 'not-allowed' : 'pointer' }}
      >
        <span className="step-label">Shipping</span>
      </div>

      <div className="step-line"></div>

      {/* Step 3: Payment */}
      <div 
        className={`step-item ${activeStep === 'payment' ? 'active' : ''}`}
      >
        <span className="step-label">Payment</span>
      </div>
    </div>
  );
};

export default CheckoutSteps;