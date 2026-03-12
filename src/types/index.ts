export interface SKUInventory {
  sku_id: string;
  warehouse: string;
  current_stock: number;
  daily_demand: number;
  coverage_days: number;
  stock_status: 'Healthy' | 'At Risk' | 'Overstock';
}

export interface DemandVelocity {
  sku_id: string;
  velocity: number;
  trend: 'Up' | 'Down' | 'Stable';
}

export interface DemandSpikeAlert {
  id: string;
  sku_id: string;
  severity: 'High' | 'Medium' | 'Low';
  timestamp: string;
}

export interface StockoutRisk {
  sku: string;
  warehouse: string;
  coverage_days: number;
  lead_time: number;
  risk_level: 'High' | 'Medium' | 'Low';
  recommended_action: string;
}

export interface ReplenishmentRecommendation {
  id: string;
  sku: string;
  warehouse: string;
  reorder_quantity: number;
  urgency: 'Critical' | 'High' | 'Medium' | 'Low';
  recommended_supplier: string;
  lead_time: number;
  supplier_reliability_score: number;
  expected_delivery_date: string;
  estimated_cost: number;
}

export interface ShipmentStatus {
  shipment_id: string;
  supplier: string;
  order_id: string;
  shipment_status: 'Shipped' | 'In Transit' | 'Delayed' | 'Delivered';
  expected_delivery: string;
  delay_indicator: boolean;
}

export interface Alert {
  id: string;
  type: 'Stockout' | 'Demand' | 'Shipment';
  message: string;
  timestamp: string;
  read: boolean;
}

export interface InventoryMetrics {
  total_skus: number;
  total_inventory_units: number;
  warehouse_count: number;
  active_stockout_risks: number;
  healthy_skus: number;
  at_risk_skus: number;
  overstock_skus: number;
}

export interface OverstockItem {
  sku: string;
  warehouse: string;
  current_stock: number;
  daily_demand: number;
  coverage_days: number;
  excess_units: number;
  threshold: number;
  suggestion: string;
}

export interface PurchaseOrder {
  id: string;
  sku: string;
  quantity: number;
  supplier: string;
  order_date: string;
  expected_delivery: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected' | 'Shipped' | 'Delivered';
}

export interface InventoryTransfer {
  id: string;
  sku: string;
  source_warehouse: string;
  destination_warehouse: string;
  quantity: number;
  status: 'Pending' | 'In Transit' | 'Completed';
  created_at: string;
}

export interface PolicySetting {
  key: string;
  label: string;
  value: number;
  unit: string;
  description: string;
}

export interface AgentLog {
  id: string;
  agent_name: string;
  action: string;
  timestamp: string;
  status: 'Success' | 'Error' | 'Running';
}

export interface AuditEntry {
  id: string;
  user: string;
  action: string;
  entity: string;
  timestamp: string;
  details: string;
}

export interface DatasetRow {
  sku_id: string;
  warehouse_id: string;
  current_stock: number;
  daily_sales_velocity: number;
  supplier_id: string;
  lead_time: number;
  safety_stock_level: number;
}

export interface SupplierData {
  supplier_id: string;
  name: string;
  lead_time: number;
  reliability_score: number;
  region: string;
}

export interface WarehouseData {
  warehouse_id: string;
  name: string;
  location: string;
  capacity: number;
  utilization: number;
}
