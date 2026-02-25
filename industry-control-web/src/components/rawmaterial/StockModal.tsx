import React, { useState } from 'react';
import rawMaterialService from '../../services/rawMaterialService';

const StockModal = ({ material, action, onClose, onUpdated }: any) => {
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getTitle = () => {
    switch(action) {
      case 'add': return '➕ Adicionar Estoque';
      case 'remove': return '➖ Remover Estoque';
      case 'update': return '📝 Atualizar Estoque';
      default: return 'Gerenciar Estoque';
    }
  };

  const getButtonClass = () => {
    switch(action) {
      case 'add': return 'success';
      case 'remove': return 'danger';
      case 'update': return 'warning';
      default: return 'primary';
    }
  };

  const getButtonText = () => {
    switch(action) {
      case 'add': return 'Adicionar';
      case 'remove': return 'Remover';
      case 'update': return 'Atualizar';
      default: return 'Confirmar';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!quantity || quantity <= 0) {
      setError('Quantidade deve ser maior que zero');
      return;
    }

    if (action === 'remove' && quantity > material.stockQuantity) {
      setError(`Estoque insuficiente. Disponível: ${material.stockQuantity}`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      switch(action) {
        case 'add':
          await rawMaterialService.addStock(material.id, quantity);
          break;
        case 'remove':
          await rawMaterialService.removeStock(material.id, quantity);
          break;
        case 'update':
          await rawMaterialService.updateStock(material.id, quantity);
          break;
        default:
          break;
      }
      onUpdated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data || 'Erro ao atualizar estoque');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className={`modal-header bg-${getButtonClass()} text-white`}>
            <h5 className="modal-title">
              {getTitle()} - {material.name}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              
              <div className="mb-3">
                <label className="form-label">Estoque Atual:</label>
                <input
                  type="text"
                  className="form-control"
                  value={material.stockQuantity}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  {action === 'add' ? 'Quantidade a Adicionar:' : 
                   action === 'remove' ? 'Quantidade a Remover:' : 
                   'Novo Valor do Estoque:'}
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0.01"
                  required
                  autoFocus
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button 
                type="submit" 
                className={`btn btn-${getButtonClass()}`} 
                disabled={loading}
              >
                {loading ? 'Processando...' : getButtonText()}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StockModal;