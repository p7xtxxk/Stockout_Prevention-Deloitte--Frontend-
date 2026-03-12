import { delay } from './api';
import { mockInventory, mockMetrics } from './mockData';
import { SKUInventory, InventoryMetrics } from '../types';

export const getInventory = async (): Promise<SKUInventory[]> => {
  await delay(600);
  return [...mockInventory];
};

export const getInventoryMetrics = async (): Promise<InventoryMetrics> => {
  await delay(400);
  return { ...mockMetrics };
};
