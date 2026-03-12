import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Alert } from '../types';

// Simulate a WebSocket or polling mechanism
export const useRealtimeAlerts = () => {
  const addAlert = useStore((state) => state.addAlert);
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      // 10% chance to generate a new mock alert every 10 seconds
      if (Math.random() > 0.9) {
        const types: Array<'Stockout' | 'Demand' | 'Shipment'> = ['Stockout', 'Demand', 'Shipment'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        const newAlert: Alert = {
          id: `RT-ALT-${Math.floor(Math.random() * 10000)}`,
          type: randomType,
          message: `Real-time ${randomType.toLowerCase()} event detected for SKU-${Math.floor(1000 + Math.random() * 5)}`,
          timestamp: new Date().toISOString(),
          read: false
        };
        
        addAlert(newAlert);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isAuthenticated, addAlert]);
};
