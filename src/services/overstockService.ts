import { mockOverstockItems } from './mockData';

export const getOverstockItems = async () => {
  await new Promise(r => setTimeout(r, 400));
  return mockOverstockItems;
};
