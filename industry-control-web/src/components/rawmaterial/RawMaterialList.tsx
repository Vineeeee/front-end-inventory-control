import React, { useState, useEffect } from 'react';
import rawMaterialService from '../../services/rawMaterialService';
import RawMaterialForm from './RawMaterialForm';
import StockModal from './StockModal';

const RawMaterialList = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockAction, setStockAction] = useState('add'); // 'add' ou 'remove' ou 'update'
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyWithStock, setShowOnlyWithStock] = useState(false);

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const response = await rawMaterialService.getAll();
      setMaterials(response.data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar matérias-primas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadWithStock = async () => {
    try {
      setLoading(true);
      const response = await rawMaterialService.getWithStock();
      setMaterials(response.data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar matérias-primas com estoque');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStock = () => {
    if (showOnlyWithStock) {
      loadMaterials();
    } else {
      loadWithStock();
    }
    setShowOnlyWithStock(!showOnlyWithStock);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar esta matéria-prima?')) {
      try {
        await rawMaterialService.delete(id);
        loadMaterials();
      } catch (err) {
        setError(err.response?.data || 'Erro ao deletar matéria-prima');
        console.error(err);
      }
    }
  };

  const handleEdit = (material: any) => {
    setSelectedMaterial(material);
    setShowForm(true);
  };

  const handleStockAction = (material: any, action: string) => {
    setSelectedMaterial(material);
    setStockAction(action);
    setShowStockModal(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedMaterial(null);
    loadMaterials();
  };

  const handleStockUpdated = () => {
    loadMaterials();
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        setLoading(true);
        const response = await rawMaterialService.search(searchTerm);
        setMaterials(response.data);
      } catch (err) {
        setError('Erro na busca');
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      loadMaterials();
    }
  };

  const getStockStatusClass = (stock: number) => {
    if (stock <= 0) return 'text-danger';
    if (stock < 10) return 'text-warning';
    return 'text-success';
  };

  if (loading && materials.length === 0) {
    return <div className="text-center mt-5">Carregando...</div>;
  }

  return (
    <div className="raw-material-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>⚙️ Matérias-Primas</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Nova Matéria-Prima
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="btn btn-outline-secondary" onClick={handleSearch}>
              🔍 Buscar
            </button>
          </div>
        </div>
        <div className="col-md-6 text-end">
          <button 
            className={`btn ${showOnlyWithStock ? 'btn-success' : 'btn-outline-success'}`}
            onClick={handleToggleStock}
          >
            {showOnlyWithStock ? '📦 Mostrando com estoque' : '📦 Filtrar com estoque'}
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Estoque</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {materials.map(material => (
              <tr key={material.id}>
                <td><strong>{material.code}</strong></td>
                <td>{material.name}</td>
                <td className={getStockStatusClass(material.stockQuantity)}>
                  <strong>{material.stockQuantity}</strong>
                </td>
                <td>
                  {material.stockQuantity <= 0 ? (
                    <span className="badge bg-danger">Sem estoque</span>
                  ) : material.stockQuantity < 10 ? (
                    <span className="badge bg-warning">Estoque baixo</span>
                  ) : (
                    <span className="badge bg-success">OK</span>
                  )}
                </td>
                <td>
                  <div className="btn-group" role="group">
                    <button 
                      className="btn btn-sm btn-success"
                      onClick={() => handleStockAction(material, 'add')}
                      title="Adicionar estoque"
                    >
                      ➕ Estoque
                    </button>
                    <button 
                      className="btn btn-sm btn-warning"
                      onClick={() => handleStockAction(material, 'update')}
                      title="Atualizar estoque"
                    >
                      📝 Atualizar
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleStockAction(material, 'remove')}
                      title="Remover estoque"
                      disabled={material.stockQuantity <= 0}
                    >
                      ➖ Remover
                    </button>
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => handleEdit(material)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(material.id)}
                      title="Deletar"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {materials.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="text-center">
                  Nenhuma matéria-prima cadastrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <RawMaterialForm 
          material={selectedMaterial}
          onClose={handleFormClose}
          onSave={loadMaterials}
        />
      )}

      {showStockModal && selectedMaterial && (
        <StockModal
          material={selectedMaterial}
          action={stockAction}
          onClose={() => {
            setShowStockModal(false);
            setSelectedMaterial(null);
          }}
          onUpdated={handleStockUpdated}
        />
      )}
    </div>
  );
};

export default RawMaterialList;