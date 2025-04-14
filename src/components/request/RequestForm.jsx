import React, { useState } from 'react';
import axios from 'axios';
import './RequestForm.css';

function RequestForm({ onRequestCreated }) {
  const [formData, setFormData] = useState({
    nome: '',
    drt: '',
    plantao: '',
    setor: '',
    materiais: ''
  });

  const [showSuccess, setShowSuccess] = useState(false); // ← novo estado

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newRequest = {
      ...formData,
      id: Date.now(),
      status: 'pendente'
    };

    try {
      await axios.post('http://localhost:5000/requests', newRequest);
      onRequestCreated(newRequest);
      setFormData({ nome: '', drt: '', plantao: '', setor: '', materiais: '' });

      setShowSuccess(true); // ← mostra o alerta
      setTimeout(() => setShowSuccess(false), 3000); // ← esconde após 3s
    } catch (error) {
      console.error('Erro ao enviar requisição:', error);
    }
  };
  return (
    <div className="form-container shadow p-4 rounded bg-white">
      <h4 className="mb-4 text-primary fw-bold text-center">Nova Requisição de Materiais</h4>

      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="nome" className="form-label">Nome</label>
            <input
              type="text"
              className="form-control"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              placeholder="Digite seu nome"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="drt" className="form-label">DRT</label>
            <input
              type="text"
              className="form-control"
              name="drt"
              value={formData.drt}
              onChange={handleChange}
              required
              placeholder="Ex: 79482"
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="plantao" className="form-label">Plantão</label>
            <select
              className="form-select"
              name="plantao"
              value={formData.plantao}
              onChange={handleChange}
              required
            >
              <option value="">Selecione</option>
              <option value="Manhã">Manhã</option>
              <option value="Tarde">Tarde</option>
              <option value="Noite">Noite</option>
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="setor" className="form-label">Setor</label>
            <select
              className="form-select"
              name="setor"
              value={formData.setor}
              onChange={handleChange}
              required
            >
              <option value="">Selecione</option>
              <option value="Arsenal 5">Arsenal 5</option>
              <option value="Preparo 5">Preparo 5</option>
              <option value="Expugo 5">Expugo 5</option>
              <option value="Arsenal i4">Arsenal i4</option>
              <option value="Preparo i4">Preparo i4</option>
              <option value="Expurgo i4">Expurgo i4</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="materiais" className="form-label">Materiais</label>
          <textarea
            className="form-control"
            name="materiais"
            value={formData.materiais}
            onChange={handleChange}
            rows="3"
            required
            placeholder="Ex: Álcool, luvas, seringas..."
          ></textarea>
        </div>

        <div className="text-end">
          <button type="submit" className="btn btn-primary px-4">Enviar</button>
        </div>
      </form>


      {/* Alerta de sucesso */}
      {showSuccess && (
        <div className="alert alert-success alert-dismissible fade show my-2" role="alert">
          Requisição criada com sucesso!
        </div>
      )}
    </div>
  );
}

export default RequestForm;
