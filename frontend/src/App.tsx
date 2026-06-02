import { useEffect, useMemo, useState } from 'react';

type SimulationStatus = {
  running: boolean;
  totalTicketsAdded: number;
  remainingTicketsToAdd: number;
  ticketPoolSize: number;
  remainingTicketPoolSize: number;
};

type Configuration = {
  totalTickets: number;
  ticketReleaseRate: number;
  customerRetrievalRate: number;
  maxTicketCapacity: number;
  vendorCount: number;
  customerCount: number;
};

const initialConfiguration: Configuration = {
  totalTickets: 100,
  ticketReleaseRate: 5,
  customerRetrievalRate: 3,
  maxTicketCapacity: 50,
  vendorCount: 3,
  customerCount: 5,
};

const apiBase = '';

export default function App() {
  const [configuration, setConfiguration] = useState<Configuration>(initialConfiguration);
  const [status, setStatus] = useState<SimulationStatus | null>(null);
  const [message, setMessage] = useState('Configure the simulation, then start it from this dashboard.');
  const [busyAction, setBusyAction] = useState<string | null>(null);

  const configFields = useMemo(
    () => [
      { key: 'totalTickets', label: 'Total tickets' },
      { key: 'ticketReleaseRate', label: 'Ticket release rate' },
      { key: 'customerRetrievalRate', label: 'Customer retrieval rate' },
      { key: 'maxTicketCapacity', label: 'Max ticket capacity' },
      { key: 'vendorCount', label: 'Vendor count' },
      { key: 'customerCount', label: 'Customer count' },
    ] as const,
    [],
  );

  useEffect(() => {
    let active = true;

    const loadStatus = async () => {
      try {
        const response = await fetch(`${apiBase}/simulation/status`);
        if (!response.ok) {
          throw new Error(`Status request failed with ${response.status}`);
        }
        const data = (await response.json()) as SimulationStatus;
        if (active) {
          setStatus(data);
        }
      } catch {
        if (active) {
          setStatus(null);
        }
      }
    };

    loadStatus();
    const intervalId = window.setInterval(loadStatus, 1000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const updateField = (field: keyof Configuration, value: string) => {
    const parsed = Number.parseInt(value, 10);
    setConfiguration((current) => ({
      ...current,
      [field]: Number.isNaN(parsed) ? 0 : parsed,
    }));
  };

  const sendRequest = async (path: string, options?: RequestInit) => {
    const response = await fetch(`${apiBase}/simulation${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {}),
      },
      ...options,
    });

    const text = await response.text();
    if (!response.ok) {
      throw new Error(text || `Request failed with ${response.status}`);
    }

    setMessage(text);
    return text;
  };

  const handleConfigure = async () => {
    setBusyAction('configure');
    try {
      await sendRequest('/configure', {
        method: 'POST',
        body: JSON.stringify(configuration),
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to configure simulation.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleStart = async () => {
    setBusyAction('start');
    try {
      await sendRequest('/start', { method: 'POST' });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to start simulation.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleStop = async () => {
    setBusyAction('stop');
    try {
      await sendRequest('/stop', { method: 'POST' });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to stop simulation.');
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Real-Time Event Ticketing System</p>
          <h1>React control center for the ticket simulation.</h1>
          <p className="hero-copy">
            Configure vendors, customers, and ticket flow, then start or stop the Spring Boot simulation from a cleaner
            React interface.
          </p>
        </div>

        <div className="status-banner">
          <span className={`status-pill ${status?.running ? 'running' : 'idle'}`}>
            {status?.running ? 'Running' : 'Stopped'}
          </span>
          <p>{message}</p>
        </div>
      </section>

      <section className="content-grid">
        <article className="card">
          <div className="card-header">
            <h2>Configuration</h2>
            <p>These values are sent to the backend before starting the simulation.</p>
          </div>

          <div className="form-grid">
            {configFields.map((field) => (
              <label key={field.key}>
                <span>{field.label}</span>
                <input
                  type="number"
                  min="0"
                  value={configuration[field.key]}
                  onChange={(event) => updateField(field.key, event.target.value)}
                />
              </label>
            ))}
          </div>

          <div className="button-row">
            <button className="secondary" onClick={handleConfigure} disabled={busyAction !== null}>
              {busyAction === 'configure' ? 'Saving...' : 'Configure'}
            </button>
            <button className="primary" onClick={handleStart} disabled={busyAction !== null}>
              {busyAction === 'start' ? 'Starting...' : 'Start simulation'}
            </button>
            <button className="danger" onClick={handleStop} disabled={busyAction !== null}>
              {busyAction === 'stop' ? 'Stopping...' : 'Stop simulation'}
            </button>
          </div>
        </article>

        <article className="card status-card">
          <div className="card-header">
            <h2>Live Status</h2>
            <p>Automatically refreshed from the backend every second.</p>
          </div>

          <div className="metric-grid">
            <Metric label="Tickets added" value={status?.totalTicketsAdded ?? 0} />
            <Metric label="Remaining to add" value={status?.remainingTicketsToAdd ?? 0} />
            <Metric label="Ticket pool size" value={status?.ticketPoolSize ?? 0} />
            <Metric label="Remaining capacity" value={status?.remainingTicketPoolSize ?? 0} />
          </div>
        </article>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}