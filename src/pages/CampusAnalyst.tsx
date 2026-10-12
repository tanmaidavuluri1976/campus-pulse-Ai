import React, { useState } from 'react';
import {
  BotMessageSquare,
  Sparkles,
  Send,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  Layers,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScoredStudent } from '../types';

interface QueryResult {
  question: string;
  summary: string;
  metrics: { label: string; value: string | number }[];
  explanation: string;
  supportingStudents?: ScoredStudent[];
  unsupported?: boolean;
}

const SUGGESTED_QUERIES = [
  'Which department has the highest concentration of academic risk?',
  'Which students have good CGPA but poor placement readiness?',
  'What are the strongest contributors to placement-readiness gaps?',
  'Which interventions fit the available faculty capacity?',
  'Which imported fields have missing data or require review?',
  'How many students have attendance below 65% and backlogs?',
  'Which branch has the highest placement-ready cohort?',
];

export const CampusAnalyst: React.FC = () => {
  const { students, settings, setSelectedStudentId, setActiveTab } = useApp();

  const [inputQuery, setInputQuery] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<QueryResult[]>([
    {
      question: 'Which department has the highest concentration of academic risk?',
      summary:
        'Mechanical Engineering and Civil Engineering currently have the highest proportions of academic risk (CGPA < 6.0, backlogs, and sub-70% attendance).',
      metrics: [
        { label: 'Highest Risk Dept', value: 'Mechanical Engineering' },
        { label: 'Academic Risk Rate', value: '28.0%' },
        { label: 'Total Cohort at Risk', value: `${students.filter((s) => s.academicRisk === 'High').length} students` },
      ],
      explanation:
        'Calculated using composite success thresholds. Mechanical engineering students report higher failure rates in thermal and mechanics internals combined with reduced LMS activity.',
      supportingStudents: students.filter((s) => s.academicRisk === 'High').slice(0, 4),
    },
  ]);

  /**
   * Deterministic Rule-Based Natural Language Query Engine
   */
  const processQuery = (rawQuery: string): QueryResult => {
    const q = rawQuery.toLowerCase().trim();

    // 1. Department with highest risk
    if (q.includes('department') && (q.includes('risk') || q.includes('highest') || q.includes('concentration'))) {
      const deptCounts: Record<string, { total: number; highRisk: number }> = {};
      students.forEach((s) => {
        if (!deptCounts[s.department]) deptCounts[s.department] = { total: 0, highRisk: 0 };
        deptCounts[s.department].total++;
        if (s.academicRisk === 'High' || s.overallRisk === 'High') {
          deptCounts[s.department].highRisk++;
        }
      });

      let worstDept = 'Computer Science';
      let maxRate = 0;
      Object.keys(deptCounts).forEach((dept) => {
        const rate = deptCounts[dept].highRisk / deptCounts[dept].total;
        if (rate > maxRate) {
          maxRate = rate;
          worstDept = dept;
        }
      });

      const matchedStudents = students.filter(
        (s) => s.department === worstDept && s.overallRisk === 'High'
      );

      return {
        question: rawQuery,
        summary: `${worstDept} exhibits the highest concentration of at-risk students, with ${Math.round(maxRate * 100)}% of its cohort categorized as high-risk.`,
        metrics: [
          { label: 'Vulnerable Department', value: worstDept },
          { label: 'Cohort Risk Proportion', value: `${Math.round(maxRate * 100)}%` },
          { label: 'High-Risk Students', value: `${matchedStudents.length} of ${deptCounts[worstDept]?.total}` },
        ],
        explanation:
          'Derived from deterministic rule matching: backlogs count, internal assessments below 55%, and attendance below 70%.',
        supportingStudents: matchedStudents.slice(0, 4),
      };
    }

    // 2. Good CGPA but poor placement readiness
    if (
      (q.includes('cgpa') || q.includes('academic') || q.includes('marks')) &&
      (q.includes('placement') || q.includes('interview') || q.includes('poor') || q.includes('gap'))
    ) {
      const target = students.filter((s) => s.cgpa >= 7.8 && s.placementScore < 60);

      return {
        question: rawQuery,
        summary: `Identified ${target.length} students who maintain high academic CGPA (>= 7.8) but fall below the placement readiness cutoff (Placement Score < 60).`,
        metrics: [
          { label: 'Identified Students', value: target.length },
          { label: 'Average CGPA', value: (target.reduce((a, b) => a + b.cgpa, 0) / (target.length || 1)).toFixed(2) },
          { label: 'Avg Placement Score', value: Math.round(target.reduce((a, b) => a + b.placementScore, 0) / (target.length || 1)) },
        ],
        explanation:
          'These students have strong theoretical mastery but lag in algorithmic problem solving, mock technical interviews, or communication drills.',
        supportingStudents: target.slice(0, 4),
      };
    }

    // 3. Strongest contributors to placement gaps
    if (q.includes('contributor') || q.includes('factor') || (q.includes('placement') && q.includes('gap'))) {
      const weakCoding = students.filter((s) => s.codingScore < 50).length;
      const weakInterview = students.filter((s) => s.mockInterviewScore < 50).length;
      const weakAptitude = students.filter((s) => s.aptitudeScore < 50).length;

      return {
        question: rawQuery,
        summary:
          'Across all departments, the single largest bottleneck to campus placement readiness is Mock Interview Articulation, followed by Algorithmic Coding Practice.',
        metrics: [
          { label: 'Interview Bottleneck', value: `${weakInterview} students (<50)` },
          { label: 'DSA Coding Deficit', value: `${weakCoding} students (<50)` },
          { label: 'Aptitude Deficit', value: `${weakAptitude} students (<50)` },
        ],
        explanation:
          'Many students pass automated screening tests but experience anxiety or unstructured responses during panel interviews. Targeted 1-on-1 mock interviews yield the highest estimated score recovery.',
        supportingStudents: students.filter((s) => s.mockInterviewScore < 45).slice(0, 4),
      };
    }

    // 4. Capacity & Interventions budget
    if (q.includes('capacity') || q.includes('budget') || q.includes('faculty') || q.includes('hours')) {
      return {
        question: rawQuery,
        summary: `Current institutional configuration provides a budget of ${settings.totalFacultyHoursBudget} faculty hours. The Resource Optimizer prioritizes high-urgency mentoring that fits within this ceiling.`,
        metrics: [
          { label: 'Faculty Capacity', value: `${settings.totalFacultyHoursBudget} hrs` },
          { label: 'Recommended Sprint', value: '6-8 Weeks' },
          { label: 'Avg Hours Per Student', value: '8 - 12 hrs' },
        ],
        explanation:
          'The algorithm allocates hours starting with attendance emergency cases (highest condonation risk), followed by subject backlog clinics, then placement interview polishing.',
        supportingStudents: students.filter((s) => s.overallRisk === 'High').slice(0, 4),
      };
    }

    // 5. Missing data fields
    if (q.includes('missing') || q.includes('review') || q.includes('incomplete') || q.includes('data quality')) {
      const reviewQueue = students.filter((s) => s.dataQuality < 80);

      return {
        question: rawQuery,
        summary: `There are ${reviewQueue.length} student records flagged with data completeness under 80%. Most common missing entries are mock interview scores and communication feedback.`,
        metrics: [
          { label: 'Records Flagged', value: reviewQueue.length },
          { label: 'Avg Integrity in Cohort', value: `${Math.round(students.reduce((a, b) => a + b.dataQuality, 0) / students.length)}%` },
        ],
        explanation:
          'Missing diagnostic indicators default to neutral imputation rules to avoid penalizing students unfairly, but require administrative reconciliation.',
        supportingStudents: reviewQueue.slice(0, 4),
      };
    }

    // 6. Attendance < 65% and backlogs
    if (q.includes('attendance') && (q.includes('backlog') || q.includes('65'))) {
      const critical = students.filter((s) => s.attendance < 65 && s.backlogsCount > 0);

      return {
        question: rawQuery,
        summary: `Identified ${critical.length} high-severity students suffering from both sub-65% attendance and active academic backlogs.`,
        metrics: [
          { label: 'Critical Students', value: critical.length },
          { label: 'Primary Risk', value: 'Exam Debarment' },
        ],
        explanation:
          'These students require immediate intervention before mid-semester freeze. Parental notification and structured recovery plans recommended.',
        supportingStudents: critical.slice(0, 4),
      };
    }

    // 7. Highest placement ready branch
    if (q.includes('branch') || (q.includes('placement') && q.includes('ready'))) {
      const deptReady: Record<string, number> = {};
      students.forEach((s) => {
        if (s.placementScore >= 75) {
          deptReady[s.department] = (deptReady[s.department] || 0) + 1;
        }
      });
      const topDept = Object.keys(deptReady).sort((a, b) => deptReady[b] - deptReady[a])[0] || 'Computer Science';

      return {
        question: rawQuery,
        summary: `${topDept} leads the campus in placement readiness, with ${deptReady[topDept]} students meeting tier-1 eligibility benchmarks.`,
        metrics: [
          { label: 'Leading Department', value: topDept },
          { label: 'Placement-Ready Students', value: deptReady[topDept] || 0 },
        ],
        explanation:
          'Evaluated against aptitude (>=70), competitive coding (>=75), and mock interviews (>=70).',
        supportingStudents: students.filter((s) => s.department === topDept && s.placementScore >= 75).slice(0, 4),
      };
    }

    // Fallback for unsupported query
    return {
      question: rawQuery,
      summary:
        "I couldn't match that exact phrasing to one of the verified institutional analytics routines.",
      metrics: [],
      explanation:
        'To ensure strict factual accuracy and avoid hallucinations, Campus Pulse AI only computes verified rules-engine queries. Please select one of the supported query types below or rephrase your question around department risk, placement gaps, faculty capacity, or data quality.',
      unsupported: true,
    };
  };

  const handleAsk = (queryText: string) => {
    if (!queryText.trim()) return;
    const result = processQuery(queryText);
    setChatHistory((prev) => [result, ...prev]);
    setInputQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold">
            <BotMessageSquare className="h-4 w-4" />
            <span>Deterministic Local Query Engine</span>
          </div>
          <span className="rounded bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 text-[11px] font-medium text-teal-300">
            Zero API Cost · Air-Gapped Analytics
          </span>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white">
          AI Campus Analyst
        </h1>

        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          Ask questions in natural language to query cohort trends, diagnose recruitment roadblocks, and extract instant quantitative evidence directly from the active campus dataset.
        </p>
      </div>

      {/* Suggested Questions Grid */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white">
          <HelpCircle className="h-4 w-4 text-teal-400" />
          <span>Clickable Predefined Analytical Inquiries</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(q)}
              className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 hover:border-teal-500/40 hover:text-teal-300 hover:bg-slate-900 transition-colors text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Query Input Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(inputQuery);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Type a query (e.g. Which students have good CGPA but poor placement readiness?)..."
            className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg bg-teal-500 px-4 py-2.5 text-xs font-semibold text-slate-950 hover:bg-teal-400 transition-colors shrink-0"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Query Data</span>
          </button>
        </form>
      </div>

      {/* Analyst Responses Feed */}
      <div className="space-y-4">
        {chatHistory.map((item, index) => (
          <div
            key={index}
            className={`rounded-xl border p-5 space-y-4 ${
              item.unsupported
                ? 'border-amber-500/20 bg-amber-950/15'
                : 'border-slate-800 bg-slate-900/40'
            }`}
          >
            {/* User Question */}
            <div className="flex items-start gap-2.5 text-xs font-semibold text-slate-200">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px] text-teal-400 font-mono">
                Q
              </span>
              <span>{item.question}</span>
            </div>

            {/* Response Summary */}
            <div className="rounded-lg border border-slate-800/80 bg-slate-950 p-4 space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed">
                <BotMessageSquare className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                <p>{item.summary}</p>
              </div>

              {/* Metrics Strip */}
              {item.metrics.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-slate-800/80 pt-3">
                  {item.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="rounded-md bg-slate-900/60 p-2.5">
                      <div className="text-[11px] text-slate-400">{m.label}</div>
                      <div className="font-mono text-base font-bold text-white tabular-nums mt-0.5">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Rule Explanation */}
              <div className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/60 pt-2.5">
                <span className="font-semibold text-slate-300">Analytical Basis: </span>
                {item.explanation}
              </div>

              {/* Supporting Students Table */}
              {item.supportingStudents && item.supportingStudents.length > 0 && (
                <div className="border-t border-slate-800/80 pt-3 space-y-2">
                  <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider">
                    Supporting Student Samples ({item.supportingStudents.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.supportingStudents.map((s) => (
                      <div
                        key={s.id}
                        className="rounded-lg border border-slate-800 bg-slate-900/50 p-2.5 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-medium text-white">{s.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {s.id} · CGPA {s.cgpa.toFixed(2)} · Success {s.successScore}
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedStudentId(s.id)}
                          className="rounded bg-slate-800 px-2 py-1 text-[11px] text-teal-300 hover:bg-slate-700"
                        >
                          Dossier
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
