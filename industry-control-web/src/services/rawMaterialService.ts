import api from './api';

const rawMaterialService = {
  getAll: () => api.get('/raw-materials'),
  getById: (id: number) => api.get(`/raw-materials/${id}`),
  getByCode: (code: string) => api.get(`/raw-materials/code/${code}`),
  create: (material: any) => api.post('/raw-materials', material),
  update: (id: number, material: any) => api.put(`/raw-materials/${id}`, material),
  delete: (id: number) => api.delete(`/raw-materials/${id}`),
  search: (name: string) => api.get(`/raw-materials/search?name=${name}`),
  getWithStock: () => api.get('/raw-materials/with-stock'),
  
  // Estoque
  addStock: (id: number, quantity: number) => 
    api.patch(`/raw-materials/${id}/stock/add?quantity=${quantity}`),
  
  removeStock: (id: number, quantity: number) => 
    api.patch(`/raw-materials/${id}/stock/remove?quantity=${quantity}`),
  
  updateStock: (id: number, quantity: number) => 
    api.put(`/raw-materials/${id}/stock?quantity=${quantity}`),
  
  hasMinimumStock: (id: number, minimum: number) => 
    api.get(`/raw-materials/${id}/has-minimum?minimum=${minimum}`),
};

export default rawMaterialService;