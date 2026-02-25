import React, { useState } from 'react';
import productService from '../../services/productService';

const AddRawMaterialModal = ({ product, rawMaterials, onClose, onAdded }: any) => {
  const [selectedMaterial, setSelectedMaterial] = useState();
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedMaterial) {
      setError('Selecione uma matéria-prima');
      return;
    }

    if (!quantity || quantity <= 0) {
      setError('Quantidade deve ser maior que zero');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await productService.addRawMaterial(product.id, selectedMaterial, quantity);
      onAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data || 'Erro ao adicionar matéria-prima');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-info text-white">
            <h5 className="modal-title">
              ➕ Adicionar Matéria-Prima ao Produto: {product.name}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              
              <div className="mb-3">
                <label className="form-label">Matéria-Prima:</label>
                <select
                  className="form-select"
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  required
                >
                  <option value="">Selecione...</option>
                  {rawMaterials.map(material => (
                    <option key={material.id} value={material.id}>
                      {material.code} - {material.name} (Estoque: {material.stockQuantity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Quantidade Necessária:</label>
                <input
                  type="number"
                  className="form-control"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-info" disabled={loading}>
                {loading ? 'Adicionando...' : 'Adicionar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRawMaterialModal;