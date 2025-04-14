import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Requisicoes from './pages/requisicoes';
import Almoxarifado from './pages/almoxarifado';
import axios from 'axios';
import './App.css'; // Importando estilos extras

function App() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('https://backendsistemaeinsteinv2.onrender.com/requests');
        setRequests(response.data);
      } catch (error) {
        console.error('Erro ao buscar requisições:', error);
      }
    };
  
    fetchRequests();
    const interval = setInterval(fetchRequests, 5000); // Atualiza a cada 5s
    return () => clearInterval(interval);
  }, []);
  
  const hasPendentes = requests.some(req => req.status === 'pendente');

  return (
    <Router>
      <nav className="custom-navbar navbar navbar-expand-lg">
        <div className="container-fluid px-4 d-flex justify-content-between align-items-center">
          <Link className="navbar-brand fw-bold text-white" to="/">
            🏥 Requisições Einstein
          </Link>
          <ul className="navbar-nav d-flex flex-row gap-4">
            <li className="nav-item position-relative">
              <Link className="nav-link text-white nav-hover" to="/">
                Requisições
              </Link>
            </li>
            <li className="nav-item position-relative">
              <Link className="nav-link text-white nav-hover" to="/almoxarifado">
                Almoxarifado
              </Link>

              {hasPendentes && (
                <span className="notification-dot"></span>
              )}
            </li>
          </ul>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Requisicoes />} />
          <Route path="/almoxarifado" element={<Almoxarifado />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
