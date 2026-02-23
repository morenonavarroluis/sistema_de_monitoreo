import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Monitoreo from './pages/Monitoreo';
import ClearPort from './pages/Clearport';
import Reportes from './pages/Reportes';
import Usuarios from './pages/Usuarios';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/monitoreo" element={<Monitoreo />} />
        <Route path="/clear_port" element={<ClearPort />} />
        <Route path="/Reportes" element={<Reportes />} />
        <Route path="/Usuarios" element={<Usuarios />} />
      
      </Routes>
    </Router>
  );
}

export default App;