// Setup: run `npx create-react-app frontend` then replace src/ with these files
// Install axios: npm install axios
// Start: npm start (runs on http://localhost:3000)
// Make sure Spring Boot backend is running on http://localhost:8080 first

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ConfigurationForm from './components/ConfigurationForm';
import TicketStatus from './components/TicketStatus';
import ControlPanel from './components/ControlPanel';
import LogDisplay from './components/LogDisplay';
import './App.css';

function App() {
  const [status, setStatus] = useState(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [sessions, setSessions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('http://localhost:8080/simulation/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await axios.get('http://localhost:8080/simulation/history');
      setSessions(res.data);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    }
  };

  // Helper to add custom manual entries to the system log via status updates
  const addLog = useCallback((message) => {
    setStatus((prev) => ({
      ...prev,
      _manualLog: message,
      _ts: Date.now()
    }));
  }, []);

  // Fetch current simulation status from Spring Boot backend
  const fetchStatus = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8080/simulation/status');
      const data = response.data;
      
      setConnectionError(false);
      setIsLoading(false);

      if (data) {
        setStatus((prev) => {
          // Carry over manual logs metadata if present in state during polling updates
          return {
            ...data,
            _manualLog: prev?._manualLog,
            _ts: prev?._ts
          };
        });

        // Determine if simulation is running
        const runningState = data.running !== undefined ? data.running : (data.isRunning ?? false);
        setIsRunning(runningState);

        // Auto-configure detection if database has values already loaded
        if (data.remainingTicketsToAdd > 0 || data.totalTicketsAdded > 0 || data.ticketPoolSize > 0) {
          setIsConfigured(true);
        }
      }
      await fetchTransactions();
      await fetchSessions();
    } catch (err) {
      console.error('Error fetching simulation status:', err);
      setConnectionError(true);
      setIsLoading(false);
    }
  }, []);

  // Fetch status on initial mount to check if already configured or running
  useEffect(() => {
    fetchStatus();
    fetchTransactions();
    fetchSessions();
  }, [fetchStatus]);

  // Using polling (setInterval every 1000ms) for real-time sync as a simpler
  // alternative to WebSocket — fetches GET /simulation/status continuously while running
  useEffect(() => {
    const interval = setInterval(fetchStatus, isRunning ? 1000 : 3000);
    return () => clearInterval(interval);
  }, [isRunning, fetchStatus]);

  // Fetch status once configuration changes to update stats instantly
  useEffect(() => {
    if (isConfigured) {
      fetchStatus();
    }
  }, [isConfigured, fetchStatus]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 id="app-title">Real-Time Event Ticketing Dashboard</h1>
        <p>Monitor and manage real-time ticketing transaction simulations</p>
      </header>

      {isLoading && !connectionError && (
        <div className="loading-banner">
          Connecting to backend...
        </div>
      )}

      {connectionError && (
        <div className="warning-banner" id="connection-warning">
          <span className="warning-icon">⚠️</span> Connection lost — retrying...
        </div>
      )}

      <main className="dashboard-grid">
        <div className="left-column">
          <ConfigurationForm
            isRunning={isRunning}
            isConfigured={isConfigured}
            setIsConfigured={setIsConfigured}
            addLog={addLog}
          />
        </div>

        <div className="right-column">
          <TicketStatus
            status={status}
            isConfigured={isConfigured}
          />

          <ControlPanel
            isRunning={isRunning}
            isConfigured={isConfigured}
            onStart={() => setIsRunning(true)}
            onStop={() => setIsRunning(false)}
            addLog={addLog}
          />
        </div>

        <div className="bottom-full-width">
          <LogDisplay status={status} />

          <div className="history-section">
            <div className="history-header">
              <h2>Ticket Transaction History</h2>
              <button className="refresh-btn" onClick={fetchTransactions}>
                ↻ Refresh
              </button>
            </div>
            {transactions.length === 0 ? (
              <p className="no-data">No transactions recorded yet. Start a simulation to see data.</p>
            ) : (
              <div className="table-wrapper">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Transaction ID</th>
                      <th>Event</th>
                      <th>Customer</th>
                      <th>Price (LKR)</th>
                      <th>Purchased At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice(0, 20).map((tx, index) => (
                      <tr key={tx.id}>
                        <td>{index + 1}</td>
                        <td className="mono">{tx.transactionId?.substring(0, 8)}...</td>
                        <td>{tx.eventName}</td>
                        <td>{tx.customerName}</td>
                        <td>{tx.ticketPrice}</td>
                        <td>{tx.purchasedAt ? new Date(tx.purchasedAt).toLocaleString() : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="history-section">
            <div className="history-header">
              <h2>Simulation Session History</h2>
              <button className="refresh-btn" onClick={fetchSessions}>
                ↻ Refresh
              </button>
            </div>
            {sessions.length === 0 ? (
              <p className="no-data">No sessions recorded yet.</p>
            ) : (
              <div className="table-wrapper">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Started At</th>
                      <th>Stopped At</th>
                      <th>Total Sold</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session, index) => (
                      <tr key={session.id}>
                        <td>{index + 1}</td>
                        <td>{session.startedAt ? new Date(session.startedAt).toLocaleString() : '—'}</td>
                        <td>{session.stoppedAt ? new Date(session.stoppedAt).toLocaleString() : '—'}</td>
                        <td>{session.totalTicketsSold}</td>
                        <td>
                          <span className={`status-badge ${session.status === 'RUNNING' ? 'running' : 'stopped'}`}>
                            {session.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
