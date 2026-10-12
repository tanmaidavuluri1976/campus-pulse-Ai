import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  Clock,
  UserCheck,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Sparkles,
  Layers,
  ChevronRight,
  Filter,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Intervention, InterventionStatus, Department } from '../types';

interface CandidateRecommendation {
  studentId: string;
  studentName: string;
  department: Department;
  action: string;
  category: 'Academic' | 'Placement' | 'Engagement';
  reason: string;
  hours: number;
  priorityScore: number; // calculated priority weight
  intendedOutcome: string;
  isExisting: boolean;
  existingId?: string;
  existingStatus?: InterventionStatus;
  assignedFaculty?: string;
  followUpDate?: string;
}

export const ResourceOptimizer: React.FC = () => {
  const { students, settings, updateSettings, interventions, addIntervention, updateIntervention } = useApp();

  const [budgetHours, setBudgetHours] = useState<number>(settings.totalFacultyHoursBudget || 120);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('All');
  
  // Assignment Modal
  const [activeAssignItem, setActiveAssignItem] = useState<CandidateRecommendation | null>(null);
  const [facultyNameInput, setFacultyNameInput] = useState<string>('Dr. Rajesh Sharma');
  const [followUpDateInput, setFollowUpDateInput] = useState<string>(
    new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Generate prioritized queue by evaluating all students
  const candidateQueue = useMemo(() => {
    const list: CandidateRecommendation[] = [];
    const existingMap = new Map(interventions.map((i) => [i.studentId + i.type, i]));

    students.forEach((s) => {
      // 1. Attendance Crisis
      if (s.attendance < 70) {
        const key = s.id + 'Attendance Mentoring';
        const existing = existingMap.get(key);
        const priorityScore = (75 - s.attendance) * 2 + (s.backlogsCount * 15);
        list.push({
          studentId: s.id,
          studentName: s.name,
          department: s.department,
          action: 'Attendance Mentoring',
          category: 'Academic',
          reason: `Attendance at ${s.attendance}%, risking exam eligibility.`,
          hours: 8,
          priorityScore,
          intendedOutcome: 'Recover to statutory 75% attendance threshold.',
          isExisting: !!existing,
          existingId: existing?.id,
          existingStatus: existing?.status,
          assignedFaculty: existing?.assignedFaculty,
          followUpDate: existing?.followUpDate,
        });
      }

      // 2. Academic Tutoring for Backlogs
      if (s.backlogsCount > 0 || s.cgpa < 6.0) {
        const key = s.id + 'Subject Tutoring';
        const existing = existingMap.get(key);
        const priorityScore = (s.backlogsCount * 25) + ((7.0 - s.cgpa) * 10);
        list.push({
          studentId: s.id,
          studentName: s.name,
          department: s.department,
          action: 'Subject Tutoring',
          category: 'Academic',
          reason: `${s.backlogsCount} backlog(s), CGPA ${s.cgpa.toFixed(2)}.`,
          hours: 12,
          priorityScore,
          intendedOutcome: 'Clear backlogs and remediate fundamental subject concepts.',
          isExisting: !!existing,
          existingId: existing?.id,
          existingStatus: existing?.status,
          assignedFaculty: existing?.assignedFaculty,
          followUpDate: existing?.followUpDate,
        });
      }

      // 3. Mock Interview Intervention
      if (s.year >= 3 && s.codingScore >= 70 && s.mockInterviewScore < 50) {
        const key = s.id + 'Mock Interviews';
        const existing = existingMap.get(key);
        const priorityScore = (s.codingScore - s.mockInterviewScore) * 1.2;
        list.push({
          studentId: s.id,
          studentName: s.name,
          department: s.department,
          action: 'Mock Interviews',
          category: 'Placement',
          reason: `High coding (${s.codingScore}) but low interview score (${s.mockInterviewScore}).`,
          hours: 10,
          priorityScore,
          intendedOutcome: 'Remediate interview articulation and reduce presentation anxiety.',
          isExisting: !!existing,
          existingId: existing?.id,
          existingStatus: existing?.status,
          assignedFaculty: existing?.assignedFaculty,
          followUpDate: existing?.followUpDate,
        });
      }

      // 4. Aptitude Training
      if (s.year >= 3 && s.aptitudeScore < 55 && s.cgpa >= 7.5) {
        const key = s.id + 'Aptitude Training';
        const existing = existingMap.get(key);
        const priorityScore = (60 - s.aptitudeScore) * 1.5;
        list.push({
          studentId: s.id,
          studentName: s.name,
          department: s.department,
          action: 'Aptitude Training',
          category: 'Placement',
          reason: `High CGPA (${s.cgpa.toFixed(2)}) but lagging aptitude (${s.aptitudeScore}/100).`,
          hours: 8,
          priorityScore,
          intendedOutcome: 'Clear first-round quantitative aptitude filter.',
          isExisting: !!existing,
          existingId: existing?.id,
          existingStatus: existing?.status,
          assignedFaculty: existing?.assignedFaculty,
          followUpDate: existing?.followUpDate,
        });
      }
    });

    // Sort descending by calculated priority score
    return list.sort((a, b) => b.priorityScore - a.priorityScore);
  }, [students, interventions]);

  // Apply Department filter
  const filteredQueue = useMemo(() => {
    if (selectedDeptFilter === 'All') return candidateQueue;
    return candidateQueue.filter((item) => item.department === selectedDeptFilter);
  }, [candidateQueue, selectedDeptFilter]);

  // Knapsack-style greedy allocation within current budget
  const { allocatedItems, totalAllocatedHours } = useMemo(() => {
    let accumulated = 0;
    const items: CandidateRecommendation[] = [];

    for (const item of filteredQueue) {
      if (accumulated + item.hours <= budgetHours) {
        items.push(item);
        accumulated += item.hours;
      }
    }

    return { allocatedItems: items, totalAllocatedHours: accumulated };
  }, [filteredQueue, budgetHours]);

  const handleBudgetChange = (newVal: number) => {
    setBudgetHours(newVal);
    updateSettings({ totalFacultyHoursBudget: newVal });
  };

  const handleOpenAssignModal = (rec: CandidateRecommendation) => {
    setActiveAssignItem(rec);
    setFacultyNameInput(rec.assignedFaculty || `Prof. Advisor (${rec.department})`);
    setFollowUpDateInput(
      rec.followUpDate ||
        new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    );
  };

  const handleConfirmAssignment = () => {
    if (!activeAssignItem) return;

    if (activeAssignItem.isExisting && activeAssignItem.existingId) {
      updateIntervention(activeAssignItem.existingId, {
        status: 'Accepted',
        assignedFaculty: facultyNameInput,
        followUpDate: followUpDateInput,
      });
    } else {
      const student = students.find((s) => s.id === activeAssignItem.studentId);
      addIntervention({
        studentId: activeAssignItem.studentId,
        studentName: activeAssignItem.studentName,
        department: activeAssignItem.department,
        type: activeAssignItem.action as any,
        category: activeAssignItem.category,
        priority: activeAssignItem.priorityScore > 40 ? 'Urgent' : 'High',
        estimatedHours: activeAssignItem.hours,
        assignedFaculty: facultyNameInput,
        status: 'Accepted',
        followUpDate: followUpDateInput,
        targetMetric: activeAssignItem.intendedOutcome,
        intendedOutcome: activeAssignItem.reason,
        beforeMetrics: {
          successScore: student?.successScore || 60,
          placementScore: student?.placementScore || 55,
          attendance: student?.attendance || 70,
          cgpa: student?.cgpa || 7.0,
        },
      });
    }

    setActiveAssignItem(null);
  };

  const utilizationRate = Math.min(100, Math.round((totalAllocatedHours / budgetHours) * 100));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Capacity-Constrained Linear Allocation</span>
          </div>
          <span className="font-mono text-xs text-slate-400">
            {utilizationRate}% Capacity Utilized
          </span>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white">
          Faculty Resource Optimizer & Action Queue
        </h1>

        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          Faculty mentoring hours are a finite campus resource. This optimizer computes transparent return-on-time prioritizations, allocating remedial hours to students facing the steepest academic and recruitment cliff edges.
        </p>

        <div className="flex items-start gap-2 rounded-lg border border-slate-800/80 bg-slate-950 p-3 text-[11px] text-slate-400">
          <Info className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
          <span>
            <strong>Transparency Notice:</strong> Allocations represent candidate advisory queues based on behavioral severity and availability math. They do not claim guaranteed causal outcomes.
          </span>
        </div>
      </div>

      {/* Budget Capacity Controls Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-white">Available Faculty Hours Budget</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono text-3xl font-bold text-teal-400 tabular-nums">
                {budgetHours}
              </span>
              <span className="text-xs text-slate-400">total faculty hours this term</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Department Scope:</span>
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Tech</option>
              <option value="Electronics & Comm">Electronics & Comm</option>
              <option value="Data Science & AI">Data Science & AI</option>
              <option value="Mechanical Eng">Mechanical Eng</option>
              <option value="Civil Eng">Civil Eng</option>
            </select>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-1 pt-2">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Tight Budget (40 hrs)</span>
            <span className="font-mono text-teal-300 font-medium">Selected: {budgetHours} hrs</span>
            <span>Expanded Capacity (250 hrs)</span>
          </div>
          <input
            type="range"
            min={40}
            max={250}
            step={5}
            value={budgetHours}
            onChange={(e) => handleBudgetChange(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
          />
        </div>

        {/* Capacity Utilization Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-800/80 pt-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Allocated:</span>
            <span className="font-mono font-bold text-white tabular-nums">
              {totalAllocatedHours} / {budgetHours} hrs
            </span>
            <span className="text-slate-500">({allocatedItems.length} interventions funded)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Unfunded Demand:</span>
            <span className="font-mono text-amber-400 tabular-nums">
              {Math.max(0, filteredQueue.length - allocatedItems.length)} candidates waiting
            </span>
          </div>
        </div>
      </div>

      {/* Recommended Intervention Queue Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Ranked Action Queue (Ranked by Return-on-Effort)</h2>
            <p className="text-xs text-slate-400">
              Green highlight indicates candidate is funded within current {budgetHours}h faculty capacity.
            </p>
          </div>
          <span className="font-mono text-xs text-slate-400">{filteredQueue.length} Total Candidates</span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-900/80 text-slate-400">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Priority</th>
                <th className="py-2.5 px-3 font-semibold">Student</th>
                <th className="py-2.5 px-3 font-semibold">Recommended Action</th>
                <th className="py-2.5 px-3 font-semibold">Identified Gap & Evidence</th>
                <th className="py-2.5 px-3 text-right font-semibold">Hours</th>
                <th className="py-2.5 px-3 font-semibold text-center">Funding Status</th>
                <th className="py-2.5 px-3 text-right font-semibold">Assign Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredQueue.map((item, idx) => {
                const isFunded = idx < allocatedItems.length;

                return (
                  <tr
                    key={item.studentId + item.action}
                    className={`transition-colors ${
                      isFunded ? 'hover:bg-teal-950/20' : 'opacity-65 hover:opacity-100 hover:bg-slate-900/60'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono font-bold">
                      <span className={item.priorityScore > 45 ? 'text-rose-400' : 'text-amber-400'}>
                        #{idx + 1}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-white">{item.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.studentId} · {item.department}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-teal-300">{item.action}</span>
                      <div className="text-[10px] text-slate-400">{item.category}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 max-w-xs">
                      <div className="leading-relaxed">{item.reason}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        Target: {item.intendedOutcome}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-white tabular-nums">
                      {item.hours}h
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {isFunded ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-400">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Funded</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                          <span>Over Cap</span>
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {item.existingStatus === 'Accepted' || item.existingStatus === 'In Progress' ? (
                        <span className="font-mono text-[11px] text-teal-400 font-medium">
                          {item.existingStatus}
                        </span>
                      ) : (
                        <button
                          onClick={() => handleOpenAssignModal(item)}
                          className="rounded bg-teal-500/20 border border-teal-500/40 px-2.5 py-1 text-[11px] font-semibold text-teal-300 hover:bg-teal-500 hover:text-slate-950 transition-colors"
                        >
                          Assign Faculty
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Modal */}
      {activeAssignItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Assign Intervention to Faculty</h3>
                <p className="text-xs text-slate-400">{activeAssignItem.studentName} ({activeAssignItem.studentId})</p>
              </div>
              <span className="font-mono text-xs text-teal-400">{activeAssignItem.hours} hrs</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Selected Intervention
                </label>
                <div className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-white font-medium">
                  {activeAssignItem.action} ({activeAssignItem.category})
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Assigned Faculty Member / Mentor
                </label>
                <input
                  type="text"
                  value={facultyNameInput}
                  onChange={(e) => setFacultyNameInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                  placeholder="e.g. Dr. Rajesh Sharma"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Follow-Up Review Date
                </label>
                <input
                  type="date"
                  value={followUpDateInput}
                  onChange={(e) => setFollowUpDateInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Remediation Focus
                </label>
                <p className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed">
                  {activeAssignItem.reason}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-3">
              <button
                onClick={() => setActiveAssignItem(null)}
                className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssignment}
                className="rounded-lg bg-teal-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 hover:bg-teal-400"
              >
                Confirm & Add to Tracker
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
