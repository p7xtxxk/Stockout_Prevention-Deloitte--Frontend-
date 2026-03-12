import { delay } from './api';
import { mockShipments } from './mockData';
import { ShipmentStatus } from '../types';

export const getShipmentStatus = async (): Promise<ShipmentStatus[]> => {
  await delay(600);
  return [...mockShipments];
};
