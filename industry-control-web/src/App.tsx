import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ProductList from './components/product/product';
import RawMaterialList from './components/rawmaterial/RawMaterialList';
import ProductionSuggestions from './components/production/ProductionSuggestions';
import './App.css';
import './styles/custom.css';


function App() {
  const [currentPage, setCurrentPage] = useState('products');

  const renderPage = () => {
    switch(currentPage) {
      case 'products':
        return <ProductList />;
      case 'raw-materials':
        return <RawMaterialList />;
      case 'production':
        return <ProductionSuggestions />;
      default:
        return <ProductList />;
    }
  };

  return (
    <div className="App">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="container">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;