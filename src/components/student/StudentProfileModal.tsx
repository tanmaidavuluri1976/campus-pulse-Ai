import React, { useState } from 'react';
import {
  X,
  User,
  GraduationCap,
  Calendar,
  Briefcase,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RiskBadge } from '../common/RiskBadge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';

export const StudentProfileModal: React.FC = () => {
  const { selectedStudent, setSelectedStudentId, interventions, setActiveTab } = useApp();
  const [activeTab, setModalTab] = useState<'dossier' | 'trends' | 'placement' | 'interventions'>('dossier');

  if (!selectedStudent) return null;

  const studentInterventions = interventions.filter((i) => i.studentId === selectedStudent.id);

  const competencyData = [
    { name: 'Aptitude', score: selectedStudent.aptitudeScore, benchmark: 70 },
    { name: 'Coding', score: selectedStudent.codingScore, benchmark: 75 },
    { name: 'Interview', score: selectedStudent.mockInterviewScore, benchmark: 70 },
    { name: 'Technical', score: selectedStudent.technicalSkillScore, benchmark: 65 },
    { name: 'Comm', score: selectedStudent.communicationSkillScore, benchmark: 70 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400 font-bold text-lg">
              {selectedStudent.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-white tracking-tight">{selectedStudent.name}</h2>
                <span className="font-mono text-xs text-slate-400">
                  {selectedStudent.id}
                </span>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300">
                  {selectedStudent.segment}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span>{selectedStudent.department}</span>
                <span aria-hidden="true">·</span>
                <span>Year {selectedStudent.year} (Sem {selectedStudent.semester})</span>
                <span aria-hidden="true">·</span>
                <span>Roll: {selectedStudent.rollNumber}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-teal-400">Data Integrity: {selectedStudent.dataQuality}%</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedStudentId(null)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Nav Tabs */}
        <div className="flex border-b border-slate-800/80 bg-slate-950 px-5 gap-2 pt-2">
          {[
            { id: 'dossier', label: 'Score Breakdown & Attribution' },
            { id: 'trends', label: 'Academic Trajectory' },
            { id: 'placement', label: 'Skills & Placement Readiness' },
            { id: 'interventions', label: `Interventions (${studentInterventions.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setModalTab(tab.id as any)}
              className={`border-b-2 px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-teal-500 text-teal-300 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeTab === 'dossier' && (
            <div className="space-y-5">
              {/* Top Score Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-teal-500/20 bg-teal-950/20 p-3.5">
                  <span className="text-[11px] text-teal-400 font-medium">Student Success Score</span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-mono text-2xl font-bold text-white tabular-nums">
                      {selectedStudent.successScore}
                    </span>
                    <span className="text-[11px] text-slate-400">/ 100</span>
                  </div>
                  <div className="mt-1">
                    <RiskBadge level={selectedStudent.academicRisk} label={`${selectedStudent.academicRisk} Academic Risk`} size="sm" />
                  </div>
                </div>

                <div className="rounded-xl border border-violet-500/20 bg-violet-950/20 p-3.5">
                  <span className="text-[11px] text-violet-400 font-medium">Placement Readiness</span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-mono text-2xl font-bold text-white tabular-nums">
                      {selectedStudent.placementScore}
                    </span>
                    <span className="text-[11px] text-slate-400">/ 100</span>
                  </div>
                  <div className="mt-1">
                    <RiskBadge level={selectedStudent.placementRisk} label={`${selectedStudent.placementRisk} Placement Risk`} size="sm" />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
                  <span className="text-[11px] text-slate-400 font-medium">Cumulative GPA</span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-mono text-2xl font-bold text-white tabular-nums">
                      {selectedStudent.cgpa.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {selectedStudent.backlogsCount > 0 ? `(${selectedStudent.backlogsCount} backlog)` : '(Clean)'}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-400">
                    Prev Sem: {selectedStudent.previousSemGpa.toFixed(2)}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
                  <span className="text-[11px] text-slate-400 font-medium">Overall Attendance</span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-mono text-2xl font-bold text-white tabular-nums">
                      {selectedStudent.attendance}%
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-400">
                    Lab attendance: {selectedStudent.labAttendance}%
                  </div>
                </div>
              </div>

              {/* Factor Attribution: Transparent Explainability */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Positive Contributors */}
                <div className="rounded-xl border border-teal-500/20 bg-slate-900/40 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
                    <CheckCircle className="h-4 w-4" />
                    <span>Strongest Positive Contributors</span>
                  </div>
                  {selectedStudent.topPositiveFactors.length === 0 ? (
                    <div className="text-xs text-slate-500 italic">No significant positive outliers detected.</div>
                  ) : (
                    <div className="space-y-2.5">
                      {selectedStudent.topPositiveFactors.map((factor, idx) => (
                        <div key={idx} className="rounded-lg border border-slate-800/80 bg-slate-950 p-2.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-slate-200">{factor.factor}</span>
                            <span className="font-mono text-[11px] text-teal-400">+{Math.abs(Math.round(factor.impactValue))} impact</span>
                          </div>
                          <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">{factor.explanation}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Negative Contributors / Bottlenecks */}
                <div className="rounded-xl border border-rose-500/20 bg-slate-900/40 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Identified Risk Drivers & Gaps</span>
                  </div>
                  {selectedStudent.topNegativeFactors.length === 0 ? (
                    <div className="text-xs text-slate-500 italic">No critical risk triggers detected. Performance stable.</div>
                  ) : (
                    <div className="space-y-2.5">
                      {selectedStudent.topNegativeFactors.map((factor, idx) => (
                        <div key={idx} className="rounded-lg border border-slate-800/80 bg-slate-950 p-2.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-slate-200">{factor.factor}</span>
                            <span className="font-mono text-[11px] text-rose-400">-{Math.abs(Math.round(factor.impactValue))} impact</span>
                          </div>
                          <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">{factor.explanation}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Subject-Wise Attendance Breakdown */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Subject-Level Attendance Monitoring</span>
                  <span className="text-[11px] text-slate-400">Statutory threshold: 75%</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {selectedStudent.subjectAttendance.map((subj, idx) => {
                    const isBelow = subj.percentage < 75;
                    return (
                      <div key={idx} className="rounded-lg border border-slate-800/80 bg-slate-950 p-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-300 truncate max-w-[140px]">{subj.subject}</span>
                          <span
                            className={`font-mono text-xs font-bold tabular-nums ${
                              isBelow ? 'text-rose-400' : 'text-teal-400'
                            }`}
                          >
                            {subj.percentage}%
                          </span>
                        </div>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isBelow ? 'bg-rose-500' : 'bg-teal-500'
                            }`}
                            style={{ width: `${subj.percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommended Next Actions */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-white">Suggested Interventions</span>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedStudent.suggestedInterventions.join(' · ')}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedStudentId(null);
                    setActiveTab('intervention-lab');
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-teal-500 px-3.5 py-2 text-xs font-medium text-slate-950 hover:bg-teal-400 transition-colors shrink-0"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Simulate in What-If Lab</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'trends' && (
            <div className="space-y-5">
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-semibold text-white">Longitudinal Performance Progression</h3>
                    <p className="text-[11px] text-slate-400">Track semester-by-semester trajectory across academics, attendance, and LMS.</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5 text-teal-400">
                      <span className="h-2 w-2 rounded-full bg-teal-400" /> CGPA (x10)
                    </span>
                    <span className="flex items-center gap-1.5 text-violet-400">
                      <span className="h-2 w-2 rounded-full bg-violet-400" /> Attendance %
                    </span>
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <span className="h-2 w-2 rounded-full bg-amber-400" /> LMS %
                    </span>
                  </div>
                </div>

                <div className="h-64 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={selectedStudent.historicalTrends.map((t) => ({
                        name: `Sem ${t.semester}`,
                        cgpaScaled: Math.round(t.cgpa * 10),
                        attendance: t.attendance,
                        lms: t.lmsEngagement,
                        internal: t.internalMarks,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#64748b" domain={[30, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#090d16',
                          borderColor: '#334155',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                      <Line type="monotone" dataKey="cgpaScaled" stroke="#14b8a6" strokeWidth={2.5} name="CGPA (Scaled /100)" />
                      <Line type="monotone" dataKey="attendance" stroke="#8b5cf6" strokeWidth={2} name="Attendance %" />
                      <Line type="monotone" dataKey="lms" stroke="#f59e0b" strokeWidth={2} name="LMS Engagement %" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* LMS Activity stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <span className="text-[11px] text-slate-400">LMS Monthly Logins</span>
                  <div className="font-mono text-xl font-bold text-white tabular-nums mt-1">
                    {selectedStudent.lmsLoginCountMonthly}
                  </div>
                  <span className="text-[10px] text-slate-500">Benchmark: 20/mo</span>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <span className="text-[11px] text-slate-400">Weekly Study Hours</span>
                  <div className="font-mono text-xl font-bold text-white tabular-nums mt-1">
                    {selectedStudent.lmsAvgHoursWeekly} hrs
                  </div>
                  <span className="text-[10px] text-slate-500">Active portal time</span>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <span className="text-[11px] text-slate-400">Assignment Rate</span>
                  <div className="font-mono text-xl font-bold text-white tabular-nums mt-1">
                    {selectedStudent.assignmentCompletionRate}%
                  </div>
                  <span className="text-[10px] text-slate-500">Course submissions</span>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <span className="text-[11px] text-slate-400">Forum Discussion</span>
                  <div className="font-mono text-xl font-bold text-white tabular-nums mt-1">
                    {selectedStudent.forumInteractionsCount} posts
                  </div>
                  <span className="text-[10px] text-slate-500">Peer collaboration</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'placement' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
                  <h3 className="text-xs font-semibold text-white">Competency Benchmark Comparison</h3>
                  <div className="h-56 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={competencyData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis type="number" domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
                        <YAxis dataKey="name" type="category" stroke="#64748b" tick={{ fontSize: 11 }} width={70} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#090d16',
                            borderColor: '#334155',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                        />
                        <Bar dataKey="score" fill="#14b8a6" name="Student Score" radius={[0, 4, 4, 0]} />
                        <Bar dataKey="benchmark" fill="#334155" name="Campus Target" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
                  <h3 className="text-xs font-semibold text-white">Placement Readiness Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
                      <span className="text-slate-400">Placement Drive Registration</span>
                      <span className={selectedStudent.placementParticipation ? 'text-teal-400 font-medium' : 'text-amber-400 font-medium'}>
                        {selectedStudent.placementParticipation ? 'Registered & Active' : 'Not Registered'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
                      <span className="text-slate-400">Resume / Profile ATS Score</span>
                      <span className="font-mono text-white tabular-nums">{selectedStudent.resumeScore}/100</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
                      <span className="text-slate-400">Industry Certifications</span>
                      <span className="font-mono text-white tabular-nums">{selectedStudent.certificationsCompleted} credentials</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
                      <span className="text-slate-400">Hackathons & Technical Events</span>
                      <span className="font-mono text-white tabular-nums">{selectedStudent.eventsParticipated} events</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Faculty Endorsement Rating</span>
                      <span className="font-mono text-teal-400 tabular-nums">{selectedStudent.facultyFeedbackScore} / 5.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'interventions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-white">Intervention Log & Tracking</h3>
                  <p className="text-[11px] text-slate-400">Assigned corrective measures, follow-up timelines, and observed changes.</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedStudentId(null);
                    setActiveTab('resource-optimizer');
                  }}
                  className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white"
                >
                  Allocate in Optimizer
                </button>
              </div>

              {studentInterventions.length === 0 ? (
                <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-8 text-center">
                  <Clock className="mx-auto h-8 w-8 text-slate-600 mb-2" />
                  <p className="text-xs font-medium text-slate-300">No active interventions on record</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Use the Intervention Lab or Resource Optimizer to initiate a targeted action for this student.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {studentInterventions.map((intv) => (
                    <div
                      key={intv.id}
                      className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{intv.type}</span>
                            <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                              {intv.category}
                            </span>
                            <span className={`text-[10px] font-medium ${
                              intv.priority === 'Urgent' ? 'text-rose-400' : 'text-amber-400'
                            }`}>
                              [{intv.priority}]
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{intv.intendedOutcome}</p>
                        </div>
                        <span className="font-mono text-xs font-semibold text-teal-400">
                          {intv.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                        <span>Assigned: {intv.assignedFaculty}</span>
                        <span>Estimated: {intv.estimatedHours} hrs</span>
                        <span>Follow-up: {intv.followUpDate}</span>
                      </div>

                      {intv.afterMetrics && (
                        <div className="rounded-lg bg-teal-950/20 border border-teal-500/20 p-2.5 text-xs text-slate-300 flex items-center justify-between">
                          <span>Observed Outcome Delta:</span>
                          <span className="font-mono text-teal-400 font-semibold">
                            Success Score: {intv.beforeMetrics.successScore} → {intv.afterMetrics.successScore} (+{(intv.afterMetrics.successScore - intv.beforeMetrics.successScore).toFixed(1)})
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-400">
          <span>Student Record ID: {selectedStudent.id}</span>
          <button
            onClick={() => setSelectedStudentId(null)}
            className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
