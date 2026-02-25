import api from './api';

const productService = {
  getAll: () => api.get('/products'),
  getById: (id: number) => api.get(`/products/${id}`),
  getByCode: (code: string) => api.get(`/products/code/${code}`),
  create: (product: any) => api.post('/products', product),
  update: (id: number, product: any) => api.put(`/products/${id}`, product),
  delete: (id: number) => api.delete(`/products/${id}`),
  search: (name: string) => api.get(`/products/search?name=${name}`),
  
  addRawMaterial: (productId: number, rawMaterialId: number, quantity: number) => 
    api.post(`/products/${productId}/raw-materials/${rawMaterialId}?quantity=${quantity}`),
  
  updateRawMaterialQuantity: (productId: number, rawMaterialId: number, quantity: number) => 
    api.put(`/products/${productId}/raw-materials/${rawMaterialId}?quantity=${quantity}`),
  
  removeRawMaterial: (productId: number, rawMaterialId: number) => 
    api.delete(`/products/${productId}/raw-materials/${rawMaterialId}`),
  
  getRawMaterialsByProduct: (productId: number) => 
    api.get(`/products/${productId}/raw-materials`),
  
  canProduce: (productId: number) => 
    api.get(`/products/${productId}/can-produce`),
  
  possibleProduction: (productId: number) => 
    api.get(`/products/${productId}/possible-production`),
};

export default productService;