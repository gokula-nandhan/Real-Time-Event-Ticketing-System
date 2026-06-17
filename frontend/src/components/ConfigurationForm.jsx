import React, { useState } from 'react';
import axios from 'axios';
import './ConfigurationForm.css';

const ConfigurationForm = ({ isRunning, setIsConfigured, addLog }) => {
  const [config, setConfig] = useState({
    totalTickets: '100',
    ticketReleaseRate: '2',
    customerRetrievalRate: '3',
    maxTicketCapacity: '50',
    vendorCount: '3',
    customerCount: '5',
    customerTicketQuantity: '5'
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [backendError, setBackendError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear specific error on change
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    let tempErrors = {};
    const {
      totalTickets,
      ticketReleaseRate,
      customerRetrievalRate,
      maxTicketCapacity,
      vendorCount,
      customerCount,
      customerTicketQuantity
    } = config;

    const checkPositiveInteger = (val, name) => {
      const num = Number(val);
      if (!val || isNaN(num) || num <= 0 || !Number.isInteger(num)) {
        tempErrors[name] = 'Must be a positive integer (> 0)';
        return null;
      }
      return num;
    };

    const tTickets = checkPositiveInteger(totalTickets, 'totalTickets');
    const tRelease = checkPositiveInteger(ticketReleaseRate, 'ticketReleaseRate');
    const cRetrieval = checkPositiveInteger(customerRetrievalRate, 'customerRetrievalRate');
    const mCapacity = checkPositiveInteger(maxTicketCapacity, 'maxTicketCapacity');
    const vCount = checkPositiveInteger(vendorCount, 'vendorCount');
    const cCount = checkPositiveInteger(customerCount, 'customerCount');
    const cQuantity = checkPositiveInteger(customerTicketQuantity, 'customerTicketQuantity');

    if (tRelease !== null && (tRelease < 1 || tRelease > 10)) {
      tempErrors.ticketReleaseRate = 'Rate must be between 1 and 10';
    }
    if (cRetrieval !== null && (cRetrieval < 1 || cRetrieval > 10)) {
      tempErrors.customerRetrievalRate = 'Rate must be between 1 and 10';
    }
    if (tTickets !== null && mCapacity !== null && (mCapacity < 1 || mCapacity > tTickets)) {
      tempErrors.maxTicketCapacity = `Capacity must be between 1 and Total Tickets (${tTickets})`;
    }
    if (tTickets !== null && cQuantity !== null && (cQuantity < 1 || cQuantity > tTickets)) {
      tempErrors.customerTicketQuantity = `Quantity must be between 1 and Total Tickets (${tTickets})`;
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setBackendError('');

    if (!validate()) {
      addLog('Configuration failed: Frontend validation errors.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/simulation/configure', {
        totalTickets: parseInt(config.totalTickets, 10),
        ticketReleaseRate: parseInt(config.ticketReleaseRate, 10),
        customerRetrievalRate: parseInt(config.customerRetrievalRate, 10),
        maxTicketCapacity: parseInt(config.maxTicketCapacity, 10),
        vendorCount: parseInt(config.vendorCount, 10),
        customerCount: parseInt(config.customerCount, 10),
        customerTicketQuantity: parseInt(config.customerTicketQuantity, 10)
      });

      setSuccessMessage(response.data || 'Configuration accepted successfully!');
      setIsConfigured(true);
      addLog(`System successfully configured. Parameters: [Total Tickets: ${config.totalTickets}, Release Rate: ${config.ticketReleaseRate}/s, Retrieval Rate: ${config.customerRetrievalRate}/s, Max Capacity: ${config.maxTicketCapacity}, Vendors: ${config.vendorCount}, Customers: ${config.customerCount}, Ticket Qty/Customer: ${config.customerTicketQuantity}]`);
    } catch (err) {
      console.error(err);
      setIsConfigured(false);
      if (err.response && err.response.status === 400) {
        setBackendError(err.response.data || 'Validation failed on backend.');
        addLog(`Configuration rejected by backend: ${err.response.data}`);
      } else {
        setBackendError('Failed to connect to the backend server. Make sure it is running on port 8080.');
        addLog('Configuration failed: Connection to backend could not be established.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`config-container card ${isRunning ? 'disabled-form' : ''}`}>
      <h2 id="config-title">System Configuration</h2>
      
      {isRunning && (
        <div className="running-notice">
          Simulation is currently running. Stop the simulation to modify configuration parameters.
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="totalTickets">Total Tickets</label>
            <input
              type="number"
              id="totalTickets"
              name="totalTickets"
              placeholder="e.g. 100"
              value={config.totalTickets}
              onChange={handleInputChange}
              disabled={isRunning || loading}
              className={errors.totalTickets ? 'input-error' : ''}
            />
            {errors.totalTickets && <span className="error-text">{errors.totalTickets}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="maxTicketCapacity">Max Ticket Pool Capacity</label>
            <input
              type="number"
              id="maxTicketCapacity"
              name="maxTicketCapacity"
              placeholder="e.g. 50"
              value={config.maxTicketCapacity}
              onChange={handleInputChange}
              disabled={isRunning || loading}
              className={errors.maxTicketCapacity ? 'input-error' : ''}
            />
            {errors.maxTicketCapacity && <span className="error-text">{errors.maxTicketCapacity}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="ticketReleaseRate">Ticket Release Rate (1-10s)</label>
            <input
              type="number"
              id="ticketReleaseRate"
              name="ticketReleaseRate"
              placeholder="e.g. 2"
              value={config.ticketReleaseRate}
              onChange={handleInputChange}
              disabled={isRunning || loading}
              className={errors.ticketReleaseRate ? 'input-error' : ''}
            />
            {errors.ticketReleaseRate && <span className="error-text">{errors.ticketReleaseRate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="customerRetrievalRate">Customer Retrieval Rate (1-10s)</label>
            <input
              type="number"
              id="customerRetrievalRate"
              name="customerRetrievalRate"
              placeholder="e.g. 3"
              value={config.customerRetrievalRate}
              onChange={handleInputChange}
              disabled={isRunning || loading}
              className={errors.customerRetrievalRate ? 'input-error' : ''}
            />
            {errors.customerRetrievalRate && <span className="error-text">{errors.customerRetrievalRate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="vendorCount">Number of Vendors</label>
            <input
              type="number"
              id="vendorCount"
              name="vendorCount"
              placeholder="e.g. 3"
              value={config.vendorCount}
              onChange={handleInputChange}
              disabled={isRunning || loading}
              className={errors.vendorCount ? 'input-error' : ''}
            />
            {errors.vendorCount && <span className="error-text">{errors.vendorCount}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="customerCount">Number of Customers</label>
            <input
              type="number"
              id="customerCount"
              name="customerCount"
              placeholder="e.g. 5"
              value={config.customerCount}
              onChange={handleInputChange}
              disabled={isRunning || loading}
              className={errors.customerCount ? 'input-error' : ''}
            />
            {errors.customerCount && <span className="error-text">{errors.customerCount}</span>}
          </div>

          <div className="form-group full-width-input">
            <label htmlFor="customerTicketQuantity">Customer Ticket Quantity per Retrieval</label>
            <input
              type="number"
              id="customerTicketQuantity"
              name="customerTicketQuantity"
              placeholder="e.g. 5"
              value={config.customerTicketQuantity}
              onChange={handleInputChange}
              disabled={isRunning || loading}
              className={errors.customerTicketQuantity ? 'input-error' : ''}
            />
            {errors.customerTicketQuantity && <span className="error-text">{errors.customerTicketQuantity}</span>}
          </div>
        </div>

        {successMessage && <div className="success-banner" id="config-success">{successMessage}</div>}
        {backendError && <div className="error-banner" id="config-error">{backendError}</div>}

        <button
          type="submit"
          id="configure-btn"
          className="btn btn-primary"
          disabled={isRunning || loading}
        >
          {loading ? 'Configuring...' : 'Configure System'}
        </button>
      </form>
    </div>
  );
};

export default ConfigurationForm;
