import React from 'react';
const Navbar = ({ currentPage, setCurrentPage }: any) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div className="container">
        <span className="navbar-brand">🏭 Inventory Control</span>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <button 
                className={`nav-link btn ${currentPage === 'products' ? 'active' : ''}`}
                onClick={() => setCurrentPage('products')}
              >
                📦 Produtos
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link btn ${currentPage === 'raw-materials' ? 'active' : ''}`}
                onClick={() => setCurrentPage('raw-materials')}
              >
                ⚙️ Matérias-Primas
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link btn ${currentPage === 'production' ? 'active' : ''}`}
                onClick={() => setCurrentPage('production')}
              >
                💡 Sugestão de Produção
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;