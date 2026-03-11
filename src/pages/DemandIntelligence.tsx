import { useEffect, useState } from "react";
import { getDemandForecast, getDemandSpikes } from "../services/demandService";
import { DemandVelocity, DemandSpikeAlert } from "../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatNumber, formatDistanceToNow } from "../utils/formatters";
import {
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { motion, Variants } from "framer-motion";

const DemandIntelligence = () => {
  const [velocityData, setVelocityData] = useState<DemandVelocity[]>([]);
  const [spikes, setSpikes] = useState<DemandSpikeAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vData, sData] = await Promise.all([
          getDemandForecast(),
          getDemandSpikes(),
        ]);
        setVelocityData(vData);
        setSpikes(sData);
      } catch (error) {
        console.error("Error fetching demand data", error);
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

  // Generate mock time-series data based on velocity
  const forecastChartData = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dayData: any = {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
    };

    velocityData.forEach((sku) => {
      const base = sku.velocity;
      const variation =
        sku.trend === "Up" ? 1.1 : sku.trend === "Down" ? 0.9 : 1;
      dayData[sku.sku_id] = Math.max(
        0,
        Math.floor(base * Math.pow(variation, i) + (Math.random() * 20 - 10)),
      );
    });

    return dayData;
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "Up":
        return <ArrowUpRight className="h-4 w-4 text-success-500" />;
      case "Down":
        return <ArrowDownRight className="h-4 w-4 text-danger-500" />;
      default:
        return <Minus className="h-4 w-4 text-slate-400" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "High":
        return <Badge variant="error">High</Badge>;
      case "Medium":
        return <Badge variant="warning">Medium</Badge>;
      case "Low":
        return <Badge variant="info">Low</Badge>;
      default:
        return <Badge>{severity}</Badge>;
    }
  };

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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Demand Intelligence
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            AI-powered demand forecasts and trend anomalies.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <Card hoverEffect className="flex flex-col">
            <CardHeader>
              <CardTitle>7-Day Demand Forecast (AI Modeled)</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-80 lg:min-h-[350px]">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={forecastChartData}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(163,187,251,0.1)"
                  />
                  <XAxis
                    dataKey="day"
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
                    contentStyle={{
                      background: "rgba(11,20,46,0.97)",
                      border: "1px solid rgba(163,187,251,0.15)",
                      borderRadius: "12px",
                      color: "#d8e5f8",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#94afd4" }} />
                  {velocityData.map((sku, idx) => (
                    <Line
                      key={sku.sku_id}
                      type="monotone"
                      dataKey={sku.sku_id}
                      stroke={
                        ["#5a6ef0", "#10b981", "#f59e0b", "#f43f5e"][idx % 4]
                      }
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                      activeDot={{
                        r: 6,
                        strokeWidth: 0,
                        fill: ["#5a6ef0", "#10b981", "#f59e0b", "#f43f5e"][
                          idx % 4
                        ],
                      }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card noPadding hoverEffect>
            <CardHeader className="py-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary-500" />
                <CardTitle>Top Demanded SKUs (Velocity)</CardTitle>
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="app-table-head text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-4 uppercase tracking-wider text-xs">
                      SKU ID
                    </th>
                    <th className="px-6 py-4 uppercase tracking-wider text-xs text-right">
                      Velocity (Units/Day)
                    </th>
                    <th className="px-6 py-4 uppercase tracking-wider text-xs text-center">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody className="app-table-body divide-y divide-slate-100/80">
                  {velocityData.map((row) => (
                    <tr key={row.sku_id} className="app-table-row">
                      <td className="px-6 py-4 font-bold text-navy-800">
                        {row.sku_id}
                      </td>
                      <td className="px-6 py-4 text-slate-900 text-right font-medium">
                        {formatNumber(row.velocity)}
                      </td>
                      <td className="px-6 py-4 flex justify-center items-center space-x-2">
                        {getTrendIcon(row.trend)}
                        <span className="text-slate-600">{row.trend}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          <Card
            noPadding
            hoverEffect
            className="relative overflow-hidden border-red-200/70"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-danger-500 to-rose-500"></div>
            <CardHeader className="border-b border-danger-100/80 bg-danger-50/35 py-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-danger-500" />
                <CardTitle className="text-danger-900">
                  Demand Spike Alerts
                </CardTitle>
              </div>
            </CardHeader>
            <div className="max-h-150 divide-y divide-slate-100 overflow-y-auto">
              {spikes.length === 0 ? (
                <div className="px-6 py-8 text-center text-slate-500">
                  No active spikes detected
                </div>
              ) : (
                spikes.map((spike) => (
                  <div
                    key={spike.id}
                    className="p-4 transition-colors hover:bg-white/45"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-primary-900">
                        {spike.sku_id}
                      </div>
                      {getSeverityBadge(spike.severity)}
                    </div>
                    <p className="text-sm text-slate-600">
                      Unusual purchasing pattern detected. Might lead to
                      premature stockout.
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      Alert triggered{" "}
                      {formatDistanceToNow(new Date(spike.timestamp))} ago
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DemandIntelligence;
