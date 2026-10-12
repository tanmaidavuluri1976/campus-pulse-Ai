import React, { useState, useMemo } from 'react';
import {
  FlaskConical,
  Sparkles,
  Sliders,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Copy,
  Plus,
  BookmarkCheck,
  RotateCcw,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  InterventionType,
  ScoredStudent,
  StudentSegment,
  Department,
} from '../types';
import { calculateSuccessScore, calculatePlacementScore, getRiskLevel } from '../utils/scoring';
import { RiskBadge } from '../components/common/RiskBadge';

interface SimulationScenario {
  id: 'A' | 'B';
  name: string;
  type: InterventionType;
  intensity: 'Standard' | 'Elevated' | 'Intensive';
  durationWeeks: number;
  facultyHours: number;
}

const INTERVENTION_CONFIGS: Record<
  InterventionType,
  {
    name: string;
    description: string;
    primaryImpact: string;
    baseFacultyHours: number;
    defaultTarget: string;
  }
> = {
  'Attendance Mentoring': {
    name: 'Attendance Mentoring',
    description: 'Weekly proctor check-ins, parent sync, and commute barrier resolution.',
    primaryImpact: 'Attendance (+8% to +22%), LMS Logins (+25%)',
    baseFacultyHours: 6,
    defaultTarget: 'Attendance Recovery',
  },
  'Subject Tutoring': {
    name: 'Subject Tutoring',
    description: 'Faculty and high-achiever peer tutoring in lagging core coursework.',
    primaryImpact: 'Internal Assessment (+10 to +25 pts), Backlog Clearance',
    baseFacultyHours: 12,
    defaultTarget: 'Academic Grade Remediation',
  },
  'Assignment Recovery': {
    name: 'Assignment Recovery',
    description: 'Structured deadline extensions, lab catch-up sessions, and tutor feedback.',
    primaryImpact: 'Assignment Completion (+15% to +35%)',
    baseFacultyHours: 4,
    defaultTarget: 'Coursework Submission Clearance',
  },
  'Coding Practice': {
    name: 'Coding Practice',
    description: 'Algorithmic DSA study circles, LeetCode sprints, and debug clinics.',
    primaryImpact: 'Coding Score (+12 to +28 pts), Tech Skills (+10 pts)',
    baseFacultyHours: 14,
    defaultTarget: 'Technical Problem Solving',
  },
  'Aptitude Training': {
    name: 'Aptitude Training',
    description: 'Quantitative aptitude, logical reasoning, and timed recruitment drills.',
    primaryImpact: 'Aptitude Assessment Score (+15 to +30 pts)',
    baseFacultyHours: 8,
    defaultTarget: 'Campus Placement Screening Filter',
  },
  'Mock Interviews': {
    name: 'Mock Interviews',
    description: 'Simulated technical and HR video boards with recorded feedback rubric.',
    primaryImpact: 'Mock Interview Score (+18 to +35 pts), Communication (+12 pts)',
    baseFacultyHours: 10,
    defaultTarget: 'Interview Articulation & Confidence',
  },
  'Communication Coaching': {
    name: 'Communication Coaching',
    description: 'Spoken English labs, group discussion drills, and presentation practice.',
    primaryImpact: 'Communication Score (+15 to +28 pts), Resume Clarity',
    baseFacultyHours: 8,
    defaultTarget: 'Soft Skills & Executive Presence',
  },
  'Certification Programs': {
    name: 'Certification Programs',
    description: 'Subsidized cloud, AI, or industry credential completion track.',
    primaryImpact: 'Certifications (+1 to +2), Tech Score (+12 pts)',
    baseFacultyHours: 6,
    defaultTarget: 'Resume Value Proposition',
  },
};

export const InterventionLab: React.FC = () => {
  const { students, settings, addIntervention, setActiveTab } = useApp();

  // Mode: Single Student vs Cohort
  const [targetMode, setTargetMode] = useState<'student' | 'cohort'>('student');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [selectedCohort, setSelectedCohort] = useState<StudentSegment>('Academic Critical');

  // Multi-Scenario State
  const [scenarioA, setScenarioA] = useState<SimulationScenario>({
    id: 'A',
    name: 'Scenario A (Focused)',
    type: 'Subject Tutoring',
    intensity: 'Standard',
    durationWeeks: 6,
    facultyHours: 12,
  });

  const [scenarioB, setScenarioB] = useState<SimulationScenario>({
    id: 'B',
    name: 'Scenario B (Comprehensive Multi-Modal)',
    type: 'Mock Interviews',
    intensity: 'Intensive',
    durationWeeks: 8,
    facultyHours: 20,
  });

  const [activeScenarioTab, setActiveScenarioTab] = useState<'A' | 'B'>('A');
  const [committedNotice, setCommittedNotice] = useState<string | null>(null);

  // Target Student Object
  const targetStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || students[0];
  }, [students, selectedStudentId]);

  // Target Cohort Students
  const cohortStudents = useMemo(() => {
    return students.filter((s) => s.segment === selectedCohort);
  }, [students, selectedCohort]);

  /**
   * Transparent hypothetical outcome simulator
   * Strictly calculates modeled projections without altering state
   */
  const simulateOutcome = (student: ScoredStudent, scenario: SimulationScenario) => {
    // Multiplier based on intensity
    const intensityMultiplier =
      scenario.intensity === 'Standard' ? 1.0 : scenario.intensity === 'Elevated' ? 1.4 : 1.8;

    // Multiplier based on duration
    const durationMultiplier = Math.min(1.5, Math.max(0.6, scenario.durationWeeks / 6));

    // Create hypothetical clone
    const sim = { ...student };

    switch (scenario.type) {
      case 'Attendance Mentoring':
        sim.attendance = Math.min(98, Math.round(sim.attendance + 14 * intensityMultiplier * durationMultiplier));
        sim.labAttendance = Math.min(98, Math.round(sim.labAttendance + 12 * intensityMultiplier));
        sim.lmsLoginCountMonthly = Math.min(45, Math.round(sim.lmsLoginCountMonthly + 8 * intensityMultiplier));
        break;

      case 'Subject Tutoring':
        sim.internalAssessmentScore = Math.min(98, Math.round(sim.internalAssessmentScore + 18 * intensityMultiplier * durationMultiplier));
        sim.backlogsCount = Math.max(0, sim.backlogsCount - (scenario.intensity === 'Intensive' ? 1 : 0));
        break;

      case 'Assignment Recovery':
        sim.assignmentCompletionRate = Math.min(100, Math.round(sim.assignmentCompletionRate + 25 * intensityMultiplier * durationMultiplier));
        sim.lmsAvgHoursWeekly = Math.min(20, Math.round(sim.lmsAvgHoursWeekly + 4 * intensityMultiplier));
        break;

      case 'Coding Practice':
        sim.codingScore = Math.min(98, Math.round(sim.codingScore + 20 * intensityMultiplier * durationMultiplier));
        sim.technicalSkillScore = Math.min(96, Math.round(sim.technicalSkillScore + 12 * intensityMultiplier));
        break;

      case 'Aptitude Training':
        sim.aptitudeScore = Math.min(98, Math.round(sim.aptitudeScore + 22 * intensityMultiplier * durationMultiplier));
        break;

      case 'Mock Interviews':
        sim.mockInterviewScore = Math.min(96, Math.round(sim.mockInterviewScore + 26 * intensityMultiplier * durationMultiplier));
        sim.communicationSkillScore = Math.min(95, Math.round(sim.communicationSkillScore + 14 * intensityMultiplier));
        break;

      case 'Communication Coaching':
        sim.communicationSkillScore = Math.min(96, Math.round(sim.communicationSkillScore + 22 * intensityMultiplier * durationMultiplier));
        sim.mockInterviewScore = Math.min(94, Math.round(sim.mockInterviewScore + 12 * intensityMultiplier));
        break;

      case 'Certification Programs':
        sim.certificationsCompleted = sim.certificationsCompleted + (scenario.intensity === 'Intensive' ? 2 : 1);
        sim.technicalSkillScore = Math.min(95, Math.round(sim.technicalSkillScore + 14 * intensityMultiplier));
        break;
    }

    const { score: newSuccess } = calculateSuccessScore(sim, settings.successWeights);
    const { score: newPlacement } = calculatePlacementScore(sim, settings.placementWeights);
    const newAcademicRisk = getRiskLevel(newSuccess, settings.thresholds.academicHighCutoff, settings.thresholds.academicMediumCutoff);
    const newPlacementRisk = getRiskLevel(newPlacement, settings.thresholds.placementHighCutoff, settings.thresholds.placementMediumCutoff);

    return {
      simulatedStudent: sim,
      newSuccess,
      newPlacement,
      successDelta: Math.round((newSuccess - student.successScore) * 10) / 10,
      placementDelta: Math.round((newPlacement - student.placementScore) * 10) / 10,
      newAcademicRisk,
      newPlacementRisk,
    };
  };

  const resultA = useMemo(() => simulateOutcome(targetStudent, scenarioA), [targetStudent, scenarioA, settings]);
  const resultB = useMemo(() => simulateOutcome(targetStudent, scenarioB), [targetStudent, scenarioB, settings]);

  const handleCommitScenario = (scenario: SimulationScenario, result: typeof resultA) => {
    addIntervention({
      studentId: targetStudent.id,
      studentName: targetStudent.name,
      department: targetStudent.department,
      type: scenario.type,
      category:
        scenario.type.includes('Interview') || scenario.type.includes('Coding') || scenario.type.includes('Aptitude')
          ? 'Placement'
          : scenario.type.includes('Assignment')
          ? 'Engagement'
          : 'Academic',
      priority: result.simulatedStudent.overallRisk === 'High' ? 'Urgent' : 'High',
      estimatedHours: scenario.facultyHours,
      assignedFaculty: `Assigned Advisor (${targetStudent.department})`,
      status: 'Accepted',
      followUpDate: new Date(Date.now() + scenario.durationWeeks * 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      targetMetric: `Target Success Score ${result.newSuccess} (+${result.successDelta})`,
      intendedOutcome: `Commitment from Intervention Lab: ${scenario.name} with ${scenario.intensity} intensity over ${scenario.durationWeeks} weeks.`,
      beforeMetrics: {
        successScore: targetStudent.successScore,
        placementScore: targetStudent.placementScore,
        attendance: targetStudent.attendance,
        cgpa: targetStudent.cgpa,
        codingScore: targetStudent.codingScore,
        mockInterviewScore: targetStudent.mockInterviewScore,
      },
    });

    setCommittedNotice(`Successfully committed ${scenario.name} to the active Resource Optimizer Queue!`);
    setTimeout(() => setCommittedNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-teal-500/20 bg-gradient-to-r from-teal-950/30 via-slate-900 to-slate-950 p-5 space-y-2">
        <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold">
          <FlaskConical className="h-4 w-4" />
          <span>Core Differentiator: Counterfactual What-If Intervention Lab</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          Simulate Hypotheses, Compare Scenarios, Estimate Impact
        </h1>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          Test candidate interventions on specific students or systemic segments before committing scarce institutional resources. Side-by-side multi-scenario modeling with transparent adjustment coefficients.
        </p>
      </div>

      {committedNotice && (
        <div className="rounded-xl border border-teal-500/30 bg-teal-950/40 p-4 flex items-center justify-between text-xs text-teal-200">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="h-4 w-4 text-teal-400" />
            <span>{committedNotice}</span>
          </div>
          <button
            onClick={() => setActiveTab('resource-optimizer')}
            className="font-medium underline hover:text-white"
          >
            View in Optimizer →
          </button>
        </div>
      )}

      {/* Target Selector: Individual Student vs Cohort */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-white">Simulation Target:</span>
            <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
              <button
                onClick={() => setTargetMode('student')}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  targetMode === 'student'
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Individual Student
              </button>
              <button
                onClick={() => setTargetMode('cohort')}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  targetMode === 'cohort'
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Cohort Segment
              </button>
            </div>
          </div>

          <span className="text-[11px] text-slate-400">
            Current historical records remain unchanged during simulation
          </span>
        </div>

        {targetMode === 'student' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Select Candidate Student
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.id}) · {s.department} · Success: {s.successScore} · {s.segment}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick baseline preview card */}
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">{targetStudent.name}</span>
                <span className="text-[10px] font-mono text-teal-400">{targetStudent.id}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Baseline Success:</span>
                <span className="font-mono text-white font-bold">{targetStudent.successScore}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Placement Readiness:</span>
                <span className="font-mono text-white font-bold">{targetStudent.placementScore}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Attendance / CGPA:</span>
                <span className="font-mono text-white">{targetStudent.attendance}% / {targetStudent.cgpa.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Select Systemic Cohort Segment
              </label>
              <select
                value={selectedCohort}
                onChange={(e) => {
                  setSelectedCohort(e.target.value as StudentSegment);
                  const firstInCohort = students.find((s) => s.segment === e.target.value);
                  if (firstInCohort) setSelectedStudentId(firstInCohort.id);
                }}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
              >
                <option value="Academic Critical">Academic Critical (Attendance & Backlogs)</option>
                <option value="Interview Bottleneck">Interview Bottleneck (Strong Tech / Low Interview)</option>
                <option value="Placement Gaps">Placement Gaps (High CGPA / Low Readiness)</option>
                <option value="Disengaged High-Potential">Disengaged High-Potential</option>
              </select>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span>Cohort Size:</span>
                <span className="font-mono text-white font-bold">{cohortStudents.length} students</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Representative Student:</span>
                <span className="text-teal-400 truncate max-w-[140px]">{targetStudent.name}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Side-by-Side Multi-Scenario Configuration & Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Scenario A Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-500/20 text-teal-400 font-bold text-xs">
                A
              </span>
              <h2 className="text-sm font-bold text-white">{scenarioA.name}</h2>
            </div>
            <span className="text-xs font-mono text-teal-400">
              {scenarioA.facultyHours} Faculty Hrs
            </span>
          </div>

          {/* Controls */}
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Intervention Type
              </label>
              <select
                value={scenarioA.type}
                onChange={(e) =>
                  setScenarioA((prev) => ({
                    ...prev,
                    type: e.target.value as InterventionType,
                    facultyHours: INTERVENTION_CONFIGS[e.target.value as InterventionType].baseFacultyHours,
                  }))
                }
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
              >
                {Object.keys(INTERVENTION_CONFIGS).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Intensity Level
                </label>
                <select
                  value={scenarioA.intensity}
                  onChange={(e) =>
                    setScenarioA((prev) => ({
                      ...prev,
                      intensity: e.target.value as any,
                      facultyHours:
                        e.target.value === 'Intensive'
                          ? prev.facultyHours * 1.5
                          : e.target.value === 'Elevated'
                          ? prev.facultyHours * 1.2
                          : prev.facultyHours,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="Standard">Standard (1x)</option>
                  <option value="Elevated">Elevated (1.4x)</option>
                  <option value="Intensive">Intensive (1.8x)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Duration (Weeks)
                </label>
                <select
                  value={scenarioA.durationWeeks}
                  onChange={(e) =>
                    setScenarioA((prev) => ({
                      ...prev,
                      durationWeeks: parseInt(e.target.value),
                    }))
                  }
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
                >
                  <option value={2}>2 Weeks Sprint</option>
                  <option value={4}>4 Weeks Modular</option>
                  <option value={6}>6 Weeks Half-Term</option>
                  <option value={8}>8 Weeks Extended</option>
                  <option value={12}>12 Weeks Full-Semester</option>
                </select>
              </div>
            </div>
          </div>

          {/* Simulated Impact Comparison */}
          <div className="rounded-lg border border-teal-500/20 bg-teal-950/15 p-4 space-y-3">
            <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider">
              Projected Outcome: Scenario A
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-slate-400">Student Success Score</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-mono text-xl font-bold text-white tabular-nums">
                    {resultA.newSuccess}
                  </span>
                  <span className="font-mono text-xs font-semibold text-teal-400 tabular-nums">
                    +{resultA.successDelta} pts
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Baseline: {targetStudent.successScore}
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-400">Placement Readiness</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-mono text-xl font-bold text-white tabular-nums">
                    {resultA.newPlacement}
                  </span>
                  <span className="font-mono text-xs font-semibold text-violet-400 tabular-nums">
                    +{resultA.placementDelta} pts
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Baseline: {targetStudent.placementScore}
                </div>
              </div>
            </div>

            <div className="border-t border-teal-500/20 pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-400">New Academic Risk Tier:</span>
              <RiskBadge level={resultA.newAcademicRisk} size="sm" />
            </div>
          </div>

          <button
            onClick={() => handleCommitScenario(scenarioA, resultA)}
            className="w-full rounded-lg bg-teal-500 px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-teal-400 transition-colors"
          >
            Commit Scenario A to Optimizer Queue
          </button>
        </div>

        {/* Scenario B Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-500/20 text-violet-400 font-bold text-xs">
                B
              </span>
              <h2 className="text-sm font-bold text-white">{scenarioB.name}</h2>
            </div>
            <span className="text-xs font-mono text-violet-400">
              {scenarioB.facultyHours} Faculty Hrs
            </span>
          </div>

          {/* Controls */}
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Intervention Type
              </label>
              <select
                value={scenarioB.type}
                onChange={(e) =>
                  setScenarioB((prev) => ({
                    ...prev,
                    type: e.target.value as InterventionType,
                    facultyHours: INTERVENTION_CONFIGS[e.target.value as InterventionType].baseFacultyHours * 1.5,
                  }))
                }
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
              >
                {Object.keys(INTERVENTION_CONFIGS).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Intensity Level
                </label>
                <select
                  value={scenarioB.intensity}
                  onChange={(e) =>
                    setScenarioB((prev) => ({
                      ...prev,
                      intensity: e.target.value as any,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="Standard">Standard (1x)</option>
                  <option value="Elevated">Elevated (1.4x)</option>
                  <option value="Intensive">Intensive (1.8x)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Duration (Weeks)
                </label>
                <select
                  value={scenarioB.durationWeeks}
                  onChange={(e) =>
                    setScenarioB((prev) => ({
                      ...prev,
                      durationWeeks: parseInt(e.target.value),
                    }))
                  }
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
                >
                  <option value={2}>2 Weeks Sprint</option>
                  <option value={4}>4 Weeks Modular</option>
                  <option value={6}>6 Weeks Half-Term</option>
                  <option value={8}>8 Weeks Extended</option>
                  <option value={12}>12 Weeks Full-Semester</option>
                </select>
              </div>
            </div>
          </div>

          {/* Simulated Impact Comparison */}
          <div className="rounded-lg border border-violet-500/20 bg-violet-950/15 p-4 space-y-3">
            <span className="text-[11px] font-semibold text-violet-400 uppercase tracking-wider">
              Projected Outcome: Scenario B
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-slate-400">Student Success Score</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-mono text-xl font-bold text-white tabular-nums">
                    {resultB.newSuccess}
                  </span>
                  <span className="font-mono text-xs font-semibold text-teal-400 tabular-nums">
                    +{resultB.successDelta} pts
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Baseline: {targetStudent.successScore}
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-400">Placement Readiness</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-mono text-xl font-bold text-white tabular-nums">
                    {resultB.newPlacement}
                  </span>
                  <span className="font-mono text-xs font-semibold text-violet-400 tabular-nums">
                    +{resultB.placementDelta} pts
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Baseline: {targetStudent.placementScore}
                </div>
              </div>
            </div>

            <div className="border-t border-violet-500/20 pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-400">New Academic Risk Tier:</span>
              <RiskBadge level={resultB.newAcademicRisk} size="sm" />
            </div>
          </div>

          <button
            onClick={() => handleCommitScenario(scenarioB, resultB)}
            className="w-full rounded-lg bg-violet-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-violet-500 transition-colors"
          >
            Commit Scenario B to Optimizer Queue
          </button>
        </div>
      </div>

      {/* Comparative Scenario Differential Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Side-by-Side Trade-Off Analysis
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 font-medium">Metric Dimension</th>
                <th className="py-2.5 font-medium text-right">Current Baseline</th>
                <th className="py-2.5 font-medium text-right text-teal-400">Scenario A ({scenarioA.type})</th>
                <th className="py-2.5 font-medium text-right text-violet-400">Scenario B ({scenarioB.type})</th>
                <th className="py-2.5 font-medium text-right">Variance / Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums">
              <tr>
                <td className="py-2.5 font-sans text-slate-300">Composite Success Score</td>
                <td className="py-2.5 text-right text-slate-400">{targetStudent.successScore}</td>
                <td className="py-2.5 text-right text-teal-300 font-bold">{resultA.newSuccess}</td>
                <td className="py-2.5 text-right text-violet-300 font-bold">{resultB.newSuccess}</td>
                <td className="py-2.5 text-right text-slate-200">
                  {resultB.newSuccess >= resultA.newSuccess
                    ? `B leads by +${(resultB.newSuccess - resultA.newSuccess).toFixed(1)}`
                    : `A leads by +${(resultA.newSuccess - resultB.newSuccess).toFixed(1)}`}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 font-sans text-slate-300">Placement Readiness</td>
                <td className="py-2.5 text-right text-slate-400">{targetStudent.placementScore}</td>
                <td className="py-2.5 text-right text-teal-300 font-bold">{resultA.newPlacement}</td>
                <td className="py-2.5 text-right text-violet-300 font-bold">{resultB.newPlacement}</td>
                <td className="py-2.5 text-right text-slate-200">
                  {resultB.newPlacement >= resultA.newPlacement
                    ? `B leads by +${(resultB.newPlacement - resultA.newPlacement).toFixed(1)}`
                    : `A leads by +${(resultA.newPlacement - resultB.newPlacement).toFixed(1)}`}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 font-sans text-slate-300">Faculty Hours Demanded</td>
                <td className="py-2.5 text-right text-slate-400">0 hrs</td>
                <td className="py-2.5 text-right text-teal-300 font-bold">{scenarioA.facultyHours} hrs</td>
                <td className="py-2.5 text-right text-violet-300 font-bold">{scenarioB.facultyHours} hrs</td>
                <td className="py-2.5 text-right text-slate-200">
                  Δ {Math.abs(scenarioB.facultyHours - scenarioA.facultyHours)} hrs
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
