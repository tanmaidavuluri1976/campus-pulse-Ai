import React, { useState } from 'react';
import {
  Database,
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Download,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  FileText,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Student, Department } from '../types';

interface ParsedRow {
  id: string;
  name: string;
  department: string;
  year: number;
  semester: number;
  cgpa: number;
  attendance: number;
  codingScore: number;
  mockInterviewScore: number;
  aptitudeScore: number;
  technicalSkillScore: number;
  communicationSkillScore: number;
  assignmentCompletionRate: number;
  lmsLoginCountMonthly: number;
  isValid: boolean;
  errors: string[];
  isDuplicate: boolean;
}

const SAMPLE_CSV_CONTENT = `id,name,department,year,semester,cgpa,attendance,codingScore,mockInterviewScore,aptitudeScore,technicalSkillScore,communicationSkillScore,assignmentCompletionRate,lmsLoginCountMonthly
STU-2025-IMP-001,Amitabh Sengupta,Computer Science,3,5,8.45,86,82,75,78,84,72,90,32
STU-2025-IMP-002,Sunita Nambiar,Information Technology,4,7,7.12,64,68,42,58,70,55,62,14
STU-2025-IMP-003,Deepak Chawla,Electronics & Comm,2,3,5.80,52,44,38,45,50,48,48,9
STU-2025-IMP-004,Tarun Singhania,Data Science & AI,3,6,9.10,92,90,88,86,92,85,96,40
STU-2025-IMP-005,Ananya Trivedi,Mechanical Eng,4,8,6.40,74,50,60,54,58,62,70,18`;

export const DataIntegration: React.FC = () => {
  const { students, importStudents, resetToSyntheticData } = useApp();

  const [csvRawText, setCsvRawText] = useState<string>('');
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [importSummary, setImportSummary] = useState<{
    total: number;
    valid: number;
    duplicates: number;
    errors: number;
  } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Download Sample CSV
  const handleDownloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'campus_pulse_student_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download Validation Report
  const handleDownloadReport = () => {
    if (parsedRows.length === 0) return;
    const headers = ['Row_ID', 'Name', 'Status', 'Errors_Found', 'Duplicate_Flag'];
    const rows = parsedRows.map((r) => [
      r.id,
      `"${r.name}"`,
      r.isValid ? 'VALID' : 'INVALID',
      `"${r.errors.join('; ')}"`,
      r.isDuplicate ? 'YES' : 'NO',
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'campus_pulse_validation_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parse and validate CSV string
  const parseCSV = (content: string) => {
    const lines = content.trim().split('\n');
    if (lines.length < 2) {
      alert('CSV file must have a header row and at least one student data row.');
      return;
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const existingIds = new Set(students.map((s) => s.id));
    const rows: ParsedRow[] = [];

    let validCount = 0;
    let duplicateCount = 0;
    let errorCount = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));

      const rowObj: any = {};
      headers.forEach((h, idx) => {
        rowObj[h] = values[idx] || '';
      });

      const id = rowObj['id'] || `STU-GEN-${i}`;
      const name = rowObj['name'] || 'Unnamed Student';
      const department = rowObj['department'] || 'Computer Science';
      const year = parseInt(rowObj['year']) || 1;
      const semester = parseInt(rowObj['semester']) || 1;
      const cgpa = parseFloat(rowObj['cgpa']) || 0;
      const attendance = parseFloat(rowObj['attendance']) || 0;
      const codingScore = parseFloat(rowObj['codingscore']) || 0;
      const mockInterviewScore = parseFloat(rowObj['mockinterviewscore']) || 0;
      const aptitudeScore = parseFloat(rowObj['aptitudescore']) || 0;
      const technicalSkillScore = parseFloat(rowObj['technicalskillscore']) || 0;
      const communicationSkillScore = parseFloat(rowObj['communicationskillscore']) || 0;
      const assignmentCompletionRate = parseFloat(rowObj['assignmentcompletionrate']) || 0;
      const lmsLoginCountMonthly = parseFloat(rowObj['lmslogincountmonthly']) || 0;

      const errors: string[] = [];
      const isDuplicate = existingIds.has(id);

      if (!rowObj['id']) errors.push('Missing Student ID');
      if (!rowObj['name']) errors.push('Missing Name');
      if (cgpa < 0 || cgpa > 10) errors.push(`CGPA (${cgpa}) out of bounds (0-10)`);
      if (attendance < 0 || attendance > 100) errors.push(`Attendance (${attendance}) out of bounds (0-100)`);
      if (codingScore < 0 || codingScore > 100) errors.push('Coding score out of bounds');

      const isValid = errors.length === 0 && !isDuplicate;

      if (isDuplicate) duplicateCount++;
      if (errors.length > 0) errorCount++;
      if (isValid) validCount++;

      rows.push({
        id,
        name,
        department,
        year,
        semester,
        cgpa,
        attendance,
        codingScore,
        mockInterviewScore,
        aptitudeScore,
        technicalSkillScore,
        communicationSkillScore,
        assignmentCompletionRate,
        lmsLoginCountMonthly,
        isValid,
        errors,
        isDuplicate,
      });
    }

    setParsedRows(rows);
    setImportSummary({
      total: rows.length,
      valid: validCount,
      duplicates: duplicateCount,
      errors: errorCount,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvRawText(text);
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const handleApplyImport = () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      alert('No valid student rows to import.');
      return;
    }

    const newStudents: Student[] = validRows.map((r) => ({
      id: r.id,
      name: r.name,
      gender: 'Male',
      department: (r.department as Department) || 'Computer Science',
      year: r.year,
      semester: r.semester,
      rollNumber: `25${r.id.slice(-4)}`,
      email: `${r.name.toLowerCase().replace(/\s+/g, '.')}@campus.edu.in`,
      cgpa: r.cgpa,
      previousSemGpa: Math.max(4.0, r.cgpa - 0.2),
      internalAssessmentScore: Math.round(r.cgpa * 9),
      backlogsCount: r.cgpa < 5.5 ? 1 : 0,
      attendance: r.attendance,
      labAttendance: r.attendance,
      subjectAttendance: [
        { subject: 'Core Module A', percentage: r.attendance },
        { subject: 'Core Module B', percentage: Math.min(100, r.attendance + 4) },
      ],
      lmsLoginCountMonthly: r.lmsLoginCountMonthly || 20,
      lmsAvgHoursWeekly: 6,
      assignmentCompletionRate: r.assignmentCompletionRate || 80,
      forumInteractionsCount: 5,
      eventsParticipated: 2,
      certificationsCompleted: 1,
      aptitudeScore: r.aptitudeScore || 65,
      codingScore: r.codingScore || 65,
      mockInterviewScore: r.mockInterviewScore || 60,
      technicalSkillScore: r.technicalSkillScore || 65,
      communicationSkillScore: r.communicationSkillScore || 65,
      placementParticipation: true,
      resumeScore: 70,
      studentFeedbackRating: 4,
      facultyFeedbackScore: 4,
      missingFields: [],
      historicalTrends: [
        {
          semester: r.semester,
          cgpa: r.cgpa,
          attendance: r.attendance,
          lmsEngagement: r.assignmentCompletionRate || 80,
          internalMarks: Math.round(r.cgpa * 9),
        },
      ],
      isSynthetic: false,
      isImported: true,
    }));

    const result = importStudents(newStudents);
    setSuccessMessage(
      `Successfully integrated ${result.imported} student records into the live database! All analytics updated.`
    );
    setParsedRows([]);
    setImportSummary(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold">
            <Database className="h-4 w-4" />
            <span>Multi-Source Ingestion & Identity Linkage</span>
          </div>
          <span className="rounded bg-slate-800 px-2.5 py-0.5 text-[11px] font-mono text-slate-300">
            CSV Schema v1.0
          </span>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white">
          Data Integration Hub
        </h1>

        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          Ingest raw college records across attendance biometrics, SIS transcripts, LMS portals, and placement trial mock assessments. The system performs column matching, range validation, duplicate rejection, and real-time recalculation of student success indices.
        </p>
      </div>

      {successMessage && (
        <div className="rounded-xl border border-teal-500/30 bg-teal-950/40 p-4 flex items-center justify-between text-xs text-teal-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-teal-400" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-slate-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Actions Strip: Download Template & File Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upload Box */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Upload className="h-4 w-4 text-teal-400" />
            <span>Upload Student CSV File</span>
          </div>

          <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-700 bg-slate-950/80 p-6 cursor-pointer hover:border-teal-500/50 hover:bg-slate-950 transition-all">
            <FileSpreadsheet className="h-8 w-8 text-teal-400 mb-2" />
            <span className="text-xs font-medium text-slate-200">
              {fileName ? fileName : 'Click to select or drop CSV file'}
            </span>
            <span className="text-[11px] text-slate-500 mt-1">
              Supports .csv with student ID, CGPA, attendance, LMS & skills
            </span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Template & Reset Box */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <FileText className="h-4 w-4 text-violet-400" />
              <span>Standard Dataset Templates & Baseline</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Download pre-formatted CSV template with standard college column headers to test data import.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleDownloadTemplate}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-900 hover:text-white transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-teal-400" />
              <span>Download Standard CSV Template</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all dataset to pure synthetic demo data?')) {
                  resetToSyntheticData();
                  setSuccessMessage('Restored to default synthetic 150-student dataset.');
                }
              }}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-rose-500/20 bg-rose-950/20 px-3.5 py-2 text-xs font-medium text-rose-300 hover:bg-rose-950/40 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5 text-rose-400" />
              <span>Reset to Clean Demo Baseline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Validation Summary Card */}
      {importSummary && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white">Validation Summary Report</h2>
              <p className="text-xs text-slate-400">
                Audited {importSummary.total} rows against schema invariants and duplicate IDs.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadReport}
                className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 hover:text-white"
              >
                Download Validation Report
              </button>
              <button
                disabled={importSummary.valid === 0}
                onClick={handleApplyImport}
                className="rounded-lg bg-teal-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal-400"
              >
                Apply {importSummary.valid} Valid Records
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
              <span className="text-[11px] text-slate-400">Total Rows</span>
              <div className="font-mono text-xl font-bold text-white tabular-nums mt-0.5">
                {importSummary.total}
              </div>
            </div>
            <div className="rounded-lg border border-teal-500/20 bg-teal-950/20 p-3">
              <span className="text-[11px] text-teal-400">Valid / Ready</span>
              <div className="font-mono text-xl font-bold text-teal-300 tabular-nums mt-0.5">
                {importSummary.valid}
              </div>
            </div>
            <div className="rounded-lg border border-amber-500/20 bg-amber-950/20 p-3">
              <span className="text-[11px] text-amber-400">Existing Duplicates</span>
              <div className="font-mono text-xl font-bold text-amber-300 tabular-nums mt-0.5">
                {importSummary.duplicates}
              </div>
            </div>
            <div className="rounded-lg border border-rose-500/20 bg-rose-950/20 p-3">
              <span className="text-[11px] text-rose-400">Format Errors</span>
              <div className="font-mono text-xl font-bold text-rose-300 tabular-nums mt-0.5">
                {importSummary.errors}
              </div>
            </div>
          </div>

          {/* Table Preview */}
          <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <tr>
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3 text-right">CGPA</th>
                  <th className="py-2.5 px-3 text-right">Attendance</th>
                  <th className="py-2.5 px-3 text-right">Coding</th>
                  <th className="py-2.5 px-3">Validation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {parsedRows.slice(0, 10).map((r, i) => (
                  <tr key={i} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-3 text-teal-400">{r.id}</td>
                    <td className="py-2.5 px-3 font-sans text-white">{r.name}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-300">{r.department}</td>
                    <td className="py-2.5 px-3 text-right text-slate-200">{r.cgpa}</td>
                    <td className="py-2.5 px-3 text-right text-slate-200">{r.attendance}%</td>
                    <td className="py-2.5 px-3 text-right text-slate-200">{r.codingScore}</td>
                    <td className="py-2.5 px-3 font-sans">
                      {r.isValid ? (
                        <span className="text-teal-400 font-semibold text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Valid
                        </span>
                      ) : r.isDuplicate ? (
                        <span className="text-amber-400 text-[11px]">Duplicate ID</span>
                      ) : (
                        <span className="text-rose-400 text-[11px]">{r.errors.join(', ')}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
