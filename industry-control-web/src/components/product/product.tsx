import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import rawMaterialService from '../../services/rawMaterialService';
import ProductForm from './ProductForm';
import AddRawMaterialModal from './AddRawMaterialModal';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showRawMaterialModal, setShowRawMaterialModal] = useState(false);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [productMaterials, setProductMaterials] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
    loadRawMaterials();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll();
      console.log('Resposta da API:', response);

      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else if (response.data && Array.isArray(response.data.content)) {
        setProducts(response.data.content);
      } else {
        console.error('Formato inesperado:', response.data);
        setProducts([]);
      }

      setError('');
    } catch (err) {
      setError('Erro ao carregar produtos');
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadRawMaterials = async () => {
    try {
      const response = await rawMaterialService.getAll();
      setRawMaterials(response.data);
    } catch (err) {
      console.error('Erro ao carregar matérias-primas:', err);
    }
  };

  const loadProductMaterials = async (productId: number) => {
    try {
      const response = await productService.getRawMaterialsByProduct(productId);
      setProductMaterials(prev => ({
        ...prev,
        [productId]: response.data
      }));
    } catch (err) {
      console.error('Erro ao carregar materiais do produto:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      try {
        await productService.delete(id);
        loadProducts();
      } catch (err) {
        setError('Erro ao deletar produto');
        console.error(err);
      }
    }
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleAddRawMaterial = (product: any) => {
    setSelectedProduct(product);
    setShowRawMaterialModal(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedProduct(null);
    loadProducts();
  };

  const handleRawMaterialAdded = () => {
    if (selectedProduct) {
      loadProductMaterials(selectedProduct.id);
    }
  };

  const handleRemoveRawMaterial = async (productId: number, rawMaterialId: number) => {
    if (window.confirm('Remover esta matéria-prima do produto?')) {
      try {
        await productService.removeRawMaterial(productId, rawMaterialId);
        loadProductMaterials(productId);
      } catch (err) {
        setError('Erro ao remover matéria-prima');
        console.error(err);
      }
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        setLoading(true);
        const response = await productService.search(searchTerm);
        setProducts(response.data);
      } catch (err) {
        setError('Erro na busca');
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      loadProducts();
    }
  };

  const handleCheckProduction = async (productId: number) => {
    try {
      const response = await productService.possibleProduction(productId);
      alert(`Este produto pode produzir ${response.data} unidades com o estoque atual`);
    } catch (err) {
      alert('Erro ao verificar produção');
    }
  };

  if (loading && products.length === 0) {
    return <div className="text-center mt-5">Carregando...</div>;
  }

  return (
    <div className="product-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📦 Produtos</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Novo Produto
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
      </div>

      <div className="row">
        {products.map(product => (
          <div key={product.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">{product.name}</h5>
              </div>
              <div className="card-body">
                <p><strong>Código:</strong> {product.code}</p>
                <p><strong>Preço:</strong> R$ {product.price}</p>

                <hr />
                <h6>Matérias-Primas:</h6>
                <button
                  className="btn btn-sm btn-outline-info mb-2"
                  onClick={() => loadProductMaterials(product.id)}
                >
                  🔄 Ver materiais
                </button>

                {productMaterials[product.id] && (
                  <ul className="list-group mb-3">
                    {productMaterials[product.id].map(material => (
                      <li key={material.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{material.rawMaterial.name}</strong>
                          <br />
                          <small>Qtd: {material.quantityRequired}</small>
                        </div>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleRemoveRawMaterial(product.id, material.rawMaterial.id)}
                        >
                          ❌
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="card-footer d-flex justify-content-between">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => handleAddRawMaterial(product)}
                >
                  ➕ Adicionar MP
                </button>
                <button
                  className="btn btn-sm btn-info"
                  onClick={() => handleCheckProduction(product.id)}
                >
                  🔍 Ver produção
                </button>
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => handleEdit(product)}
                >
                  ✏️ Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(product.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}

        {products.length === 0 && !loading && (
          <div className="col-12 text-center">
            <p className="text-muted">Nenhum produto cadastrado</p>
          </div>
        )}
      </div>

      {showForm && (
        <ProductForm
          product={selectedProduct}
          onClose={handleFormClose}
          onSave={loadProducts}
        />
      )}

      {showRawMaterialModal && selectedProduct && (
        <AddRawMaterialModal
          product={selectedProduct}
          rawMaterials={rawMaterials}
          onClose={() => {
            setShowRawMaterialModal(false);
            setSelectedProduct(null);
          }}
          onAdded={handleRawMaterialAdded}
        />
      )}
    </div>
  );
};

export default ProductList;