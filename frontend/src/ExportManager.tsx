import { useState, useEffect } from 'react';
import { api } from './api';

export function ExportManager() {
  const [violations, setViolations] = useState<any[]>([]);
  const [strategy, setStrategy] = useState('CONSOLE');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadViolations();
  }, []);

  const loadViolations = async () => {
    try {
      const data = await api.getViolations();
      setViolations(data);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleExecute = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.executeExport(strategy);
      setMessage(res.message);
      if (strategy === 'DATABASE' || strategy === 'CONFIG') {
        // Refresh table if database might have been updated
        await loadViolations();
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <h2 style={{ marginBottom: '20px' }}>Data Export Manager (Lab 5 - Strategy Pattern)</h2>

      {message && (
        <div className={`alert-error ${message.startsWith('Error') ? '' : 'alert-success'}`} 
             style={!message.startsWith('Error') ? { backgroundColor: '#d4edda', color: '#155724', borderColor: '#c3e6cb' } : {}}>
          {message}
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label>Select Export Strategy:</label>
            <select className="form-input" value={strategy} onChange={(e) => setStrategy(e.target.value)}>
              <option value="CONSOLE">1. Console Strategy</option>
              <option value="KAFKA">2. Kafka Strategy</option>
              <option value="REDIS">3. Redis Strategy</option>
              <option value="DATABASE">4. Save to DB (Adapter Pattern)</option>
              <option value="CONFIG">5. Use System Config</option>
            </select>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={handleExecute} 
            disabled={loading}
            style={{ padding: '10px 20px', height: '40px' }}
          >
            {loading ? 'Executing...' : 'Execute Export'}
          </button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '15px' }}>Saved Database Records (NycViolation Table)</h3>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table className="data-table">
            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr>
                <th>ID</th>
                <th>Plate</th>
                <th>State</th>
                <th>License Type</th>
                <th>Issue Date</th>
                <th>Violation</th>
                <th>Fine Amount</th>
              </tr>
            </thead>
            <tbody>
              {violations.map((v) => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{v.plate}</td>
                  <td>{v.state}</td>
                  <td>{v.licenseType}</td>
                  <td>{v.issueDate}</td>
                  <td style={{ fontSize: '0.9em' }}>{v.violation}</td>
                  <td>${v.fineAmount}</td>
                </tr>
              ))}
              {violations.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>
                    No violations stored in the database. Select "Save to DB" to fetch and map data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
