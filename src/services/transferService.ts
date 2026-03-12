import { mockTransfers } from './mockData';

export const getTransfers = async () => {
  await new Promise(r => setTimeout(r, 400));
  return mockTransfers;
};

export const approveTransfer = async (id: string) => {
  await new Promise(r => setTimeout(r, 300));
  console.log('Approved transfer:', id);
};

export const rejectTransfer = async (id: string) => {
  await new Promise(r => setTimeout(r, 300));
  console.log('Rejected transfer:', id);
};
