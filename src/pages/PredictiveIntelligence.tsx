import React, { useState } from 'react';
import {
  BrainCircuit,
  AlertTriangle,
  Flame,
  Briefcase,
  Users,
  CheckCircle2,
  FileQuestion,
  ChevronRight,
  ShieldCheck,
  Info,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { StudentSegment, ScoredStudent } from '../types';

interface IntelligenceCohort {
  id: StudentSegment;
  title: string;
  count: number;
  description: string;
  ruleExplanation: string;
  recommendedAction: string;
  badgeColor: string;
  filterFn: (s: ScoredStudent) => boolean;
}

export const PredictiveIntelligence: React.FC = () => {
  const { students, setSelectedStudentId, setActiveTab } = useApp();

  const cohorts: IntelligenceCohort[] = [
    {
      id: 'Academic Critical',
      title: 'Declining Attendance & Severe Academic Risk',
      count: students.filter((s) => s.segment === 'Academic Critical').length,
      description: 'Students experiencing active backlogs, sub-60% attendance, or critical assessment failure.',
      ruleExplanation: 'Deterministic Rule: Backlogs >= 2 OR (CGPA < 6.0 AND Attendance < 70%). Immediate exam condonation risk.',
      recommendedAction: 'Mandatory proctor intervention, parent notification, and subject tutoring.',
      badgeColor: 'border-rose-500/30 text-rose-400 bg-rose-950/20',
      filterFn: (s) => s.segment === 'Academic Critical',
    },
    {
      id: 'Interview Bottleneck',
      title: 'Strong Technical Skills / Weak Interview',
      count: students.filter((s) => s.segment === 'Interview Bottleneck').length,
      description: 'Students with high algorithmic coding acumen who freeze or articulate poorly in mock boards.',
      ruleExplanation: 'Deterministic Rule: Year >= 3 AND Coding Score >= 70 AND Mock Interview Score < 50.',
      recommendedAction: 'Behavioral HR coaching, 1-on-1 mock interviews, and STAR methodology workshops.',
      badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-950/20',
      filterFn: (s) => s.segment === 'Interview Bottleneck',
    },
    {
      id: 'Placement Gaps',
      title: 'High CGPA but Placement Lag',
      count: students.filter((s) => s.segment === 'Placement Gaps').length,
      description: 'Distinction textbook achievers who have not practiced competitive coding, aptitude, or campus drives.',
      ruleExplanation: 'Deterministic Rule: Year >= 3 AND CGPA >= 7.8 AND Placement Readiness Score < 60.',
      recommendedAction: 'Aptitude acceleration track and LeetCode/HackerRank coding bootcamps.',
      badgeColor: 'border-violet-500/30 text-violet-400 bg-violet-950/20',
      filterFn: (s) => s.segment === 'Placement Gaps',
    },
    {
      id: 'Disengaged High-Potential',
      title: 'Disengaged High-Potential',
      count: students.filter((s) => s.segment === 'Disengaged High-Potential').length,
      description: 'Academically capable students skipping classes and showing low LMS activity.',
      ruleExplanation: 'Deterministic Rule: CGPA >= 8.0 AND Attendance < 75% AND LMS Monthly Logins < 10.',
      recommendedAction: 'Faculty mentorship to identify burnout or off-campus freelancing; re-engagement check.',
      badgeColor: 'border-blue-500/30 text-blue-400 bg-blue-950/20',
      filterFn: (s) => s.segment === 'Disengaged High-Potential',
    },
    {
      id: 'Placement Ready',
      title: 'Placement-Ready Achievers',
      count: students.filter((s) => s.segment === 'Placement Ready').length,
      description: 'Well-rounded students meeting tier-1 campus recruitment readiness across all metrics.',
      ruleExplanation: 'Deterministic Rule: Composite Success Score >= 75 AND Placement Readiness Score >= 75.',
      recommendedAction: 'Fast-track premium company mock interviews; peer tutor leadership roles.',
      badgeColor: 'border-teal-500/30 text-teal-400 bg-teal-950/20',
      filterFn: (s) => s.segment === 'Placement Ready',
    },
    {
      id: 'Data Insufficient',
      title: 'Insufficient Data (Review Queue)',
      count: students.filter((s) => s.segment === 'Data Insufficient').length,
      description: 'Records missing core mock tests, aptitude scores, or semester assessment returns.',
      ruleExplanation: 'Deterministic Rule: Data Quality Completeness < 70%. Provisional score estimates applied.',
      recommendedAction: 'Trigger administrative survey to collect missing diagnostic test results.',
      badgeColor: 'border-slate-700 text-slate-300 bg-slate-900',
      filterFn: (s) => s.segment === 'Data Insufficient',
    },
  ];

  const [activeSegmentId, setActiveSegmentId] = useState<StudentSegment>('Academic Critical');

  const currentCohort = cohorts.find((c) => c.id === activeSegmentId) || cohorts[0];
  const cohortStudents = students.filter(currentCohort.filterFn);

  return (
    <div className="space-y-6">
      {/* Top Banner with Model Transparency Disclaimer */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold">
            <BrainCircuit className="h-4 w-4" />
            <span>Deterministic Explainable Intelligence Architecture</span>
          </div>
          <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-400">
            Rules-Engine v2.4 (Auditable)
          </span>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white">
          Predictive Intelligence & Behavioral Segmentation
        </h1>

        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          To comply with ethical educational standards, Campus Pulse AI utilizes transparent rule-based risk heuristics rather than black-box probabilistic algorithms. Each student classification is deterministic, auditable, and directly attributable to specific measurable behaviors.
        </p>

        <div className="flex items-start gap-2 rounded-lg border border-slate-800/80 bg-slate-950 p-3 text-[11px] text-slate-400">
          <Info className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
          <span>
            <strong>Evaluation Disclaimer:</strong> These rule-based indicators highlight actionable correlations for campus advisors. They do not constitute deterministic psychological assessments or irrevocable predictions of academic fate.
          </span>
        </div>
      </div>

      {/* Cohort Segment Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cohorts.map((cohort) => {
          const isSelected = activeSegmentId === cohort.id;
          return (
            <div
              key={cohort.id}
              onClick={() => setActiveSegmentId(cohort.id)}
              className={`rounded-xl border p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-teal-500 bg-slate-900 shadow-md ring-1 ring-teal-500/20'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`rounded px-2 py-0.5 text-[10px] font-bold border ${cohort.badgeColor}`}>
                  {cohort.id}
                </span>
                <span className="font-mono text-sm font-bold text-white tabular-nums">
                  {cohort.count} students
                </span>
              </div>
              <h3 className="mt-2 text-xs font-bold text-slate-200">{cohort.title}</h3>
              <p className="mt-1 text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {cohort.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Selected Cohort Deep-Dive Box */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">{currentCohort.title}</h2>
              <span className="font-mono text-xs text-teal-400">({cohortStudents.length} active records)</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{currentCohort.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('intervention-lab')}
              className="rounded-lg bg-teal-500 px-3.5 py-1.5 text-xs font-medium text-slate-950 hover:bg-teal-400 transition-colors"
            >
              Simulate Cohort Intervention
            </button>
          </div>
        </div>

        {/* Explainability Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3.5 space-y-1.5">
            <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider">
              Diagnostic Criteria & Logic
            </span>
            <p className="text-xs font-mono text-slate-300 leading-relaxed">
              {currentCohort.ruleExplanation}
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3.5 space-y-1.5">
            <span className="text-[11px] font-semibold text-violet-400 uppercase tracking-wider">
              Recommended Protocol
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentCohort.recommendedAction}
            </p>
          </div>
        </div>

        {/* Student List in Cohort */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-300">Cohort Members ({cohortStudents.length})</h3>

          <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <tr>
                  <th className="py-2.5 px-3 font-medium">Student</th>
                  <th className="py-2.5 px-3 font-medium">Department</th>
                  <th className="py-2.5 px-3 text-right font-medium">CGPA</th>
                  <th className="py-2.5 px-3 text-right font-medium">Attendance</th>
                  <th className="py-2.5 px-3 text-right font-medium">Coding</th>
                  <th className="py-2.5 px-3 text-right font-medium">Interview</th>
                  <th className="py-2.5 px-3 font-medium">Attributed Factors</th>
                  <th className="py-2.5 px-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {cohortStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      No students currently classified in this segment.
                    </td>
                  </tr>
                ) : (
                  cohortStudents.slice(0, 10).map((stu) => (
                    <tr key={stu.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-white">{stu.name}</div>
                        <div className="font-mono text-[10px] text-slate-400">{stu.id}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">{stu.department}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-200 tabular-nums">
                        {stu.cgpa.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                        <span className={stu.attendance < 75 ? 'text-rose-400 font-semibold' : 'text-slate-300'}>
                          {stu.attendance}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-200 tabular-nums">
                        {stu.codingScore}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                        <span className={stu.mockInterviewScore < 50 ? 'text-amber-400' : 'text-slate-200'}>
                          {stu.mockInterviewScore}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 max-w-xs">
                        <span className="truncate block text-[11px]">
                          {stu.topNegativeFactors.length > 0
                            ? stu.topNegativeFactors[0].factor
                            : stu.topPositiveFactors.length > 0
                            ? stu.topPositiveFactors[0].factor
                            : 'Stable parameters'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => setSelectedStudentId(stu.id)}
                          className="rounded bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-teal-300 hover:bg-slate-700"
                        >
                          Dossier
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {cohortStudents.length > 10 && (
            <div className="text-center text-xs text-slate-400 pt-1">
              Showing top 10 of {cohortStudents.length} students in this cohort. Open Student Explorer to filter full list.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
