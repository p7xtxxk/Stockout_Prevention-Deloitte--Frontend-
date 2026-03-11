import { useEffect, useState } from "react";
import { getShipmentStatus } from "../services/shipmentService";
import { ShipmentStatus as ShipmentStatusType } from "../types";
import { Card, CardHeader, CardTitle } from "../components/ui/Card";
import { AlertCircle, Truck, PackageCheck, MapPin } from "lucide-react";
import { formatDate } from "../utils/formatters";
import {
  Timeline,
  TimelineStep,
  TimelineStatus,
} from "../components/ui/Timeline";
import { motion, Variants } from "framer-motion";

const ShipmentMonitoring = () => {
  const [shipments, setShipments] = useState<ShipmentStatusType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getShipmentStatus();
        setShipments(data);
      } catch (error) {
        console.error("Error fetching shipments", error);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <PackageCheck className="h-5 w-5 text-success-500" />;
      case "Delayed":
        return <AlertCircle className="h-5 w-5 text-danger-500" />;
      case "In Transit":
        return <Truck className="h-5 w-5 text-info-500" />;
      default:
        return <MapPin className="h-5 w-5 text-slate-500" />;
    }
  };

  const getTimelineSteps = (status: string, date: string): TimelineStep[] => {
    const defaultDate = formatDate(date);
    const steps: TimelineStep[] = [
      { label: "Ordered", status: "completed" as TimelineStatus },
      { label: "Shipped", status: "pending" as TimelineStatus },
      { label: "In Transit", status: "pending" as TimelineStatus },
      { label: "Delivered", status: "pending" as TimelineStatus },
    ];

    if (status === "Shipped") {
      steps[1].status = "active";
      steps[1].date = defaultDate;
    } else if (status === "In Transit" || status === "Delayed") {
      steps[1].status = "completed";
      steps[2].status = "active";
      steps[2].date = defaultDate;
      if (status === "Delayed") {
        steps[2].label = "Delayed";
      }
    } else if (status === "Delivered") {
      steps[1].status = "completed";
      steps[2].status = "completed";
      steps[3].status = "completed";
      steps[3].date = defaultDate;
    }

    return steps;
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
            Shipment Monitoring
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track inbound purchase orders and logistics workflows.
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card hoverEffect className="app-stat-tile">
          <div className="p-4 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-bold text-slate-900">
              {shipments.length}
            </span>
            <span className="text-sm font-medium text-slate-500 mt-1">
              Total Active POs
            </span>
          </div>
        </Card>
        <Card className="app-stat-tile">
          <div className="p-4 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-bold text-info-600">
              {
                shipments.filter((s) => s.shipment_status === "In Transit")
                  .length
              }
            </span>
            <span className="text-sm font-medium text-slate-500 mt-1">
              In Transit
            </span>
          </div>
        </Card>
        <Card hoverEffect className="bg-danger-50/80 border-danger-100">
          <div className="p-4 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-bold text-danger-600">
              {shipments.filter((s) => s.delay_indicator).length}
            </span>
            <span className="text-sm font-medium text-danger-800 mt-1">
              Delayed Shipments
            </span>
          </div>
        </Card>
        <Card className="app-stat-tile">
          <div className="p-4 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-bold text-success-600">
              {
                shipments.filter((s) => s.shipment_status === "Delivered")
                  .length
              }
            </span>
            <span className="text-sm font-medium text-slate-500 mt-1">
              Delivered (30d)
            </span>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card noPadding hoverEffect>
          <CardHeader className="py-4">
            <CardTitle>Inbound Shipments Ledger</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="app-table-head text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">
                    Tracking ID
                  </th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs w-2/5">
                    Shipping Progress
                  </th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">
                    Origin PO #
                  </th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs text-right">
                    Expected Delivery
                  </th>
                </tr>
              </thead>
              <tbody className="app-table-body divide-y divide-slate-100/80">
                {shipments.map((row) => (
                  <tr
                    key={row.shipment_id}
                    className={`app-table-row group ${row.delay_indicator ? "bg-danger-50/20" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(row.shipment_status)}
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {row.shipment_id}
                          </span>
                          <span className="text-xs text-slate-500">
                            {row.supplier}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6" style={{ minWidth: "350px" }}>
                      <Timeline
                        steps={getTimelineSteps(
                          row.shipment_status,
                          row.expected_delivery,
                        )}
                      />
                    </td>
                    <td className="px-6 py-4 font-bold text-primary-600 cursor-pointer hover:underline">
                      {row.order_id}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`font-bold ${row.delay_indicator ? "text-danger-600" : "text-slate-900"}`}
                      >
                        {formatDate(row.expected_delivery)}
                      </span>
                      {row.delay_indicator && (
                        <p className="text-xs text-danger-500 mt-1 font-bold flex items-center justify-end">
                          <AlertCircle className="h-3.5 w-3.5 mr-1" /> Requires
                          Attention
                        </p>
                      )}
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

export default ShipmentMonitoring;
