import { useEffect, useState } from 'react';
import { getAgentLogs, getAuditTrail } from '../services/systemService';
import { AgentLog, AuditEntry } from '../types';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ScrollText, Search } from 'lucide-react';
import { formatDistanceToNow, formatDate } from '../utils/formatters';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

type Tab = 'Agent Logs' | 'Audit Trail';

const SystemLogs = () => {
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('Agent Logs');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [logs, audit] = await Promise.all([getAgentLogs(), getAuditTrail()]);
        setAgentLogs(logs);
        setAuditEntries(audit);
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

  const tabs: Tab[] = ['Agent Logs', 'Audit Trail'];

  const agentLogStatusBadge = (status: AgentLog['status']) => {
    const map: Record<AgentLog['status'], 'success' | 'error' | 'info'> = { 'Success': 'success', 'Error': 'error', 'Running': 'info' };
    return <Badge variant={map[status]}>{status}</Badge>;
  };

  const renderAgentLogs = () => {
    const filtered = agentLogs.filter(l =>
      l.agent_name.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <table className="w-full text-sm text-left">
        <thead className="app-table-head text-slate-500 font-medium">
          <tr>
            <th className="px-6 py-4 uppercase tracking-wider text-xs">ID</th>
            <th className="px-6 py-4 uppercase tracking-wider text-xs">Agent</th>
            <th className="px-6 py-4 uppercase tracking-wider text-xs">Action</th>
            <th className="px-6 py-4 uppercase tracking-wider text-xs">Time</th>
            <th className="px-6 py-4 uppercase tracking-wider text-xs text-center">Status</th>
          </tr>
        </thead>
        <tbody className="app-table-body divide-y divide-slate-100/80">
          {filtered.map(log => (
            <tr key={log.id} className="app-table-row">
              <td className="px-6 py-4 font-bold text-navy-900 text-xs">{log.id}</td>
              <td className="px-6 py-4 text-slate-900 font-medium">{log.agent_name}</td>
              <td className="px-6 py-4 text-slate-600">{log.action}</td>
              <td className="px-6 py-4 text-slate-500 text-xs">{formatDistanceToNow(new Date(log.timestamp))} ago</td>
              <td className="px-6 py-4 text-center">{agentLogStatusBadge(log.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderAuditTrail = () => {
    const filtered = auditEntries.filter(e =>
      e.action.toLowerCase().includes(search.toLowerCase()) ||
      e.entity.toLowerCase().includes(search.toLowerCase()) ||
      e.user.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <table className="w-full text-sm text-left">
        <thead className="app-table-head text-slate-500 font-medium">
          <tr>
            <th className="px-6 py-4 uppercase tracking-wider text-xs">ID</th>
            <th className="px-6 py-4 uppercase tracking-wider text-xs">User</th>
            <th className="px-6 py-4 uppercase tracking-wider text-xs">Action</th>
            <th className="px-6 py-4 uppercase tracking-wider text-xs">Entity</th>
            <th className="px-6 py-4 uppercase tracking-wider text-xs">Date</th>
            <th className="px-6 py-4 uppercase tracking-wider text-xs">Details</th>
          </tr>
        </thead>
        <tbody className="app-table-body divide-y divide-slate-100/80">
          {filtered.map(entry => (
            <tr key={entry.id} className="app-table-row">
              <td className="px-6 py-4 font-bold text-navy-900 text-xs">{entry.id}</td>
              <td className="px-6 py-4">
                <Badge variant={entry.user === 'System' ? 'info' : 'neutral'}>{entry.user}</Badge>
              </td>
              <td className="px-6 py-4 text-slate-900 font-medium">{entry.action}</td>
              <td className="px-6 py-4 text-slate-600 font-medium">{entry.entity}</td>
              <td className="px-6 py-4 text-slate-500 text-xs">{formatDate(entry.timestamp)}</td>
              <td className="px-6 py-4 text-slate-500 text-xs max-w-xs truncate" title={entry.details}>{entry.details}</td>
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
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Logs & Audit Trail</h1>
          <p className="text-sm text-slate-500 mt-1">Review agent activity and trace autonomous decisions.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <ScrollText className="h-4 w-4" />
          <span>{agentLogs.length + auditEntries.length} total entries</span>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card noPadding hoverEffect>
          <CardHeader className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>{activeTab}</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Search logs…" value={search} onChange={e => setSearch(e.target.value)}
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
            {activeTab === 'Agent Logs' && renderAgentLogs()}
            {activeTab === 'Audit Trail' && renderAuditTrail()}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default SystemLogs;
