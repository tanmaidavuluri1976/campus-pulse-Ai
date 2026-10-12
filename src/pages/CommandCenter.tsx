import React from 'react';
import {
  Users,
  AlertTriangle,
  Briefcase,
  TrendingUp,
  Award,
  ArrowRight,
  Flame,
  CheckCircle2,
  Calendar,
  Sparkles,
  Layers,
  ChevronRight,
  Building2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/common/MetricCard';
import { FilterBar } from '../components/common/FilterBar';
import { RiskBadge } from '../components/common/RiskBadge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Department } from '../types';

export const CommandCenter: React.FC = () => {
  const {
    filteredStudents,
    allStudentsCount,
    setSelectedStudentId,
    setActiveTab,
    setFilters,
  } = useApp();

  // 1. KPI Calculations from filtered dataset
  const totalCount = filteredStudents.length;
  const academicRiskCount = filteredStudents.filter(
    (s) => s.academicRisk === 'High'
  ).length;
  const placementRiskCount = filteredStudents.filter(
    (s) => s.placementRisk === 'High'
  ).length;

  const avgSuccessScore =
    totalCount > 0
      ? Math.round(
          (filteredStudents.reduce((acc, s) => acc + s.successScore, 0) /
            totalCount) *
            10
        ) / 10
      : 0;

  const avgPlacementScore =
    totalCount > 0
      ? Math.round(
          (filteredStudents.reduce((acc, s) => acc + s.placementScore, 0) /
            totalCount) *
            10
        ) / 10
      : 0;

  // 2. Risk Distribution Data
  const highRiskCount = filteredStudents.filter((s) => s.overallRisk === 'High').length;
  const medRiskCount = filteredStudents.filter((s) => s.overallRisk === 'Medium').length;
  const lowRiskCount = filteredStudents.filter((s) => s.overallRisk === 'Low').length;

  const riskDistribution = [
    { name: 'Critical High Risk', value: highRiskCount, color: '#f43f5e' },
    { name: 'Moderate Watchlist', value: medRiskCount, color: '#f59e0b' },
    { name: 'On Track / Low Risk', value: lowRiskCount, color: '#14b8a6' },
  ];

  // 3. Department-wise Performance Data
  const deptMap: Record<
    string,
    { count: number; successSum: number; placementSum: number; highRiskCount: number }
  > = {};

  filteredStudents.forEach((s) => {
    if (!deptMap[s.department]) {
      deptMap[s.department] = { count: 0, successSum: 0, placementSum: 0, highRiskCount: 0 };
    }
    deptMap[s.department].count++;
    deptMap[s.department].successSum += s.successScore;
    deptMap[s.department].placementSum += s.placementScore;
    if (s.overallRisk === 'High') {
      deptMap[s.department].highRiskCount++;
    }
  });

  const departmentPerformance = Object.keys(deptMap).map((dept) => {
    const item = deptMap[dept];
    return {
      department: dept.replace(' & ', '&').replace(' Engineering', ''),
      fullDept: dept,
      avgSuccess: Math.round((item.successSum / item.count) * 10) / 10,
      avgPlacement: Math.round((item.placementSum / item.count) * 10) / 10,
      students: item.count,
      highRisk: item.highRiskCount,
    };
  });

  // 4. Department by Year Risk Heatmap Matrix
  const departments: Department[] = [
    'Computer Science',
    'Information Technology',
    'Electronics & Comm',
    'Data Science & AI',
    'Mechanical Eng',
    'Civil Eng',
  ];
  const years = [1, 2, 3, 4];

  const getHeatmapValue = (dept: Department, year: number) => {
    const cellStudents = filteredStudents.filter(
      (s) => s.department === dept && s.year === year
    );
    if (cellStudents.length === 0) return { total: 0, highRisk: 0, rate: 0 };
    const highRisk = cellStudents.filter((s) => s.overallRisk === 'High').length;
    return {
      total: cellStudents.length,
      highRisk,
      rate: Math.round((highRisk / cellStudents.length) * 100),
    };
  };

  // 5. Emerging Signals
  const attendanceDeclineCount = filteredStudents.filter(
    (s) => s.attendance < 65
  ).length;
  const interviewBottleneckCount = filteredStudents.filter(
    (s) => s.year >= 3 && s.codingScore >= 70 && s.mockInterviewScore < 50
  ).length;
  const highGpaLowPlacementCount = filteredStudents.filter(
    (s) => s.cgpa >= 8.0 && s.placementScore < 55
  ).length;

  // 6. Priority Students (Highest urgency)
  const priorityStudents = [...filteredStudents]
    .sort((a, b) => a.successScore - b.successScore)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-teal-500/20 bg-gradient-to-r from-teal-950/30 via-slate-900 to-slate-950 p-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
            <Sparkles className="h-4 w-4" />
            <span>KPMG Smart Campus Analytics Hackathon 2026</span>
          </div>
          <h1 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-white">
            Campus Pulse Command Center
          </h1>
          <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
            Multi-dimensional institutional telemetry integrating academic transcripts, LMS activity, attendance logs, and placement diagnostic readiness.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('intervention-lab')}
            className="rounded-lg bg-teal-500 px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-teal-400 transition-colors shadow-sm"
          >
            Launch What-If Lab
          </button>
          <button
            onClick={() => setActiveTab('campus-analyst')}
            className="rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
          >
            Ask AI Analyst
          </button>
        </div>
      </div>

      {/* Reactive Global Filter Bar */}
      <FilterBar />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <MetricCard
          title="Students Analyzed"
          value={totalCount}
          subtitle={`Across ${departments.length} departments`}
          icon={Users}
          variant="default"
        />
        <MetricCard
          title="Academic Support Needed"
          value={academicRiskCount}
          subtitle={`${totalCount > 0 ? Math.round((academicRiskCount / totalCount) * 100) : 0}% of cohort`}
          icon={AlertTriangle}
          variant="rose"
          onClick={() => setFilters((p) => ({ ...p, riskCategory: 'Academic High' }))}
        />
        <MetricCard
          title="Placement Readiness Gaps"
          value={placementRiskCount}
          subtitle="Pre-recruitment bottleneck"
          icon={Briefcase}
          variant="amber"
          onClick={() => setFilters((p) => ({ ...p, riskCategory: 'Placement High' }))}
        />
        <MetricCard
          title="Avg Success Score"
          value={`${avgSuccessScore}`}
          subtitle="Composite index / 100"
          icon={TrendingUp}
          variant="teal"
        />
        <MetricCard
          title="Avg Placement Readiness"
          value={`${avgPlacementScore}`}
          subtitle="Technical & interview ready"
          icon={Award}
          variant="violet"
        />
      </div>

      {/* Primary Analytics Section: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Department-Wise Performance */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Department-Wise Success & Placement Comparison</h2>
              <p className="text-xs text-slate-400">Average Student Success Score vs. Placement Readiness Index</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-teal-400">
                <span className="h-2 w-2 rounded-full bg-teal-400" /> Success Score
              </span>
              <span className="flex items-center gap-1.5 text-violet-400">
                <span className="h-2 w-2 rounded-full bg-violet-400" /> Placement Readiness
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="department" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="avgSuccess" fill="#14b8a6" name="Success Score" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgPlacement" fill="#8b5cf6" name="Placement Readiness" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Donut */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Institutional Risk Tiering</h2>
            <p className="text-xs text-slate-400">Active distribution by composite risk score</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 border-t border-slate-800/80 pt-3">
            {riskDistribution.map((tier) => (
              <div key={tier.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: tier.color }} />
                  {tier.name}
                </span>
                <span className="font-mono font-medium text-white tabular-nums">
                  {tier.value} ({totalCount > 0 ? Math.round((tier.value / totalCount) * 100) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap: Department x Academic Year Risk Matrix */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-white">Department-by-Year Risk Concentration Heatmap</h2>
            <p className="text-xs text-slate-400">
              Interactive grid displaying proportion of high-risk students per academic cohort. Click any cell to inspect.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-slate-900 border border-slate-800" /> Low (0-15%)</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-amber-950/60 border border-amber-800/40" /> Med (16-30%)</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-rose-950/70 border border-rose-800/50" /> High (&gt;30%)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-medium">Department</th>
                {years.map((y) => (
                  <th key={y} className="pb-3 text-center font-medium">Year {y}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {departments.map((dept) => (
                <tr key={dept} className="hover:bg-slate-900/40">
                  <td className="py-2.5 font-medium text-slate-200">{dept}</td>
                  {years.map((year) => {
                    const cell = getHeatmapValue(dept, year);
                    let cellBg = 'bg-slate-950 border-slate-800/60 text-slate-400';
                    if (cell.rate > 30) {
                      cellBg = 'bg-rose-950/50 border-rose-800/40 text-rose-300 font-semibold';
                    } else if (cell.rate > 15) {
                      cellBg = 'bg-amber-950/40 border-amber-800/40 text-amber-300 font-medium';
                    } else if (cell.total > 0) {
                      cellBg = 'bg-teal-950/30 border-teal-800/30 text-teal-300';
                    }

                    return (
                      <td key={year} className="py-2.5 text-center">
                        <button
                          onClick={() => {
                            setFilters((prev) => ({
                              ...prev,
                              department: dept,
                              year: year.toString(),
                            }));
                            setActiveTab('student-explorer');
                          }}
                          className={`inline-block rounded-lg border px-3 py-1.5 text-center transition-transform hover:scale-105 ${cellBg}`}
                          title={`Click to view ${cell.total} students in ${dept} Year ${year}`}
                        >
                          <div className="font-mono text-xs tabular-nums">{cell.rate}%</div>
                          <div className="text-[10px] opacity-75">{cell.highRisk}/{cell.total} risk</div>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Emerging Risk Signals & Priority Students Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Emerging Signals */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white">Emerging Risk Signals</h2>
          </div>

          <div className="space-y-3">
            <div
              onClick={() => {
                setFilters((p) => ({ ...p, segment: 'Academic Critical' }));
                setActiveTab('predictive-intelligence');
              }}
              className="rounded-lg border border-slate-800 bg-slate-950/70 p-3.5 cursor-pointer hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-rose-300">Declining Attendance &lt; 65%</span>
                <span className="font-mono font-bold text-rose-400 tabular-nums">{attendanceDeclineCount} students</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Attendance decay correlates strongly with midterm test failure and backlog risks.
              </p>
            </div>

            <div
              onClick={() => {
                setFilters((p) => ({ ...p, segment: 'Interview Bottleneck' }));
                setActiveTab('predictive-intelligence');
              }}
              className="rounded-lg border border-slate-800 bg-slate-950/70 p-3.5 cursor-pointer hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-amber-300">Interview Bottleneck Gap</span>
                <span className="font-mono font-bold text-amber-400 tabular-nums">{interviewBottleneckCount} students</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Strong coding assessment (&gt;70) but lagging mock interview score (&lt;50).
              </p>
            </div>

            <div
              onClick={() => {
                setFilters((p) => ({ ...p, segment: 'Placement Gaps' }));
                setActiveTab('predictive-intelligence');
              }}
              className="rounded-lg border border-slate-800 bg-slate-950/70 p-3.5 cursor-pointer hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-violet-300">High CGPA with Placement Deficit</span>
                <span className="font-mono font-bold text-violet-400 tabular-nums">{highGpaLowPlacementCount} students</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                CGPA &gt; 8.0 but lagging placement preparation tests. High recovery ROI.
              </p>
            </div>
          </div>
        </div>

        {/* Priority Action Students */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Priority Students Needing Support</h2>
              <p className="text-xs text-slate-400">Students with the lowest composite success scores</p>
            </div>
            <button
              onClick={() => setActiveTab('student-explorer')}
              className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300"
            >
              <span>View all</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2.5 font-medium">Student Name</th>
                  <th className="pb-2.5 font-medium">Department</th>
                  <th className="pb-2.5 font-medium text-right">Success Score</th>
                  <th className="pb-2.5 font-medium text-right">CGPA</th>
                  <th className="pb-2.5 font-medium text-right">Attendance</th>
                  <th className="pb-2.5 font-medium text-center">Status</th>
                  <th className="pb-2.5 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {priorityStudents.map((stu) => (
                  <tr key={stu.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-2.5 font-medium text-white">
                      <div>{stu.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{stu.id}</div>
                    </td>
                    <td className="py-2.5 text-slate-300">{stu.department}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-rose-400 tabular-nums">
                      {stu.successScore}
                    </td>
                    <td className="py-2.5 text-right font-mono text-slate-300 tabular-nums">
                      {stu.cgpa.toFixed(2)}
                    </td>
                    <td className="py-2.5 text-right font-mono text-slate-300 tabular-nums">
                      {stu.attendance}%
                    </td>
                    <td className="py-2.5 text-center">
                      <RiskBadge level={stu.overallRisk} size="sm" />
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => setSelectedStudentId(stu.id)}
                        className="rounded bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recommended Institutional Actions */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-teal-400" />
          <h2 className="text-sm font-semibold text-white">Recommended Institutional Actions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="rounded-lg border border-slate-800/80 bg-slate-950 p-4 space-y-2">
            <span className="text-xs font-semibold text-teal-400">1. Deploy Targeted Attendance Mentoring</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Schedule proctor check-ins for the {attendanceDeclineCount} students falling below 65% attendance before the university semester condonation deadline.
            </p>
            <div className="pt-1 text-[11px] text-slate-500">Resource impact: ~24 faculty hours</div>
          </div>

          <div className="rounded-lg border border-slate-800/80 bg-slate-950 p-4 space-y-2">
            <span className="text-xs font-semibold text-violet-400">2. Launch Mock Interview Crash Cohort</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Organize 1-on-1 alumni and faculty behavioral interview drills for the {interviewBottleneckCount} pre-final students who demonstrate top coding ability but interview anxiety.
            </p>
            <div className="pt-1 text-[11px] text-slate-500">Resource impact: ~36 faculty hours</div>
          </div>

          <div className="rounded-lg border border-slate-800/80 bg-slate-950 p-4 space-y-2">
            <span className="text-xs font-semibold text-amber-400">3. Remedial Tutoring in Core Circuit/Math</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Focus peer-assisted tutoring in Electronics and Mechanical branches where midterm assessment failure rates exceed 25%.
            </p>
            <div className="pt-1 text-[11px] text-slate-500">Resource impact: ~40 faculty hours</div>
          </div>
        </div>
      </div>
    </div>
  );
};
