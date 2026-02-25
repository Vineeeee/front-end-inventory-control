import api from './api';

const productionService = {
  getSuggestions: () => api.get('/production/suggestions'),
  getSimplifiedSuggestions: () => api.get('/production/suggestions/simplified'),
  getForProduct: (productId: number) => api.get(`/production/suggestions/product/${productId}`),
  getTotalValue: () => api.get('/production/suggestions/total-value'),
  checkProduct: (productId: number) => api.get(`/production/check/${productId}`),
};

export default productionService;