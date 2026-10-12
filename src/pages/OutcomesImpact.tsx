import React, { useState } from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  TrendingUp,
  RotateCcw,
  Edit3,
  Info,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Intervention, InterventionStatus } from '../types';

export const OutcomesImpact: React.FC = () => {
  const { interventions, updateIntervention, deleteIntervention } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);

  // Status update modal state
  const [newStatus, setNewStatus] = useState<InterventionStatus>('In Progress');
  const [outcomeNotes, setOutcomeNotes] = useState<string>('');
  const [afterSuccessScore, setAfterSuccessScore] = useState<number>(75);
  const [afterPlacementScore, setAfterPlacementScore] = useState<number>(70);
  const [afterAttendance, setAfterAttendance] = useState<number>(80);

  const todayStr = new Date().toISOString().split('T')[0];

  // Filtering
  const filteredInterventions = interventions.filter((i) => {
    if (statusFilter === 'All') return true;
    if (statusFilter === 'Overdue') {
      return i.followUpDate < todayStr && i.status !== 'Completed' && i.status !== 'Dismissed';
    }
    return i.status === statusFilter;
  });

  // KPI Metrics
  const totalTracked = interventions.length;
  const completedCount = interventions.filter((i) => i.status === 'Completed').length;
  const inProgressCount = interventions.filter(
    (i) => i.status === 'In Progress' || i.status === 'Accepted'
  ).length;
  const overdueCount = interventions.filter(
    (i) => i.followUpDate < todayStr && i.status !== 'Completed' && i.status !== 'Dismissed'
  ).length;

  const handleOpenEdit = (intv: Intervention) => {
    setSelectedIntervention(intv);
    setNewStatus(intv.status);
    setOutcomeNotes(intv.notes || '');
    setAfterSuccessScore(intv.afterMetrics?.successScore || intv.beforeMetrics.successScore + 8);
    setAfterPlacementScore(intv.afterMetrics?.placementScore || intv.beforeMetrics.placementScore + 6);
    setAfterAttendance(intv.afterMetrics?.attendance || intv.beforeMetrics.attendance + 10);
  };

  const handleSaveEdit = () => {
    if (!selectedIntervention) return;

    updateIntervention(selectedIntervention.id, {
      status: newStatus,
      notes: outcomeNotes,
      afterMetrics: {
        successScore: afterSuccessScore,
        placementScore: afterPlacementScore,
        attendance: afterAttendance,
        cgpa: selectedIntervention.beforeMetrics.cgpa,
      },
    });

    setSelectedIntervention(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold">
            <Award className="h-4 w-4" />
            <span>Longitudinal Action Tracking & Institutional Outcomes</span>
          </div>
          <span className="font-mono text-xs text-teal-300">
            {completedCount} Completed Interventions
          </span>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white">
          Outcomes & Impact Monitor
        </h1>

        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          Monitor assigned student interventions, track review deadlines, record post-intervention diagnostic checks, and measure observed baseline deltas across academic and placement parameters.
        </p>

        <div className="flex items-start gap-2 rounded-lg border border-slate-800/80 bg-slate-950 p-3 text-[11px] text-slate-400">
          <Info className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
          <span>
            <strong>Observational Disclaimer:</strong> Before-and-after metric changes reflect observed longitudinal trends. They do not constitute formal statistical proof of singular causality or isolate external confounders.
          </span>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-xs text-slate-400">Total Tracked Actions</span>
          <div className="font-mono text-2xl font-bold text-white tabular-nums mt-1">
            {totalTracked}
          </div>
          <span className="text-[11px] text-slate-500">Mentorship initiatives</span>
        </div>

        <div className="rounded-xl border border-teal-500/20 bg-teal-950/20 p-4">
          <span className="text-xs text-teal-400">In Active Progress</span>
          <div className="font-mono text-2xl font-bold text-teal-300 tabular-nums mt-1">
            {inProgressCount}
          </div>
          <span className="text-[11px] text-slate-400">Faculty actively mentoring</span>
        </div>

        <div className="rounded-xl border border-violet-500/20 bg-violet-950/20 p-4">
          <span className="text-xs text-violet-400">Completed & Evaluated</span>
          <div className="font-mono text-2xl font-bold text-violet-300 tabular-nums mt-1">
            {completedCount}
          </div>
          <span className="text-[11px] text-slate-400">Post-metrics recorded</span>
        </div>

        <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-4">
          <span className="text-xs text-rose-400">Overdue Follow-Ups</span>
          <div className="font-mono text-2xl font-bold text-rose-300 tabular-nums mt-1">
            {overdueCount}
          </div>
          <span className="text-[11px] text-slate-400">Review date has passed</span>
        </div>
      </div>

      {/* Filter and Action Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <span className="text-xs font-medium text-slate-300">Filter by Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white"
          >
            <option value="All">All Statuses ({totalTracked})</option>
            <option value="In Progress">In Progress</option>
            <option value="Accepted">Accepted</option>
            <option value="Completed">Completed</option>
            <option value="Recommended">Recommended</option>
            <option value="Overdue">Overdue Review Date ({overdueCount})</option>
          </select>
        </div>

        <span className="text-xs text-slate-400">
          Showing {filteredInterventions.length} of {totalTracked} interventions
        </span>
      </div>

      {/* Interventions Tracked Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-slate-400">
              <tr>
                <th className="py-3 px-4 font-semibold">Intervention ID</th>
                <th className="py-3 px-4 font-semibold">Student</th>
                <th className="py-3 px-4 font-semibold">Program Type</th>
                <th className="py-3 px-4 font-semibold">Assigned Faculty</th>
                <th className="py-3 px-4 font-semibold">Review Date</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold">Observed Score Delta</th>
                <th className="py-3 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredInterventions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500">
                    No interventions found matching this status filter.
                  </td>
                </tr>
              ) : (
                filteredInterventions.map((item) => {
                  const isOverdue =
                    item.followUpDate < todayStr &&
                    item.status !== 'Completed' &&
                    item.status !== 'Dismissed';

                  return (
                    <tr key={item.id} className="hover:bg-slate-900/70 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-teal-400">
                        {item.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-white">{item.studentName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {item.studentId} · {item.department}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-200">{item.type}</span>
                        <div className="text-[10px] text-slate-400">{item.estimatedHours} hrs budgeted</div>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {item.assignedFaculty}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span className={isOverdue ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                          {item.followUpDate}
                        </span>
                        {isOverdue && (
                          <div className="text-[10px] text-rose-400">Overdue review</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold border ${
                            item.status === 'Completed'
                              ? 'border-teal-500/30 text-teal-300 bg-teal-950/30'
                              : item.status === 'In Progress'
                              ? 'border-blue-500/30 text-blue-300 bg-blue-950/30'
                              : item.status === 'Accepted'
                              ? 'border-violet-500/30 text-violet-300 bg-violet-950/30'
                              : 'border-slate-700 text-slate-400 bg-slate-900'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {item.afterMetrics ? (
                          <div className="font-mono text-xs">
                            <span className="text-teal-400 font-bold">
                              Success: {item.beforeMetrics.successScore} → {item.afterMetrics.successScore} (+
                              {(item.afterMetrics.successScore - item.beforeMetrics.successScore).toFixed(1)})
                            </span>
                            <div className="text-[10px] text-slate-400">
                              Placement: {item.beforeMetrics.placementScore} → {item.afterMetrics.placementScore}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px] italic">
                            In progress / Awaiting follow-up
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="rounded bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Outcome Update Modal */}
      {selectedIntervention && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Record Intervention Outcome & Status</h3>
                <p className="text-xs text-slate-400">
                  {selectedIntervention.studentName} · {selectedIntervention.type}
                </p>
              </div>
              <span className="font-mono text-xs text-teal-400">{selectedIntervention.id}</span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Lifecycle Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white"
                >
                  <option value="Accepted">Accepted (Mentor Assigned)</option>
                  <option value="In Progress">In Progress (Active Sessions)</option>
                  <option value="Completed">Completed (Post-Evaluation Finished)</option>
                  <option value="Dismissed">Dismissed (No longer needed)</option>
                </select>
              </div>

              {/* Observed Post-Intervention Metrics */}
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 space-y-2.5">
                <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider">
                  Post-Intervention Diagnostic Return
                </span>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Success Score</label>
                    <input
                      type="number"
                      step="0.5"
                      value={afterSuccessScore}
                      onChange={(e) => setAfterSuccessScore(parseFloat(e.target.value) || 0)}
                      className="w-full rounded border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-white font-mono"
                    />
                    <span className="text-[10px] text-slate-500">
                      Before: {selectedIntervention.beforeMetrics.successScore}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Placement Score</label>
                    <input
                      type="number"
                      step="0.5"
                      value={afterPlacementScore}
                      onChange={(e) => setAfterPlacementScore(parseFloat(e.target.value) || 0)}
                      className="w-full rounded border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-white font-mono"
                    />
                    <span className="text-[10px] text-slate-500">
                      Before: {selectedIntervention.beforeMetrics.placementScore}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Attendance %</label>
                    <input
                      type="number"
                      value={afterAttendance}
                      onChange={(e) => setAfterAttendance(parseInt(e.target.value) || 0)}
                      className="w-full rounded border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-white font-mono"
                    />
                    <span className="text-[10px] text-slate-500">
                      Before: {selectedIntervention.beforeMetrics.attendance}%
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Mentor Qualitative Notes / Observations
                </label>
                <textarea
                  rows={3}
                  value={outcomeNotes}
                  onChange={(e) => setOutcomeNotes(e.target.value)}
                  placeholder="Record attendance compliance, student responsiveness, and test clearance notes..."
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-xs text-white focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800 pt-3">
              <button
                onClick={() => {
                  if (window.confirm('Delete this intervention record?')) {
                    deleteIntervention(selectedIntervention.id);
                    setSelectedIntervention(null);
                  }
                }}
                className="text-xs text-rose-400 hover:underline"
              >
                Delete Record
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedIntervention(null)}
                  className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="rounded-lg bg-teal-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:bg-teal-400"
                >
                  Save Updates
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
