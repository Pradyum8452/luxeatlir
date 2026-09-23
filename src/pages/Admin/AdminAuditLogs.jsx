import React, { useState, useEffect } from 'react';
import { ShieldAlert, Search, RefreshCw, Clock } from 'lucide-react';
import { api } from '../../services/api';

export const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = () => {
    setLoading(true);
    api.getAuditLogs().then((res) => {
      if (Array.isArray(res)) setLogs(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-obsidian-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif">System Action Audit Trail Logs</h2>
          <p className="text-xs text-gray-400 mt-0.5">Immutable record of all admin, customer, stock, order, and system security actions</p>
        </div>
        <button onClick={fetchLogs} className="bg-obsidian-850 p-2 rounded-xl text-gray-400 hover:text-white border border-obsidian-700">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="glass-panel rounded-2xl border border-obsidian-700 overflow-hidden">
        <table className="w-full text-xs text-left text-gray-300">
          <thead className="bg-obsidian-900 text-gold-400 font-semibold uppercase tracking-wider border-b border-obsidian-700">
            <tr>
              <th className="py-3 px-4">Log ID</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Action Details</th>
              <th className="py-3 px-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-obsidian-800">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-obsidian-850/50">
                <td className="py-3 px-4 font-mono text-gray-500">#{log.id}</td>
                <td className="py-3 px-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gold-500/10 text-gold-400 border border-gold-500/20 font-mono">
                    {log.action}
                  </span>
                </td>
                <td className="py-3 px-4 font-semibold text-white">{log.user_name || 'System / Guest'}</td>
                <td className="py-3 px-4 text-gray-300 max-w-sm">{log.details}</td>
                <td className="py-3 px-4 font-mono text-gray-400">{new Date(log.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
