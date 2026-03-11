import { 
  SKUInventory, 
  DemandVelocity, 
  DemandSpikeAlert, 
  StockoutRisk, 
  ReplenishmentRecommendation, 
  ShipmentStatus, 
  Alert, 
  InventoryMetrics 
} from '../types';

export const mockInventory: SKUInventory[] = [
  { sku_id: 'SKU-1001', warehouse: 'WH-East', current_stock: 450, daily_demand: 15, coverage_days: 30, stock_status: 'Healthy' },
  { sku_id: 'SKU-1002', warehouse: 'WH-West', current_stock: 50, daily_demand: 20, coverage_days: 2.5, stock_status: 'At Risk' },
  { sku_id: 'SKU-1003', warehouse: 'WH-East', current_stock: 1200, daily_demand: 10, coverage_days: 120, stock_status: 'Overstock' },
  { sku_id: 'SKU-1004', warehouse: 'WH-North', current_stock: 10, daily_demand: 8, coverage_days: 1.25, stock_status: 'At Risk' },
  { sku_id: 'SKU-1005', warehouse: 'WH-South', current_stock: 300, daily_demand: 25, coverage_days: 12, stock_status: 'Healthy' }
];

export const mockMetrics: InventoryMetrics = {
  total_skus: 5,
  total_inventory_units: 2010,
  warehouse_count: 4,
  active_stockout_risks: 2,
  healthy_skus: 2,
  at_risk_skus: 2,
  overstock_skus: 1
};

export const mockDemandVelocity: DemandVelocity[] = [
  { sku_id: 'SKU-1002', velocity: 150, trend: 'Up' },
  { sku_id: 'SKU-1005', velocity: 110, trend: 'Stable' },
  { sku_id: 'SKU-1001', velocity: 80, trend: 'Down' }
];

export const mockDemandSpikes: DemandSpikeAlert[] = [
  { id: 'DS-1', sku_id: 'SKU-1002', severity: 'High', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 'DS-2', sku_id: 'SKU-1004', severity: 'Medium', timestamp: new Date(Date.now() - 7200000).toISOString() }
];

export const mockStockoutRisks: StockoutRisk[] = [
  { sku: 'SKU-1004', warehouse: 'WH-North', coverage_days: 1.25, lead_time: 7, risk_level: 'High', recommended_action: 'Expedite PO' },
  { sku: 'SKU-1002', warehouse: 'WH-West', coverage_days: 2.5, lead_time: 5, risk_level: 'High', recommended_action: 'Transfer from WH-East' },
  { sku: 'SKU-1005', warehouse: 'WH-South', coverage_days: 12, lead_time: 14, risk_level: 'Medium', recommended_action: 'Place Standard Order' }
];

export const mockReplenishments: ReplenishmentRecommendation[] = [
  { 
    id: 'REC-001', sku: 'SKU-1004', warehouse: 'WH-North', reorder_quantity: 500, urgency: 'Critical', 
    recommended_supplier: 'GlobalTech Supplies', lead_time: 3, supplier_reliability_score: 92, 
    expected_delivery_date: new Date(Date.now() + 86400000 * 3).toISOString(), estimated_cost: 15000 
  },
  { 
    id: 'REC-002', sku: 'SKU-1002', warehouse: 'WH-West', reorder_quantity: 1000, urgency: 'High', 
    recommended_supplier: 'Pacific Logistics', lead_time: 7, supplier_reliability_score: 88, 
    expected_delivery_date: new Date(Date.now() + 86400000 * 7).toISOString(), estimated_cost: 45000 
  }
];

export const mockShipments: ShipmentStatus[] = [
  { shipment_id: 'SHP-9001', supplier: 'GlobalTech Supplies', order_id: 'PO-5501', shipment_status: 'Delayed', expected_delivery: new Date(Date.now() + 86400000 * 2).toISOString(), delay_indicator: true },
  { shipment_id: 'SHP-9002', supplier: 'Pacific Logistics', order_id: 'PO-5502', shipment_status: 'In Transit', expected_delivery: new Date(Date.now() + 86400000 * 5).toISOString(), delay_indicator: false },
  { shipment_id: 'SHP-9003', supplier: 'EuroMakers', order_id: 'PO-5499', shipment_status: 'Delivered', expected_delivery: new Date(Date.now() - 86400000 * 1).toISOString(), delay_indicator: false },
  { shipment_id: 'SHP-9004', supplier: 'QuickShip Co.', order_id: 'PO-5503', shipment_status: 'Shipped', expected_delivery: new Date(Date.now() + 86400000 * 10).toISOString(), delay_indicator: false }
];

export const mockAlerts: Alert[] = [
  { id: 'ALT-1', type: 'Stockout', message: 'Critical stockout risk for SKU-1004 at WH-North.', timestamp: new Date(Date.now() - 1800000).toISOString(), read: false },
  { id: 'ALT-2', type: 'Shipment', message: 'Shipment SHP-9001 is delayed by 2 days.', timestamp: new Date(Date.now() - 3600000).toISOString(), read: false },
  { id: 'ALT-3', type: 'Demand', message: 'Demand spike detected for SKU-1002.', timestamp: new Date(Date.now() - 7200000).toISOString(), read: true }
];
