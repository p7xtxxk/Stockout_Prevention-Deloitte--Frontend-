import { delay } from './api';
import { mockStockoutRisks } from './mockData';
import { StockoutRisk } from '../types';

export const getStockoutRisks = async (): Promise<StockoutRisk[]> => {
  await delay(800);
  return [...mockStockoutRisks];
};
