import { delay } from './api';
import { mockReplenishments } from './mockData';
import { ReplenishmentRecommendation } from '../types';

export const getReplenishmentRecommendations = async (): Promise<ReplenishmentRecommendation[]> => {
  await delay(900);
  return [...mockReplenishments];
};

export const approveOrder = async (_id: string): Promise<boolean> => {
  await delay(500);
  return true;
};

export const rejectOrder = async (_id: string): Promise<boolean> => {
  await delay(400);
  return true;
};

export const generateOrder = async (_id: string, _newQuantity: number): Promise<boolean> => {
  await delay(600);
  return true;
};
