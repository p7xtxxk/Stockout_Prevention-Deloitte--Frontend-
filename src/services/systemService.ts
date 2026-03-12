import { mockAgentLogs, mockAuditEntries } from './mockData';

export const getAgentLogs = async () => {
  await new Promise(r => setTimeout(r, 400));
  return mockAgentLogs;
};

export const getAuditTrail = async () => {
  await new Promise(r => setTimeout(r, 400));
  return mockAuditEntries;
};
