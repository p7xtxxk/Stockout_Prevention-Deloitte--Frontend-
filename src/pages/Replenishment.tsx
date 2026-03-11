import { useEffect, useState } from "react";
import {
  getReplenishmentRecommendations,
  approveOrder,
  rejectOrder,
} from "../services/replenishmentService";
import { ReplenishmentRecommendation } from "../types";
import { Card, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Bot, CheckCircle, XCircle, Edit3, Loader2, Save } from "lucide-react";
import { formatCurrency, formatDate } from "../utils/formatters";
import { motion, Variants } from "framer-motion";

const Replenishment = () => {
  const [recommendations, setRecommendations] = useState<
    ReplenishmentRecommendation[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Track quantities that are actively being modified by user
  const [editingQty, setEditingQty] = useState<Record<string, number>>({});
  const [isEditing, setIsEditing] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getReplenishmentRecommendations();
        setRecommendations(data);
      } catch (error) {
        console.error("Error fetching replenishments", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await approveOrder(id);
      setRecommendations((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      await rejectOrder(id);
      setRecommendations((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "Critical":
        return <Badge variant="error">Critical</Badge>;
      case "High":
        return <Badge variant="warning">High</Badge>;
      case "Medium":
        return <Badge variant="info">Medium</Badge>;
      default:
        return <Badge>{urgency}</Badge>;
    }
  };

  const handleEditQty = (id: string, currentQty: number) => {
    setIsEditing(id);
    setEditingQty((prev) => ({ ...prev, [id]: currentQty }));
  };

  const handleSaveQty = (id: string) => {
    // In a real app, this would hit API or update Zustand
    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, reorder_quantity: editingQty[id] || r.reorder_quantity }
          : r,
      ),
    );
    setIsEditing(null);
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
            AI Replenishment Engine
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review and approve AI-generated purchase order recommendations.
          </p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card
          hoverEffect
          className="mb-6 bg-linear-to-r from-primary-50/90 to-info-50/80 border-primary-100"
        >
          <div className="p-6 flex items-start space-x-4">
            <div className="p-3 bg-primary-100 rounded-2xl text-primary-600 shrink-0 shadow-sm">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 className="bg-linear-to-r from-primary-700 to-info-700 bg-clip-text text-lg font-bold text-transparent">
                ARS Prediction Engine Active
              </h3>
              <p className="text-slate-600 mt-1 text-sm max-w-3xl">
                The Auto Replenishment System has analyzed historical demand,
                upcoming promotions, and current supplier lead times. Review the{" "}
                {recommendations.length} pending recommendations below.
                Approving will automatically instantiate a Purchase Order.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card noPadding hoverEffect>
          <CardHeader className="py-4">
            <CardTitle>Pending AI Recommendations</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="app-table-head text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">
                    SKU
                  </th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">
                    Supplier Details
                  </th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs text-right">
                    Reorder Qty
                  </th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs text-right">
                    Est. Cost
                  </th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs text-right">
                    Delivery Date
                  </th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs text-center">
                    Urgency
                  </th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="app-table-body divide-y divide-slate-100/80">
                {recommendations.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-slate-500"
                    >
                      No pending replenishment recommendations.
                    </td>
                  </tr>
                ) : (
                  recommendations.map((row) => (
                    <tr key={row.id} className="app-table-row">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">
                          {row.sku}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {row.warehouse}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">
                          {row.recommended_supplier}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-slate-500">
                            Reliability score:
                          </span>
                          <Badge
                            variant={
                              row.supplier_reliability_score > 90
                                ? "success"
                                : "warning"
                            }
                          >
                            {row.supplier_reliability_score}/100
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isEditing === row.id ? (
                          <div className="flex items-center justify-end">
                            <input
                              type="number"
                              className="app-input-surface w-20 rounded-xl bg-white/80 px-2 py-1 text-right font-bold text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              value={editingQty[row.id] || ""}
                              onChange={(e) =>
                                setEditingQty((prev) => ({
                                  ...prev,
                                  [row.id]: parseInt(e.target.value) || 0,
                                }))
                              }
                              autoFocus
                              onBlur={() => handleSaveQty(row.id)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveQty(row.id);
                                if (e.key === "Escape") setIsEditing(null);
                              }}
                            />
                          </div>
                        ) : (
                          <div
                            className="font-bold text-slate-900 cursor-pointer hover:text-primary-600 transition-colors inline-flex items-center gap-1 border-b border-dashed border-slate-300 hover:border-primary-400"
                            onClick={() =>
                              handleEditQty(row.id, row.reorder_quantity)
                            }
                            title="Click to edit quantity"
                          >
                            {row.reorder_quantity}
                          </div>
                        )}
                        <div className="text-xs text-slate-500 mt-0.5">
                          Units
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-900">
                        {formatCurrency(row.estimated_cost)}
                      </td>
                      <td className="px-6 py-4 text-right text-slate-600">
                        {formatDate(row.expected_delivery_date)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getUrgencyBadge(row.urgency)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleApprove(row.id)}
                            disabled={processingId === row.id}
                            className="rounded-xl bg-success-50/90 p-1.5 text-success-600 shadow-sm transition-colors hover:bg-success-100 disabled:opacity-50"
                            title="Approve Order"
                          >
                            {processingId === row.id ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <CheckCircle className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            className="rounded-xl bg-white/70 p-1.5 text-slate-600 shadow-sm transition-colors hover:bg-primary-50 hover:text-primary-600 disabled:opacity-50"
                            disabled={processingId === row.id}
                            title="Modify Quantity"
                            onClick={() =>
                              handleEditQty(row.id, row.reorder_quantity)
                            }
                          >
                            {isEditing === row.id ? (
                              <Save className="h-5 w-5 text-indigo-600" />
                            ) : (
                              <Edit3 className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleReject(row.id)}
                            disabled={processingId === row.id}
                            className="rounded-xl bg-danger-50/90 p-1.5 text-danger-600 shadow-sm transition-colors hover:bg-danger-100 disabled:opacity-50"
                            title="Reject Order"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Replenishment;
