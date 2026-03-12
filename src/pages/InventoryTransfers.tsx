import { useEffect, useState } from 'react';
import { getTransfers, approveTransfer, rejectTransfer } from '../services/transferService';
import { InventoryTransfer } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ArrowRightLeft, Clock, Truck, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { formatNumber, formatDate } from '../utils/formatters';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const statusBadge = (status: InventoryTransfer['status']) => {
  const map: Record<InventoryTransfer['status'], 'warning' | 'info' | 'success'> = {
    'Pending': 'warning',
    'In Transit': 'info',
    'Completed': 'success',
  };
  return <Badge variant={map[status]}>{status}</Badge>;
};

const InventoryTransfers = () => {
  const [transfers, setTransfers] = useState<InventoryTransfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try { setTransfers(await getTransfers()); }
      catch (e) { console.error(e); }
      finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await approveTransfer(id);
      setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: 'In Transit' as const } : t));
    } finally { setProcessingId(null); }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      await rejectTransfer(id);
      setTransfers(prev => prev.filter(t => t.id !== id));
    } finally { setProcessingId(null); }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  const counts = {
    pending: transfers.filter(t => t.status === 'Pending').length,
    inTransit: transfers.filter(t => t.status === 'In Transit').length,
    completed: transfers.filter(t => t.status === 'Completed').length,
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Inventory Transfers</h1>
        <p className="text-sm text-slate-500 mt-1">Manage inter-warehouse inventory redistribution.</p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <Card hoverEffect className="border-l-4 border-l-warning-500">
          <CardContent className="p-5 flex items-center justify-between">
            <div><p className="text-sm font-medium text-slate-500">Pending Approval</p><h4 className="text-3xl font-bold text-slate-900 mt-1">{counts.pending}</h4></div>
            <div className="p-3 bg-warning-50 text-warning-500 rounded-2xl"><Clock className="h-6 w-6" /></div>
          </CardContent>
        </Card>
        <Card hoverEffect>
          <CardContent className="p-5 flex items-center justify-between">
            <div><p className="text-sm font-medium text-slate-500">In Transit</p><h4 className="text-3xl font-bold text-slate-900 mt-1">{counts.inTransit}</h4></div>
            <div className="p-3 bg-info-50 text-info-500 rounded-2xl"><Truck className="h-6 w-6" /></div>
          </CardContent>
        </Card>
        <Card hoverEffect>
          <CardContent className="p-5 flex items-center justify-between">
            <div><p className="text-sm font-medium text-slate-500">Completed</p><h4 className="text-3xl font-bold text-slate-900 mt-1">{counts.completed}</h4></div>
            <div className="p-3 bg-success-50 text-success-500 rounded-2xl"><CheckCircle2 className="h-6 w-6" /></div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants}>
        <Card noPadding hoverEffect>
          <CardHeader className="px-6 py-5">
            <CardTitle>Transfer Suggestions</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="app-table-head text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">Transfer ID</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">SKU</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">Route</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs text-right">Quantity</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">Created</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs text-center">Status</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="app-table-body divide-y divide-slate-100/80">
                {transfers.map(t => (
                  <tr key={t.id} className="app-table-row">
                    <td className="px-6 py-4 font-bold text-navy-900">{t.id}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{t.sku}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="font-medium">{t.source_warehouse}</span>
                        <ArrowRightLeft className="h-4 w-4 text-primary-400" />
                        <span className="font-medium">{t.destination_warehouse}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">{formatNumber(t.quantity)}</td>
                    <td className="px-6 py-4 text-slate-600">{formatDate(t.created_at)}</td>
                    <td className="px-6 py-4 text-center">{statusBadge(t.status)}</td>
                    <td className="px-6 py-4">
                      {t.status === 'Pending' ? (
                        <div className="flex items-center justify-center space-x-2">
                          <button onClick={() => handleApprove(t.id)} disabled={processingId === t.id}
                            className="rounded-xl bg-success-50/90 p-1.5 text-success-600 shadow-sm transition-colors hover:bg-success-100 disabled:opacity-50"
                            title="Approve Transfer">
                            {processingId === t.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                          </button>
                          <button onClick={() => handleReject(t.id)} disabled={processingId === t.id}
                            className="rounded-xl bg-danger-50/90 p-1.5 text-danger-600 shadow-sm transition-colors hover:bg-danger-100 disabled:opacity-50"
                            title="Reject Transfer">
                            <XCircle className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center text-slate-400 text-xs">—</div>
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

export default InventoryTransfers;
