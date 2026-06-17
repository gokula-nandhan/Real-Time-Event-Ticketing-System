import React, { useState, useEffect, useRef } from 'react';
import './LogDisplay.css';

const LogDisplay = ({ status }) => {
  const [logs, setLogs] = useState([]);
  const containerRef = useRef(null);
  
  // Track previous status properties to detect specific changes
  const prevStatusRef = useRef({
    isRunning: null,
    ticketPoolSize: null,
    totalTicketsAdded: null
  });

  // Helper to add a log entry
  const addLogEntry = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => {
      const updated = [...prev, { timestamp, message }];
      if (updated.length > 100) {
        return updated.slice(updated.length - 100); // Enforce max 100 entries
      }
      return updated;
    });
  };

  // Detect status changes and log them
  useEffect(() => {
    if (!status) return;

    // Handle manual logs from App.jsx first
    if (status._manualLog && status._ts !== prevStatusRef.current._ts) {
      addLogEntry(status._manualLog);
      prevStatusRef.current._ts = status._ts;
    }

    const running = status.running !== undefined ? status.running : (status.isRunning ?? false);
    const poolSize = status.ticketPoolSize ?? 0;
    const totalAdded = status.totalTicketsAdded ?? 0;
    const remainingToAdd = status.remainingTicketsToAdd ?? 0;

    const prev = prevStatusRef.current;

    // Handle initial state setup
    if (prev.isRunning === null) {
      addLogEntry(`Logger initialized. Status: [Simulation: ${running ? 'RUNNING' : 'STOPPED'}, Pool Size: ${poolSize}, Tickets Sold: ${totalAdded}, Remaining to Add: ${remainingToAdd}]`);
      prevStatusRef.current = {
        ...prevStatusRef.current,
        isRunning: running,
        ticketPoolSize: poolSize,
        totalTicketsAdded: totalAdded
      };
      return;
    }

    // Detect state changes
    let changed = false;

    if (prev.isRunning !== running) {
      addLogEntry(`[SYSTEM] Simulation state changed from ${prev.isRunning ? 'RUNNING' : 'STOPPED'} to ${running ? 'RUNNING' : 'STOPPED'}.`);
      changed = true;
    }

    if (prev.ticketPoolSize !== poolSize) {
      const diff = poolSize - prev.ticketPoolSize;
      if (diff > 0) {
        addLogEntry(`[VENDORS] Released ${diff} ticket(s) into the pool. Pool size: ${poolSize}.`);
      } else if (diff < 0) {
        addLogEntry(`[CUSTOMERS] Purchased ${Math.abs(diff)} ticket(s) from the pool. Pool size: ${poolSize}.`);
      }
      changed = true;
    } else if (prev.totalTicketsAdded !== totalAdded) {
      const diff = totalAdded - prev.totalTicketsAdded;
      if (diff > 0) {
        addLogEntry(`[TICKETS] Total tickets sold increased by ${diff}. Total sold: ${totalAdded}.`);
        changed = true;
      }
    }

    if (changed) {
      prevStatusRef.current = {
        ...prevStatusRef.current,
        isRunning: running,
        ticketPoolSize: poolSize,
        totalTicketsAdded: totalAdded
      };
    }
  }, [status]);

  // Auto-scroll to latest entry when logs list updates
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleClear = () => {
    setLogs([]);
  };

  return (
    <div className="log-display-container card">
      <div className="log-header">
        <h2 id="log-title">System Activity Log</h2>
        <button
          id="clear-log-btn"
          className="btn btn-clear"
          onClick={handleClear}
          disabled={logs.length === 0}
        >
          Clear Log
        </button>
      </div>

      <div className="log-console" ref={containerRef}>
        {logs.length === 0 ? (
          <div className="empty-logs">No system activity events recorded yet.</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="log-entry">
              <span className="log-time">[{log.timestamp}]</span>
              <span className="log-msg">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LogDisplay;
