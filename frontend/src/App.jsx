import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Monitoreo from './pages/Monitoreo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/monitoreo" element={<Monitoreo />} />
      </Routes>
    </Router>
  );
}

export default App;