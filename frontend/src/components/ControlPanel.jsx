import React, { useState } from 'react';
import axios from 'axios';
import './ControlPanel.css';

const ControlPanel = ({ isRunning, isConfigured, onStart, onStop, addLog }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleStart = async () => {
    setMessage('');
    setErrorMsg('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/simulation/start');
      const resText = typeof response.data === 'string' ? response.data : 'Simulation started!';
      setMessage(resText);
      addLog(`Simulation Start Action: Backend replied "${resText}"`);
      onStart(); // Trigger App-level status updates and polling
    } catch (err) {
      console.error(err);
      const msg = err.response?.data || 'Failed to start simulation due to connection error.';
      setErrorMsg(msg);
      addLog(`Start Simulation failed: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setMessage('');
    setErrorMsg('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/simulation/stop');
      const resText = typeof response.data === 'string' ? response.data : 'Simulation stopped!';
      setMessage(resText);
      addLog(`Simulation Stop Action: Backend replied "${resText}"`);
      onStop(); // Trigger App-level status updates and stop polling
    } catch (err) {
      console.error(err);
      const msg = err.response?.data || 'Failed to stop simulation due to connection error.';
      setErrorMsg(msg);
      addLog(`Stop Simulation failed: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="control-panel-container card">
      <div className="control-panel-header">
        <h2 id="control-title">Control Panel</h2>
        <div className="status-badge-wrapper">
          <span className="status-label">Status:</span>
          <span
            id="status-badge"
            className={`status-pill ${isRunning ? 'running' : 'stopped'}`}
          >
            {isRunning ? 'RUNNING' : 'STOPPED'}
          </span>
        </div>
      </div>

      {!isConfigured && !isRunning && (
        <div className="configure-warning">
          Please configure the system parameters first to enable simulation.
        </div>
      )}

      <div className="control-actions">
        <button
          id="start-btn"
          className="btn btn-start"
          onClick={handleStart}
          disabled={isRunning || !isConfigured || loading}
        >
          {loading && !isRunning ? 'Starting...' : 'Start Simulation'}
        </button>

        <button
          id="stop-btn"
          className="btn btn-stop"
          onClick={handleStop}
          disabled={!isRunning || loading}
        >
          {loading && isRunning ? 'Stopping...' : 'Stop Simulation'}
        </button>
      </div>

      {message && <div className="backend-message" id="panel-message">{message}</div>}
      {errorMsg && <div className="backend-error-message" id="panel-error">{errorMsg}</div>}
    </div>
  );
};

export default ControlPanel;
