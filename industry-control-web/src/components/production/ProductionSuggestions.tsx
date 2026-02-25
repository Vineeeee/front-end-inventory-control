import React, { useState, useEffect } from 'react';
import productionService from '../../services/productionService';

const ProductionSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalValue, setTotalValue] = useState(0);
  const [viewMode, setViewMode] = useState('detailed'); // 'detailed' ou 'simplified'

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      setLoading(true);
      const response = await productionService.getSuggestions();
      setSuggestions(response.data);
      
      // Carrega o valor total
      const totalResponse = await productionService.getTotalValue();
      setTotalValue(totalResponse.data);
      
      setError('');
    } catch (err) {
      setError('Erro ao carregar sugestões de produção');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSimplified = async () => {
    try {
      setLoading(true);
      const response = await productionService.getSimplifiedSuggestions();
      setSuggestions(response.data);
      
      const totalResponse = await productionService.getTotalValue();
      setTotalValue(totalResponse.data);
      
      setError('');
    } catch (err) {
      setError('Erro ao carregar sugestões simplificadas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewModeChange = (mode: string) => {
    setViewMode(mode);
    if (mode === 'simplified') {
      loadSimplified();
    } else {
      loadSuggestions();
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading && suggestions.length === 0) {
    return <div className="text-center mt-5">Carregando...</div>;
  }

  return (
    <div className="production-suggestions">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>💡 Sugestão de Produção</h2>
        <div className="btn-group">
          <button 
            className={`btn ${viewMode === 'detailed' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => handleViewModeChange('detailed')}
          >
            📊 Detalhado
          </button>
          <button 
            className={`btn ${viewMode === 'simplified' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => handleViewModeChange('simplified')}
          >
            📋 Simplificado
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Card de Resumo */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Valor Total da Produção</h5>
              <h2>{formatCurrency(totalValue)}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">Produtos que podem ser produzidos</h5>
              <h2>{suggestions.length}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Sugestões */}
      {suggestions.length === 0 ? (
        <div className="alert alert-warning">
          Nenhum produto pode ser produzido com o estoque atual.
          <br />
          <small>Adicione matérias-primas ao estoque ou crie novos produtos.</small>
        </div>
      ) : (
        <div className="row">
          {suggestions.map((suggestion, index): any => (
            <div key={suggestion.productId} className="col-12 mb-4">
              <div className="card">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    #{index + 1} - {suggestion.productName}
                  </h5>
                  <span className="badge bg-warning text-dark">
                    Prioridade: {index === 0 ? '🚀 Máxima' : index === 1 ? '⭐ Alta' : '📌 Média'}
                  </span>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4">
                      <p><strong>Código:</strong> {suggestion.productCode}</p>
                      <p><strong>Preço unitário:</strong> {formatCurrency(suggestion.productPrice)}</p>
                    </div>
                    <div className="col-md-4">
                      <h3 className="text-success">
                        {suggestion.possibleQuantity} unidades
                      </h3>
                      <p>podem ser produzidas</p>
                    </div>
                    <div className="col-md-4">
                      <h4>{formatCurrency(suggestion.totalValue)}</h4>
                      <p>valor total</p>
                    </div>
                  </div>

                  {/* Detalhes das matérias-primas (apenas no modo detalhado) */}
                  {viewMode === 'detailed' && suggestion.materialsRequired && (
                    <>
                      <hr />
                      <h6>Matérias-primas necessárias:</h6>
                      <div className="table-responsive">
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>Matéria-Prima</th>
                              <th>Necessário por unidade</th>
                              <th>Necessário total</th>
                              <th>Disponível em estoque</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {suggestion.materialsRequired.map(material => {
                              const totalRequired = material.quantityRequired * suggestion.possibleQuantity;
                              const status = material.availableStock >= totalRequired ? '✅ OK' : '⚠️ Insuficiente';
                              const statusClass = material.availableStock >= totalRequired ? 'text-success' : 'text-danger';
                              
                              return (
                                <tr key={material.rawMaterialId}>
                                  <td>{material.rawMaterialName}</td>
                                  <td>{material.quantityRequired}</td>
                                  <td>{totalRequired.toFixed(2)}</td>
                                  <td>{material.availableStock}</td>
                                  <td className={statusClass}><strong>{status}</strong></td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botão para atualizar */}
      <div className="text-center mt-4">
        <button className="btn btn-primary btn-lg" onClick={loadSuggestions}>
          🔄 Atualizar Sugestões
        </button>
      </div>
    </div>
  );
};

export default ProductionSuggestions;