import { useEffect, useState } from 'react';
import { getPolicies, updatePolicy } from '../services/policyService';
import { PolicySetting } from '../types';
import { Card, CardContent } from '../components/ui/Card';
import { Settings, Save, RotateCcw, CheckCircle } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const PolicyManagement = () => {
  const [policies, setPolicies] = useState<PolicySetting[]>([]);
  const [editValues, setEditValues] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPolicies();
        setPolicies(data);
        setEditValues(Object.fromEntries(data.map(p => [p.key, p.value])));
      } catch (e) { console.error(e); }
      finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  const handleSave = async (key: string) => {
    await updatePolicy(key, editValues[key]);
    setPolicies(prev => prev.map(p => p.key === key ? { ...p, value: editValues[key] } : p));
    setSavedKey(key);
    setTimeout(() => setSavedKey(null), 2000);
  };

  const handleReset = (key: string, originalValue: number) => {
    setEditValues(prev => ({ ...prev, [key]: originalValue }));
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Inventory Policies</h1>
          <p className="text-sm text-slate-500 mt-1">Configure thresholds and parameters that govern automated decision-making.</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card hoverEffect className="mb-6 bg-linear-to-r from-primary-50/90 to-info-50/80 border-primary-100">
          <div className="p-6 flex items-start space-x-4">
            <div className="p-3 bg-primary-100 rounded-2xl text-primary-600 shrink-0 shadow-sm"><Settings className="h-6 w-6" /></div>
            <div>
              <h3 className="bg-linear-to-r from-primary-700 to-info-700 bg-clip-text text-lg font-bold text-transparent">Policy Configuration</h3>
              <p className="text-slate-600 mt-1 text-sm max-w-3xl">These settings directly influence how the Inventory Optimization Agent, Demand Spike Detection Agent, and Supplier Selection Agent make decisions. Changes take effect immediately.</p>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {policies.map(policy => {
          const isModified = editValues[policy.key] !== policy.value;
          const isSaved = savedKey === policy.key;
          return (
            <Card key={policy.key} hoverEffect>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{policy.label}</h3>
                    <p className="text-sm text-slate-500 mt-1">{policy.description}</p>
                  </div>
                  {isSaved && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 text-success-500 text-xs font-semibold bg-success-50 px-2.5 py-1 rounded-full">
                      <CheckCircle className="h-3.5 w-3.5" /> Saved
                    </motion.div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={editValues[policy.key] ?? ''}
                    onChange={e => setEditValues(prev => ({ ...prev, [policy.key]: parseFloat(e.target.value) || 0 }))}
                    className="app-input-surface w-32 rounded-2xl px-4 py-2.5 text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-400/60"
                  />
                  <span className="text-sm text-slate-500 font-medium">{policy.unit}</span>
                  <div className="flex-1" />
                  {isModified && (
                    <>
                      <button onClick={() => handleReset(policy.key, policy.value)}
                        className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-white/8 hover:text-slate-200" title="Reset">
                        <RotateCcw className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleSave(policy.key)}
                        className="app-button-primary rounded-2xl px-4 py-2 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:brightness-105 flex items-center gap-1.5">
                        <Save className="h-4 w-4" /> Save
                      </button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default PolicyManagement;
