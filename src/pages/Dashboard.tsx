import { useEffect, useState } from "react";
import {
  getInventory,
  getInventoryMetrics,
} from "../services/inventoryService";
import { SKUInventory, InventoryMetrics } from "../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Package,
  Box,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Search,
} from "lucide-react";
import { formatNumber, cn } from "../utils/formatters";
import { motion, Variants } from "framer-motion";
import { ProgressBar } from "../components/ui/ProgressBar";

const PIE_COLORS = {
  Healthy: "#10b981",
  "At Risk": "#f43f5e",
  Overstock: "#3b82f6",
};

const Dashboard = () => {
  const [inventory, setInventory] = useState<SKUInventory[]>([]);
  const [metrics, setMetrics] = useState<InventoryMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invData, metricsData] = await Promise.all([
          getInventory(),
          getInventoryMetrics(),
        ]);
        setInventory(invData);
        setMetrics(metricsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Pre-process chart data
  const pieData = [
    { name: "Healthy", value: metrics?.healthy_skus || 0 },
    { name: "At Risk", value: metrics?.at_risk_skus || 0 },
    { name: "Overstock", value: metrics?.overstock_skus || 0 },
  ];

  // Group inventory by warehouse for bar chart
  const warehouseMap = inventory.reduce(
    (acc, curr) => {
      acc[curr.warehouse] = (acc[curr.warehouse] || 0) + curr.current_stock;
      return acc;
    },
    {} as Record<string, number>,
  );
  const warehouseData = Object.entries(warehouseMap).map(([name, stock]) => ({
    name,
    stock,
  }));

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Inventory Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            High-level view of inventory health and metrics.
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="app-button-secondary rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-300">
            Export Report
          </button>
          <button className="app-button-primary rounded-2xl px-4 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:brightness-105">
            Run Replenishment AI
          </button>
        </div>
      </motion.div>

      {/* Primary Metrics */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        <Card hoverEffect className="border-l-4 border-l-primary-500">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total SKUs</p>
              <h4 className="text-3xl font-bold text-slate-900 mt-1">
                {formatNumber(metrics?.total_skus || 0)}
              </h4>
            </div>
            <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl">
              <Package className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card hoverEffect>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Units</p>
              <h4 className="text-3xl font-bold text-slate-900 mt-1">
                {formatNumber(metrics?.total_inventory_units || 0)}
              </h4>
            </div>
            <div className="p-3 bg-slate-100 text-slate-600 rounded-xl shadow-inner">
              <Box className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Active Stockout Risks
              </p>
              <h4 className="text-3xl font-bold text-slate-900 mt-1">
                {formatNumber(metrics?.active_stockout_risks || 0)}
              </h4>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-xl shadow-inner">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card hoverEffect>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Avg Coverage</p>
              <h4 className="text-3xl font-bold text-slate-900 mt-1">
                33{" "}
                <span className="text-lg font-medium text-slate-400">Days</span>
              </h4>
            </div>
            <div className="p-3 bg-success-50 text-success-600 rounded-2xl">
              <TrendingUp className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Health Indicator Metrics */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6"
      >
        <Card>
          <CardContent className="p-5 flex items-center space-x-4">
            <CheckCircle className="h-10 w-10 text-success-500" />
            <div>
              <p className="text-sm font-medium text-slate-500">Healthy SKUs</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {formatNumber(metrics?.healthy_skus || 0)}
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center space-x-4">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <div>
              <p className="text-sm font-medium text-slate-500">At Risk SKUs</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {formatNumber(metrics?.at_risk_skus || 0)}
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center space-x-4">
            <Package className="h-10 w-10 text-info-500 drop-shadow-sm" />
            <div>
              <p className="text-sm font-medium text-slate-500">
                Overstock SKUs
              </p>
              <h3 className="text-2xl font-bold text-slate-900">
                {formatNumber(metrics?.overstock_skus || 0)}
              </h3>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Row */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6"
      >
        <Card hoverEffect className="flex flex-col">
          <CardHeader>
            <CardTitle>Inventory Health Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[entry.name as keyof typeof PIE_COLORS]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(11,20,46,0.97)",
                    border: "1px solid rgba(163,187,251,0.15)",
                    borderRadius: "12px",
                    color: "#d8e5f8",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                  }}
                />
                <Legend wrapperStyle={{ color: "#94afd4" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card hoverEffect className="flex flex-col">
          <CardHeader>
            <CardTitle>Total Stock by Warehouse</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={warehouseData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(163,187,251,0.1)"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#7b9bb8" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#7b9bb8" }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(124,150,246,0.07)" }}
                  contentStyle={{
                    background: "rgba(11,20,46,0.97)",
                    border: "1px solid rgba(163,187,251,0.15)",
                    borderRadius: "12px",
                    color: "#d8e5f8",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                  }}
                />
                <Bar
                  dataKey="stock"
                  fill="url(#colorStock)"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                >
                  <defs>
                    <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7c96f6" stopOpacity={1} />
                      <stop offset="100%" stopColor="#5a6ef0" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Table */}
      <motion.div variants={itemVariants}>
        <Card noPadding hoverEffect>
          <CardHeader className="px-6 py-5 flex flex-row items-center justify-between">
            <CardTitle>SKU Inventory Details</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filter SKUs..."
                className="app-input-surface w-64 rounded-2xl py-2.5 pl-9 pr-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-400/60"
              />
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="app-table-head text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">
                    SKU ID
                  </th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">
                    Warehouse
                  </th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs text-right">
                    Current Stock
                  </th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs text-right">
                    Daily Demand
                  </th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs text-right">
                    Coverage Days
                  </th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="app-table-body divide-y divide-slate-100/80">
                {inventory.map((row) => (
                  <tr
                    key={`${row.sku_id}-${row.warehouse}`}
                    className="app-table-row group"
                  >
                    <td className="px-6 py-4 font-bold text-navy-900">
                      {row.sku_id}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {row.warehouse}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-end w-32 ml-auto">
                        <span className="text-slate-900 font-semibold mb-1">
                          {formatNumber(row.current_stock)}
                        </span>
                        <ProgressBar
                          value={row.current_stock}
                          max={1500}
                          colorClass={
                            row.current_stock < 100
                              ? "bg-danger-500"
                              : "bg-primary-500"
                          }
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-right font-medium">
                      {row.daily_demand}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-md text-sm font-bold",
                          row.coverage_days < 5
                            ? "bg-red-50 text-red-700"
                            : "text-slate-900",
                        )}
                      >
                        {row.coverage_days}d
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge
                        variant={
                          row.stock_status === "Healthy"
                            ? "success"
                            : row.stock_status === "At Risk"
                              ? "error"
                              : "info"
                        }
                        className="shadow-sm"
                      >
                        {row.stock_status}
                      </Badge>
                    </td>
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

export default Dashboard;
