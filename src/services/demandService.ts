import { delay } from './api';
import { mockDemandVelocity, mockDemandSpikes } from './mockData';
import { DemandVelocity, DemandSpikeAlert } from '../types';

export const getDemandForecast = async (): Promise<DemandVelocity[]> => {
  await delay(700);
  return [...mockDemandVelocity];
};

export const getDemandSpikes = async (): Promise<DemandSpikeAlert[]> => {
  await delay(500);
  return [...mockDemandSpikes];
};
