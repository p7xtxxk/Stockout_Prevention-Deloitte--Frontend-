import { useEffect, useState } from 'react';
import { getAgentLogs } from '../services/systemService';
import { AgentLog } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Activity, Cpu, Wifi, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from '../utils/formatters';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const agentStatusIcon = (status: AgentLog['status']) => {
  switch (status) {
    case 'Success': return <CheckCircle className="h-4 w-4 text-emerald-400" />;
    case 'Error': return <AlertCircle className="h-4 w-4 text-rose-400" />;
    case 'Running': return <Loader2 className="h-4 w-4 text-primary-400 animate-spin" />;
  }
};

const agentStatusBadge = (status: AgentLog['status']) => {
  const map: Record<AgentLog['status'], 'success' | 'error' | 'info'> = {
    'Success': 'success', 'Error': 'error', 'Running': 'info',
  };
  return <Badge variant={map[status]}>{status}</Badge>;
};

// Simulated system telemetry
const telemetry = {
  api_latency: '42ms',
  uptime: '99.97%',
  processing_queue: 0,
  last_sync: '2 min ago',
};

const agents = [
  { name: 'Demand Forecast Agent', status: 'Active', lastRun: '30 min ago', icon: '📈' },
  { name: 'Stockout Risk Agent', status: 'Active', lastRun: '1h ago', icon: '⚠️' },
  { name: 'Replenishment Agent', status: 'Active', lastRun: '1.5h ago', icon: '📦' },
  { name: 'Supplier Selection Agent', status: 'Active', lastRun: '2h ago', icon: '🏭' },
  { name: 'Shipment Tracking Agent', status: 'Error', lastRun: '2.5h ago', icon: '🚚' },
  { name: 'Overstock Detection Agent', status: 'Active', lastRun: '3h ago', icon: '📊' },
  { name: 'Inventory Transfer Agent', status: 'Active', lastRun: '4h ago', icon: '🔄' },
];

const SystemMonitoring = () => {
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try { setLogs(await getAgentLogs()); }
      catch (e) { console.error(e); }
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

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Monitoring</h1>
        <p className="text-sm text-slate-500 mt-1">Health status of all AI agents and system telemetry.</p>
      </motion.div>

      {/* Telemetry Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card hoverEffect className="border-l-4 border-l-success-500">
          <CardContent className="p-5 flex items-center justify-between">
            <div><p className="text-sm font-medium text-slate-500">API Latency</p><h4 className="text-3xl font-bold text-slate-900 mt-1">{telemetry.api_latency}</h4></div>
            <div className="p-3 bg-success-50 text-success-500 rounded-2xl"><Wifi className="h-6 w-6" /></div>
          </CardContent>
        </Card>
        <Card hoverEffect>
          <CardContent className="p-5 flex items-center justify-between">
            <div><p className="text-sm font-medium text-slate-500">System Uptime</p><h4 className="text-3xl font-bold text-slate-900 mt-1">{telemetry.uptime}</h4></div>
            <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl"><Activity className="h-6 w-6" /></div>
          </CardContent>
        </Card>
        <Card hoverEffect>
          <CardContent className="p-5 flex items-center justify-between">
            <div><p className="text-sm font-medium text-slate-500">Queue Depth</p><h4 className="text-3xl font-bold text-slate-900 mt-1">{telemetry.processing_queue}</h4></div>
            <div className="p-3 bg-info-50 text-info-500 rounded-2xl"><Cpu className="h-6 w-6" /></div>
          </CardContent>
        </Card>
        <Card hoverEffect>
          <CardContent className="p-5 flex items-center justify-between">
            <div><p className="text-sm font-medium text-slate-500">Last Sync</p><h4 className="text-2xl font-bold text-slate-900 mt-1">{telemetry.last_sync}</h4></div>
            <div className="p-3 bg-slate-100 text-slate-600 rounded-2xl"><Activity className="h-6 w-6" /></div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Agent Status Cards */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">AI Agent Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {agents.map(agent => (
            <Card key={agent.name} hoverEffect>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{agent.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{agent.name}</p>
                    <p className="text-xs text-slate-500">Last run: {agent.lastRun}</p>
                  </div>
                </div>
                <Badge variant={agent.status === 'Active' ? 'success' : 'error'}>{agent.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Activity Log Table */}
      <motion.div variants={itemVariants}>
        <Card noPadding hoverEffect>
          <CardHeader className="px-6 py-5"><CardTitle>Agent Activity Log</CardTitle></CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="app-table-head text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">Agent</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">Action</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">Time</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs text-center">Status</th>
                </tr>
              </thead>
              <tbody className="app-table-body divide-y divide-slate-100/80">
                {logs.map(log => (
                  <tr key={log.id} className="app-table-row">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {agentStatusIcon(log.status)}
                        <span className="font-medium text-slate-900">{log.agent_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{log.action}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{formatDistanceToNow(new Date(log.timestamp))} ago</td>
                    <td className="px-6 py-4 text-center">{agentStatusBadge(log.status)}</td>
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

export default SystemMonitoring;
