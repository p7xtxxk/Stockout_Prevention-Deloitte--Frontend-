import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';

import MainLayout from './layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DemandIntelligence from './pages/DemandIntelligence';
import StockoutRisk from './pages/StockoutRisk';
import Replenishment from './pages/Replenishment';
import ShipmentMonitoring from './pages/ShipmentMonitoring';
import OverstockMonitoring from './pages/OverstockMonitoring';
import PurchaseOrders from './pages/PurchaseOrders';
import InventoryTransfers from './pages/InventoryTransfers';
import PolicyManagement from './pages/PolicyManagement';
import SystemMonitoring from './pages/SystemMonitoring';
import DataManagement from './pages/DataManagement';
import SystemLogs from './pages/SystemLogs';

// Auth Guard Component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="demand-intelligence" element={<DemandIntelligence />} />
          <Route path="stockout-risk" element={<StockoutRisk />} />
          <Route path="overstock" element={<OverstockMonitoring />} />
          <Route path="replenishment" element={<Replenishment />} />
          <Route path="shipment-monitoring" element={<ShipmentMonitoring />} />
          <Route path="purchase-orders" element={<PurchaseOrders />} />
          <Route path="transfers" element={<InventoryTransfers />} />
          <Route path="policies" element={<PolicyManagement />} />
          <Route path="system-monitoring" element={<SystemMonitoring />} />
          <Route path="data-management" element={<DataManagement />} />
          <Route path="system-logs" element={<SystemLogs />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
