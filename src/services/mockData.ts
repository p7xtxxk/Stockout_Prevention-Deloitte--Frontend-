import { 
  SKUInventory, 
  DemandVelocity, 
  DemandSpikeAlert, 
  StockoutRisk, 
  ReplenishmentRecommendation, 
  ShipmentStatus, 
  Alert, 
  InventoryMetrics,
  OverstockItem,
  PurchaseOrder,
  InventoryTransfer,
  PolicySetting,
  AgentLog,
  AuditEntry,
  DatasetRow,
  SupplierData,
  WarehouseData,
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

// ── New Mock Data ──────────────────────────────────────────────────────────

export const mockOverstockItems: OverstockItem[] = [
  { sku: 'SKU-1003', warehouse: 'WH-East', current_stock: 1200, daily_demand: 10, coverage_days: 120, excess_units: 650, threshold: 550, suggestion: 'Reduce reorder frequency' },
  { sku: 'SKU-2010', warehouse: 'WH-North', current_stock: 980, daily_demand: 8, coverage_days: 122, excess_units: 500, threshold: 480, suggestion: 'Transfer to WH-South' },
  { sku: 'SKU-3044', warehouse: 'WH-West', current_stock: 750, daily_demand: 5, coverage_days: 150, excess_units: 450, threshold: 300, suggestion: 'Reduce reorder frequency' },
  { sku: 'SKU-1018', warehouse: 'WH-South', current_stock: 620, daily_demand: 7, coverage_days: 89, excess_units: 200, threshold: 420, suggestion: 'Transfer to WH-West' },
  { sku: 'SKU-4002', warehouse: 'WH-East', current_stock: 540, daily_demand: 4, coverage_days: 135, excess_units: 300, threshold: 240, suggestion: 'Run promotional discount' },
];

export const mockPurchaseOrders: PurchaseOrder[] = [
  { id: 'PO-5501', sku: 'SKU-1004', quantity: 500, supplier: 'GlobalTech Supplies', order_date: new Date(Date.now() - 86400000 * 5).toISOString(), expected_delivery: new Date(Date.now() + 86400000 * 2).toISOString(), status: 'Shipped' },
  { id: 'PO-5502', sku: 'SKU-1002', quantity: 1000, supplier: 'Pacific Logistics', order_date: new Date(Date.now() - 86400000 * 3).toISOString(), expected_delivery: new Date(Date.now() + 86400000 * 5).toISOString(), status: 'Approved' },
  { id: 'PO-5503', sku: 'SKU-1005', quantity: 300, supplier: 'QuickShip Co.', order_date: new Date(Date.now() - 86400000 * 1).toISOString(), expected_delivery: new Date(Date.now() + 86400000 * 10).toISOString(), status: 'Pending Approval' },
  { id: 'PO-5499', sku: 'SKU-1001', quantity: 200, supplier: 'EuroMakers', order_date: new Date(Date.now() - 86400000 * 14).toISOString(), expected_delivery: new Date(Date.now() - 86400000 * 1).toISOString(), status: 'Delivered' },
  { id: 'PO-5504', sku: 'SKU-3044', quantity: 150, supplier: 'GlobalTech Supplies', order_date: new Date(Date.now() - 86400000 * 2).toISOString(), expected_delivery: new Date(Date.now() + 86400000 * 8).toISOString(), status: 'Rejected' },
];

export const mockTransfers: InventoryTransfer[] = [
  { id: 'TRF-001', sku: 'SKU-1003', source_warehouse: 'WH-East', destination_warehouse: 'WH-West', quantity: 200, status: 'Pending', created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 'TRF-002', sku: 'SKU-2010', source_warehouse: 'WH-North', destination_warehouse: 'WH-South', quantity: 150, status: 'In Transit', created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'TRF-003', sku: 'SKU-1018', source_warehouse: 'WH-South', destination_warehouse: 'WH-West', quantity: 100, status: 'Completed', created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'TRF-004', sku: 'SKU-4002', source_warehouse: 'WH-East', destination_warehouse: 'WH-North', quantity: 80, status: 'Pending', created_at: new Date(Date.now() - 7200000).toISOString() },
];

export const mockPolicies: PolicySetting[] = [
  { key: 'safety_stock', label: 'Safety Stock Level', value: 50, unit: 'units', description: 'Minimum buffer stock maintained at each warehouse to prevent stockouts.' },
  { key: 'reorder_threshold', label: 'Reorder Threshold', value: 14, unit: 'days', description: 'When coverage days fall below this value, a reorder recommendation is triggered.' },
  { key: 'spike_threshold', label: 'Spike Detection Threshold', value: 200, unit: '% of avg', description: 'A demand increase above this percentage of 30-day average triggers a spike alert.' },
  { key: 'supplier_priority', label: 'Supplier Priority Weight', value: 70, unit: '% reliability', description: 'Weight given to supplier reliability score in supplier selection algorithm.' },
  { key: 'overstock_threshold', label: 'Overstock Threshold', value: 60, unit: 'days', description: 'SKUs with coverage days above this are flagged as overstocked.' },
];

export const mockAgentLogs: AgentLog[] = [
  { id: 'LOG-001', agent_name: 'Demand Forecast Agent', action: 'Generated 7-day demand forecast for all SKUs', timestamp: new Date(Date.now() - 1800000).toISOString(), status: 'Success' },
  { id: 'LOG-002', agent_name: 'Stockout Risk Agent', action: 'Evaluated stockout risk for 5 SKUs', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'Success' },
  { id: 'LOG-003', agent_name: 'Replenishment Agent', action: 'Generated 2 purchase order recommendations', timestamp: new Date(Date.now() - 5400000).toISOString(), status: 'Success' },
  { id: 'LOG-004', agent_name: 'Supplier Selection Agent', action: 'Ranked suppliers for SKU-1004', timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'Success' },
  { id: 'LOG-005', agent_name: 'Shipment Tracking Agent', action: 'Failed to fetch tracking data from carrier API', timestamp: new Date(Date.now() - 9000000).toISOString(), status: 'Error' },
  { id: 'LOG-006', agent_name: 'Overstock Detection Agent', action: 'Flagged 5 SKUs as overstocked', timestamp: new Date(Date.now() - 10800000).toISOString(), status: 'Success' },
  { id: 'LOG-007', agent_name: 'Inventory Transfer Agent', action: 'Suggested 2 inter-warehouse transfers', timestamp: new Date(Date.now() - 14400000).toISOString(), status: 'Success' },
  { id: 'LOG-008', agent_name: 'Demand Forecast Agent', action: 'Running scheduled forecast update', timestamp: new Date(Date.now() - 600000).toISOString(), status: 'Running' },
];

export const mockAuditEntries: AuditEntry[] = [
  { id: 'AUD-001', user: 'Supervisor A', action: 'Approved Purchase Order', entity: 'PO-5501', timestamp: new Date(Date.now() - 86400000 * 4).toISOString(), details: 'Approved PO for 500 units of SKU-1004 from GlobalTech Supplies' },
  { id: 'AUD-002', user: 'Supervisor A', action: 'Modified Policy', entity: 'Safety Stock Level', timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), details: 'Changed safety stock from 40 to 50 units' },
  { id: 'AUD-003', user: 'Supervisor A', action: 'Approved Transfer', entity: 'TRF-003', timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), details: 'Approved transfer of 100 units SKU-1018 from WH-South to WH-West' },
  { id: 'AUD-004', user: 'Supervisor A', action: 'Rejected Purchase Order', entity: 'PO-5504', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), details: 'Rejected PO for 150 units of SKU-3044 — already overstocked' },
  { id: 'AUD-005', user: 'System', action: 'Auto-Generated Order', entity: 'PO-5503', timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), details: 'Replenishment agent auto-generated PO for SKU-1005' },
];

export const mockDatasetRows: DatasetRow[] = [
  { sku_id: 'SKU-1001', warehouse_id: 'WH-East', current_stock: 450, daily_sales_velocity: 15, supplier_id: 'SUP-01', lead_time: 5, safety_stock_level: 50 },
  { sku_id: 'SKU-1002', warehouse_id: 'WH-West', current_stock: 50, daily_sales_velocity: 20, supplier_id: 'SUP-02', lead_time: 7, safety_stock_level: 50 },
  { sku_id: 'SKU-1003', warehouse_id: 'WH-East', current_stock: 1200, daily_sales_velocity: 10, supplier_id: 'SUP-01', lead_time: 5, safety_stock_level: 50 },
  { sku_id: 'SKU-1004', warehouse_id: 'WH-North', current_stock: 10, daily_sales_velocity: 8, supplier_id: 'SUP-03', lead_time: 3, safety_stock_level: 50 },
  { sku_id: 'SKU-1005', warehouse_id: 'WH-South', current_stock: 300, daily_sales_velocity: 25, supplier_id: 'SUP-04', lead_time: 10, safety_stock_level: 50 },
];

export const mockSuppliers: SupplierData[] = [
  { supplier_id: 'SUP-01', name: 'GlobalTech Supplies', lead_time: 5, reliability_score: 92, region: 'North America' },
  { supplier_id: 'SUP-02', name: 'Pacific Logistics', lead_time: 7, reliability_score: 88, region: 'Asia Pacific' },
  { supplier_id: 'SUP-03', name: 'EuroMakers', lead_time: 3, reliability_score: 95, region: 'Europe' },
  { supplier_id: 'SUP-04', name: 'QuickShip Co.', lead_time: 10, reliability_score: 78, region: 'South America' },
];

export const mockWarehouses: WarehouseData[] = [
  { warehouse_id: 'WH-East', name: 'East Distribution Center', location: 'New York, NY', capacity: 5000, utilization: 72 },
  { warehouse_id: 'WH-West', name: 'West Distribution Center', location: 'Los Angeles, CA', capacity: 4000, utilization: 58 },
  { warehouse_id: 'WH-North', name: 'North Fulfillment Hub', location: 'Chicago, IL', capacity: 3500, utilization: 85 },
  { warehouse_id: 'WH-South', name: 'South Logistics Center', location: 'Houston, TX', capacity: 4500, utilization: 44 },
];
