import { useEffect, useState } from 'react';
import { getProductCatalog, getSuppliers, getWarehouses } from '../services/dataManagementService';
import { DatasetRow, SupplierData, WarehouseData } from '../types';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Database, Search } from 'lucide-react';
import { formatNumber } from '../utils/formatters';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

type Tab = 'Products' | 'Suppliers' | 'Warehouses';

const DataManagement = () => {
  const [products, setProducts] = useState<DatasetRow[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('Products');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, s, w] = await Promise.all([getProductCatalog(), getSuppliers(), getWarehouses()]);
        setProducts(p);
        setSuppliers(s);
        setWarehouses(w);
      } catch (e) { console.error(e); }
      finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  const tabs: Tab[] = ['Products', 'Suppliers', 'Warehouses'];

  const renderProductsTable = () => {
    const filtered = products.filter(p => p.sku_id.toLowerCase().includes(search.toLowerCase()) || p.warehouse_id.toLowerCase().includes(search.toLowerCase()));
    return (
      <table className="w-full text-sm text-left">
        <thead className="app-table-head text-slate-500 font-medium">
          <tr>
            <th className="px-6 py-4 uppercase tracking-wider text-xs">SKU ID</th>
            <th className="px-6 py-4 uppercase tracking-wider text-xs">Warehouse</th>
            <th className="px-6 py-4 uppercase tracking-wider text-xs text-right">Current Stock</th>
            <th className="px-6 py-4 uppercase tracking-wider text-xs text-right">Daily Velocity</th>
            <th className="px-6 py-4 uppercase tracking-wider text-xs">Supplier</th>
            <th className="px-6 py-4 uppercase tracking-wider text-xs text-right">Lead Time</th>
            <th className="px-6 py-4 uppercase tracking-wider text-xs text-right">Safety Stock</th>
          </tr>
        </thead>
        <tbody className="app-table-body divide-y divide-slate-100/80">
          {filtered.map(row => (
            <tr key={`${row.sku_id}-${row.warehouse_id}`} className="app-table-row">
              <td className="px-6 py-4 font-bold text-navy-900">{row.sku_id}</td>
              <td className="px-6 py-4 text-slate-600 font-medium">{row.warehouse_id}</td>
              <td className="px-6 py-4 text-right font-semibold text-slate-900">{formatNumber(row.current_stock)}</td>
              <td className="px-6 py-4 text-right text-slate-600">{row.daily_sales_velocity}</td>
              <td className="px-6 py-4 text-slate-600">{row.supplier_id}</td>
              <td className="px-6 py-4 text-right text-slate-600">{row.lead_time}d</td>
              <td className="px-6 py-4 text-right text-slate-600">{row.safety_stock_level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderSuppliersTable = () => {
    const filtered = suppliers.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.supplier_id.toLowerCase().includes(search.toLowerCase()));
    return (
      <table className="w-full text-sm text-left">
        <thead className="app-table-head text-slate-500 font-medium">
          <tr>
            <th className="px-6 py-4 uppercase tracking-wider text-xs">Supplier ID</th>
            <th className="px-6 py-4 uppercase tracking-wider text-xs">Name</th>
            <th className="px-6 py-4 uppercase tracking-wider text-xs text-right">Lead Time</th>
            <th className="px-6 py-4 uppercase tracking-wider text-xs text-center">Reliability</th>
            <th className="px-6 py-4 uppercase tracking-wider text-xs">Region</th>
          </tr>
        </thead>
        <tbody className="app-table-body divide-y divide-slate-100/80">
          {filtered.map(s => (
            <tr key={s.supplier_id} className="app-table-row">
              <td className="px-6 py-4 font-bold text-navy-900">{s.supplier_id}</td>
              <td className="px-6 py-4 text-slate-900 font-medium">{s.name}</td>
              <td className="px-6 py-4 text-right text-slate-600">{s.lead_time}d</td>
              <td className="px-6 py-4 text-center"><Badge variant={s.reliability_score > 90 ? 'success' : s.reliability_score > 80 ? 'warning' : 'error'}>{s.reliability_score}/100</Badge></td>
              <td className="px-6 py-4 text-slate-600">{s.region}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderWarehousesTable = () => {
    const filtered = warehouses.filter(w => w.name.toLowerCase().includes(search.toLowerCase()) || w.warehouse_id.toLowerCase().includes(search.toLowerCase()));
    return (
      <table className="w-full text-sm text-left">
        <thead className="app-table-head text-slate-500 font-medium">
          <tr>
            <th className="px-6 py-4 uppercase tracking-wider text-xs">Warehouse ID</th>
            <th className="px-6 py-4 uppercase tracking-wider text-xs">Name</th>
            <th className="px-6 py-4 uppercase tracking-wider text-xs">Location</th>
            <th className="px-6 py-4 uppercase tracking-wider text-xs text-right">Capacity</th>
            <th className="px-6 py-4 uppercase tracking-wider text-xs">Utilization</th>
          </tr>
        </thead>
        <tbody className="app-table-body divide-y divide-slate-100/80">
          {filtered.map(w => (
            <tr key={w.warehouse_id} className="app-table-row">
              <td className="px-6 py-4 font-bold text-navy-900">{w.warehouse_id}</td>
              <td className="px-6 py-4 text-slate-900 font-medium">{w.name}</td>
              <td className="px-6 py-4 text-slate-600">{w.location}</td>
              <td className="px-6 py-4 text-right font-semibold text-slate-900">{formatNumber(w.capacity)}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3 w-40">
                  <ProgressBar value={w.utilization} max={100} colorClass={w.utilization > 80 ? 'bg-danger-500' : w.utilization > 60 ? 'bg-warning-500' : 'bg-success-500'} />
                  <span className="text-sm font-semibold text-slate-900">{w.utilization}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Data Management</h1>
          <p className="text-sm text-slate-500 mt-1">Browse and search system datasets.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Database className="h-4 w-4" />
          <span>{products.length + suppliers.length + warehouses.length} total records</span>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card noPadding hoverEffect>
          <CardHeader className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>{activeTab} Catalog</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
                className="app-input-surface w-64 rounded-2xl py-2.5 pl-9 pr-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-400/60" />
            </div>
          </CardHeader>
          <div className="px-6 pb-3 flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); setSearch(''); }}
                className={`px-4 py-1.5 rounded-2xl text-xs font-semibold transition-colors ${activeTab === tab ? 'app-button-primary text-white' : 'app-button-secondary text-slate-600 hover:text-white'}`}
              >{tab}</button>
            ))}
          </div>
          <div className="overflow-x-auto">
            {activeTab === 'Products' && renderProductsTable()}
            {activeTab === 'Suppliers' && renderSuppliersTable()}
            {activeTab === 'Warehouses' && renderWarehousesTable()}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DataManagement;
