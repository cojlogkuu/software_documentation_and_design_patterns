import { EstablishmentManager } from './EstablishmentManager';
import { ExportManager } from './ExportManager';

function App() {
  return (
    <div className="container">
      <h1>TripAdvisor - MVC View</h1>
      <EstablishmentManager />
      <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />
      <ExportManager />
    </div>
  );
}

export default App;
