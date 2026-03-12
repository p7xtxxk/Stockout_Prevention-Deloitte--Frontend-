import { mockDatasetRows, mockSuppliers, mockWarehouses } from './mockData';

export const getProductCatalog = async () => {
  await new Promise(r => setTimeout(r, 400));
  return mockDatasetRows;
};

export const getSuppliers = async () => {
  await new Promise(r => setTimeout(r, 400));
  return mockSuppliers;
};

export const getWarehouses = async () => {
  await new Promise(r => setTimeout(r, 400));
  return mockWarehouses;
};
