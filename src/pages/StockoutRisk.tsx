import { useEffect, useState } from "react";
import { getStockoutRisks } from "../services/stockoutService";
import { StockoutRisk as StockoutRiskType } from "../types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { AlertCircle, ArrowRight, ShieldAlert, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, Variants } from "framer-motion";

const StockoutRisk = () => {
  const [risks, setRisks] = useState<StockoutRiskType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStockoutRisks();
        // Sort by risk level priority
        const sorted = data.sort((a, b) => {
          const rank = { High: 3, Medium: 2, Low: 1 };
          return rank[b.risk_level] - rank[a.risk_level];
        });
        setRisks(sorted);
      } catch (error) {
        console.error("Error fetching stockout risks", error);
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

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "High":
        return (
          <Badge variant="error" className="py-1 px-3">
            High Risk
          </Badge>
        );
      case "Medium":
        return (
          <Badge variant="warning" className="py-1 px-3">
            Medium Risk
          </Badge>
        );
      case "Low":
        return (
          <Badge variant="info" className="py-1 px-3">
            Low Risk
          </Badge>
        );
      default:
        return <Badge className="py-1 px-3">{level}</Badge>;
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
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
            Stockout Risk Monitoring
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Proactive detection of inventory depletion against lead times.
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card
          hoverEffect
          className="bg-linear-to-br from-rose-500/15 to-transparent border-rose-500/25"
        >
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-danger-500/15 rounded-2xl text-danger-500">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-rose-400">
                Critical Risks
              </p>
              <h3 className="text-3xl font-bold text-white mt-1">
                {risks.filter((r) => r.risk_level === "High").length}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card
          hoverEffect
          className="bg-linear-to-br from-amber-500/12 to-transparent border-amber-500/22"
        >
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-warning-500/15 rounded-2xl text-warning-400">
              <AlertCircle className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-400">Watchlist</p>
              <h3 className="text-3xl font-bold text-white mt-1">
                {risks.filter((r) => r.risk_level === "Medium").length}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card
          hoverEffect
          className="bg-linear-to-br from-emerald-500/12 to-transparent border-emerald-500/22"
        >
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-success-500/15 rounded-2xl text-success-500">
              <Check className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-400">
                Healthy Stock
              </p>
              <h3 className="text-3xl font-bold text-white mt-1">
                {risks.filter((r) => r.risk_level === "Low").length}
              </h3>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card noPadding hoverEffect>
          <CardHeader className="py-4">
            <CardTitle>Active Stockout Predictions</CardTitle>
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
                    Coverage Left (Days)
                  </th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs text-right">
                    Supplier Lead Time
                  </th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs text-center">
                    Risk Level
                  </th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">
                    Recommended Action
                  </th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="app-table-body divide-y divide-slate-100/80">
                {risks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-slate-500"
                    >
                      No active stockout risks detected. Inventory levels are
                      healthy.
                    </td>
                  </tr>
                ) : (
                  risks.map((row, idx) => {
                    const isCritical = row.coverage_days < row.lead_time;

                    return (
                      <tr
                        key={`${row.sku}-${row.warehouse}-${idx}`}
                        className="app-table-row"
                      >
                        <td className="px-6 py-4 font-bold text-navy-800">
                          {row.sku}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {row.warehouse}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`font-bold ${isCritical ? "text-danger-600" : "text-slate-900"}`}
                          >
                            {row.coverage_days}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 text-right">
                          {row.lead_time} days
                        </td>
                        <td className="px-6 py-4 text-center">
                          {getRiskBadge(row.risk_level)}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-700">
                          {row.recommended_action}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to="/replenishment"
                            className="inline-flex items-center text-sm font-bold text-primary-600 hover:text-primary-800"
                          >
                            Review PO <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default StockoutRisk;
