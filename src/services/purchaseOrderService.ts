import { mockPurchaseOrders } from './mockData';

export const getPurchaseOrders = async () => {
  await new Promise(r => setTimeout(r, 400));
  return mockPurchaseOrders;
};

export const approvePurchaseOrder = async (id: string) => {
  await new Promise(r => setTimeout(r, 300));
  console.log('Approved PO:', id);
};

export const rejectPurchaseOrder = async (id: string) => {
  await new Promise(r => setTimeout(r, 300));
  console.log('Rejected PO:', id);
};
