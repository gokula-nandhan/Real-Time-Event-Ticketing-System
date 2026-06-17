import React from 'react';
import './TicketStatus.css';

const TicketStatus = ({ status, isConfigured }) => {
  const isDataAvailable = status && typeof status.ticketPoolSize !== 'undefined';

  if (!isConfigured && !isDataAvailable) {
    return (
      <div className="ticket-status-container card waiting">
        <h2 id="status-title">Live Ticket Status</h2>
        <div className="waiting-placeholder">
          <div className="loader-ring"></div>
          <p>Waiting for system configuration...</p>
        </div>
      </div>
    );
  }

  const hasData = status && (status.totalTicketsAdded > 0 || status.ticketPoolSize > 0 || status.running);
  const poolSize = hasData ? (status?.ticketPoolSize ?? 0) : '—';
  const remainingCapacity = hasData ? (status?.remainingTicketPoolSize ?? 0) : '—';
  const totalSold = hasData ? (status?.totalTicketsAdded ?? 0) : '—';
  const remainingToAdd = hasData ? (status?.remainingTicketsToAdd ?? 0) : '—';

  return (
    <div className="ticket-status-container card">
      <h2 id="status-title">Live Ticket Status</h2>
      <div className="stats-grid">
        <div className="stat-card" id="stat-pool-size">
          <div className="stat-indicator cyan"></div>
          <span className="stat-label">Current Pool Size</span>
          <span className="stat-value cyan-glow">{poolSize}</span>
        </div>
        
        <div className="stat-card" id="stat-remaining-capacity">
          <div className="stat-indicator purple"></div>
          <span className="stat-label">Remaining Pool Capacity</span>
          <span className="stat-value purple-glow">{remainingCapacity}</span>
        </div>

        <div className="stat-card" id="stat-total-sold">
          <div className="stat-indicator green"></div>
          <span className="stat-label">Total Tickets Sold</span>
          <span className="stat-value green-glow">{totalSold}</span>
        </div>

        <div className="stat-card" id="stat-remaining-to-add">
          <div className="stat-indicator amber"></div>
          <span className="stat-label">Remaining to Add</span>
          <span className="stat-value amber-glow">{remainingToAdd}</span>
        </div>
      </div>
    </div>
  );
};

export default TicketStatus;
