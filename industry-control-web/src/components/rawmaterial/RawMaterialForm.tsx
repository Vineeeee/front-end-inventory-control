import React, { useState } from 'react';
import rawMaterialService from '../../services/rawMaterialService';

const RawMaterialForm = ({ material, onClose, onSave }: any) => {
  const [formData, setFormData] = useState({
    code: material?.code || '',
    name: material?.name || '',
    stockQuantity: material?.stockQuantity || 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.FormEvent<HTMLFormElement>) => {
    const { name, value }: any = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (material) {
        await rawMaterialService.update(material.id, formData);
      } else {
        await rawMaterialService.create(formData);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data || 'Erro ao salvar matéria-prima');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              {material ? '✏️ Editar Matéria-Prima' : '➕ Nova Matéria-Prima'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              
              <div className="mb-3">
                <label className="form-label">Código:</label>
                <input
                  type="text"
                  className="form-control"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  disabled={material} // Não permite editar código se for edição
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Nome:</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Estoque Inicial:</label>
                <input
                  type="number"
                  className="form-control"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                  disabled={material} // Só pode definir estoque inicial na criação
                />
                {material && (
                  <small className="text-muted">
                    Para alterar estoque, use os botões de gerenciamento de estoque
                  </small>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RawMaterialForm;