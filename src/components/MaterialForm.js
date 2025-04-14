import React, { useState } from 'react';

function MaterialForm({ onAdd }) {
  const [formData, setFormData] = useState({
    nome: '',
    material: '',
    quantidade: ''
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ nome: '', material: '', quantidade: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-3">
        <label className="form-label">Nome</label>
        <input type="text" name="nome" className="form-control" value={formData.nome} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Material</label>
        <input type="text" name="material" className="form-control" value={formData.material} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Quantidade</label>
        <input type="number" name="quantidade" className="form-control" value={formData.quantidade} onChange={handleChange} required />
      </div>
      <button type="submit" className="btn btn-primary">Adicionar</button>
    </form>
  );
}

export default MaterialForm;
