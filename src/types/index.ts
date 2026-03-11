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
