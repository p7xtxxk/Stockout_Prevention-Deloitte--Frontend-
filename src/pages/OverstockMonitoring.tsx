import { useEffect, useState } from 'react';
import { getOverstockItems } from '../services/overstockService';
import { OverstockItem } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { PackageX, TrendingDown, AlertCircle, Search } from 'lucide-react';
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

const PIE_COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#f43f5e', '#8b5cf6'];

const OverstockMonitoring = () => {
  const [items, setItems] = useState<OverstockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try { setItems(await getOverstockItems()); }
      catch (e) { console.error(e); }
      finally { setIsLoading(false); }
    };
    fetch();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  const filtered = items.filter(i => i.sku.toLowerCase().includes(search.toLowerCase()) || i.warehouse.toLowerCase().includes(search.toLowerCase()));

  const totalExcess = items.reduce((s, i) => s + i.excess_units, 0);
  const avgCoverage = Math.round(items.reduce((s, i) => s + i.coverage_days, 0) / items.length);

  const coverageDistribution = items.map(i => ({ name: i.sku, coverage: i.coverage_days }));
  const warehouseDistribution = Object.entries(
    items.reduce((acc, i) => { acc[i.warehouse] = (acc[i.warehouse] || 0) + i.excess_units; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overstock Monitoring</h1>
          <p className="text-sm text-slate-500 mt-1">Detect inventory inefficiencies and optimize stock levels.</p>
        </div>
      </motion.div>

      {/* Metric Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <Card hoverEffect className="border-l-4 border-l-info-500">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Overstocked SKUs</p>
              <h4 className="text-3xl font-bold text-slate-900 mt-1">{items.length}</h4>
            </div>
            <div className="p-3 bg-info-50 text-info-500 rounded-2xl"><PackageX className="h-6 w-6" /></div>
          </CardContent>
        </Card>
        <Card hoverEffect>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Excess Units</p>
              <h4 className="text-3xl font-bold text-slate-900 mt-1">{formatNumber(totalExcess)}</h4>
            </div>
            <div className="p-3 bg-warning-50 text-warning-500 rounded-2xl"><TrendingDown className="h-6 w-6" /></div>
          </CardContent>
        </Card>
        <Card hoverEffect>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Avg Coverage Days</p>
              <h4 className="text-3xl font-bold text-slate-900 mt-1">{avgCoverage} <span className="text-lg font-medium text-slate-400">days</span></h4>
            </div>
            <div className="p-3 bg-danger-50 text-danger-500 rounded-2xl"><AlertCircle className="h-6 w-6" /></div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card hoverEffect className="flex flex-col">
          <CardHeader><CardTitle>Coverage Days by SKU</CardTitle></CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={coverageDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(163,187,251,0.1)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#7b9bb8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7b9bb8' }} />
                <Tooltip contentStyle={{ background: 'rgba(11,20,46,0.97)', border: '1px solid rgba(163,187,251,0.15)', borderRadius: '12px', color: '#d8e5f8', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }} />
                <Bar dataKey="coverage" fill="url(#colorOverstock)" radius={[6, 6, 0, 0]} barSize={40}>
                  <defs>
                    <linearGradient id="colorOverstock" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                      <stop offset="100%" stopColor="#d97706" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card hoverEffect className="flex flex-col">
          <CardHeader><CardTitle>Excess Units by Warehouse</CardTitle></CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={warehouseDistribution} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                  {warehouseDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(11,20,46,0.97)', border: '1px solid rgba(163,187,251,0.15)', borderRadius: '12px', color: '#d8e5f8', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }} />
                <Legend wrapperStyle={{ color: '#94afd4' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants}>
        <Card noPadding hoverEffect>
          <CardHeader className="px-6 py-5 flex flex-row items-center justify-between">
            <CardTitle>Overstocked SKUs</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Filter SKUs…" value={search} onChange={e => setSearch(e.target.value)}
                className="app-input-surface w-64 rounded-2xl py-2.5 pl-9 pr-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-400/60" />
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="app-table-head text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">SKU</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">Warehouse</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs text-right">Current Stock</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs text-right">Coverage Days</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs text-right">Excess Units</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">Suggestion</th>
                </tr>
              </thead>
              <tbody className="app-table-body divide-y divide-slate-100/80">
                {filtered.map(row => (
                  <tr key={`${row.sku}-${row.warehouse}`} className="app-table-row">
                    <td className="px-6 py-4 font-bold text-navy-900">{row.sku}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{row.warehouse}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-end w-32 ml-auto">
                        <span className="text-slate-900 font-semibold mb-1">{formatNumber(row.current_stock)}</span>
                        <ProgressBar value={row.current_stock} max={1500} colorClass="bg-info-500" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="px-2.5 py-1 rounded-md text-sm font-bold bg-warning-50 text-warning-500">{row.coverage_days}d</span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-danger-500">+{formatNumber(row.excess_units)}</td>
                    <td className="px-6 py-4"><Badge variant="info">{row.suggestion}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default OverstockMonitoring;
