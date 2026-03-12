import { mockPolicies } from './mockData';
import { PolicySetting } from '../types';

export const getPolicies = async () => {
  await new Promise(r => setTimeout(r, 400));
  return mockPolicies;
};

export const updatePolicy = async (key: string, value: number) => {
  await new Promise(r => setTimeout(r, 300));
  console.log('Updated policy:', key, '→', value);
  return { key, value } as Partial<PolicySetting>;
};
