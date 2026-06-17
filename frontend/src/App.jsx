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
    } catch (err) {
      console.error('Error fetching simulation status:', err);
      setConnectionError(true);
      setIsLoading(false);
    }
  }, []);

  // Fetch status on initial mount to check if already configured or running
  useEffect(() => {
    fetchStatus();
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
        </div>
      </main>
    </div>
  );
}

export default App;
