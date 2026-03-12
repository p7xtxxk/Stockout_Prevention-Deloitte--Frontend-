import { create } from 'zustand';
import { Alert } from '../types';
import { mockAlerts } from '../services/mockData';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: { name: string; role: string } | null;
  login: (token: string, user: { name: string; role: string }) => void;
  logout: () => void;
}

interface AlertState {
  alerts: Alert[];
  unreadCount: number;
  addAlert: (alert: Alert) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

interface AppStore extends AuthState, AlertState {}

export const useStore = create<AppStore>((set) => ({
  // Auth State
  isAuthenticated: !!localStorage.getItem('token'),
  token: localStorage.getItem('token'),
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null,
  
  login: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ isAuthenticated: true, token, user });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ isAuthenticated: false, token: null, user: null });
  },

  // Alert State
  alerts: mockAlerts,
  unreadCount: mockAlerts.filter(a => !a.read).length,
  
  addAlert: (alert) => set((state) => {
    const newAlerts = [alert, ...state.alerts];
    return { 
      alerts: newAlerts,
      unreadCount: newAlerts.filter(a => !a.read).length
    };
  }),

  markAsRead: (id) => set((state) => {
    const newAlerts = state.alerts.map(a => 
      a.id === id ? { ...a, read: true } : a
    );
    return {
      alerts: newAlerts,
      unreadCount: newAlerts.filter(a => !a.read).length
    };
  }),

  clearAll: () => set({ alerts: [], unreadCount: 0 })
}));
