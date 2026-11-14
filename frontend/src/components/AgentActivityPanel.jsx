import React from 'react';
import { Bot, CheckCircle2, Clock, AlertCircle, RefreshCw, Cpu } from 'lucide-react';

export default function AgentActivityPanel({ logs = [], isLoading = false, onRefresh }) {
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case 'running':
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20 animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Running
          </span>
        );
      case 'failed':
      case 'error':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3.5 h-3.5" />
            Failed
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );
    }
  };

  const sampleLogs = [
    {
      id: 1,
      agent_name: 'Skill Gap Analyzer',
      action: 'Computed skill alignment against target role requirements',
      status: 'completed',
      execution_time_ms: 1420,
      created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString()
    },
    {
      id: 2,
      agent_name: 'Roadmap Generator',
      action: 'Synthesized 4-stage personalized milestones with weekly goals',
      status: 'completed',
      execution_time_ms: 2150,
      created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString()
    },
    {
      id: 3,
      agent_name: 'Assessment Evaluator',
      action: 'Verified assessment score and updated proficiency ratings',
      status: 'completed',
      execution_time_ms: 880,
      created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString()
    }
  ];

  const displayLogs = logs && logs.length > 0 ? logs : sampleLogs;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-violet-600/20 text-violet-400 border border-violet-500/30">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">AI Agent Orchestrator Activity</h3>
            <p className="text-xs text-slate-400">Live multi-agent execution pipeline & system logs</p>
          </div>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Refresh logs"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-violet-400' : ''}`} />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {displayLogs.map((log) => (
          <div
            key={log.id || log.created_at}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-violet-500/30 transition-all gap-3"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-1.5 rounded-md bg-white/5 text-slate-300">
                <Bot className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-white">
                    {log.agent_name || log.agent || 'AI Specialist'}
                  </span>
                  {log.execution_time_ms && (
                    <span className="text-xs text-slate-500">
                      {(log.execution_time_ms / 1000).toFixed(2)}s
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {log.action || log.message || log.details || 'Processed system task'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-auto w-full sm:w-auto">
              <span className="text-[11px] text-slate-500">
                {log.created_at ? new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
              </span>
              {getStatusBadge(log.status)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
