import React, { useState, useMemo } from 'react';
import {
  Users,
  ArrowUpDown,
  Download,
  Eye,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FilterBar } from '../components/common/FilterBar';
import { RiskBadge } from '../components/common/RiskBadge';
import { ScoredStudent } from '../types';

type SortField =
  | 'id'
  | 'name'
  | 'department'
  | 'cgpa'
  | 'attendance'
  | 'successScore'
  | 'placementScore'
  | 'academicRisk'
  | 'placementRisk';

export const StudentExplorer: React.FC = () => {
  const { filteredStudents, setSelectedStudentId, setActiveTab } = useApp();

  const [sortField, setSortField] = useState<SortField>('successScore');
  const [sortAsc, setSortAsc] = useState<boolean>(true); // default lowest score first for triage
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 15;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === 'name' || field === 'id');
    }
  };

  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredStudents, sortField, sortAsc]);

  const totalPages = Math.ceil(sortedStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedStudents.slice(start, start + pageSize);
  }, [sortedStudents, currentPage, pageSize]);

  // Download filtered data as CSV
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Name',
      'Department',
      'Year',
      'Semester',
      'CGPA',
      'Attendance%',
      'Success_Score',
      'Placement_Score',
      'Academic_Risk',
      'Placement_Risk',
      'Segment',
    ];
    const rows = sortedStudents.map((s) => [
      s.id,
      `"${s.name}"`,
      `"${s.department}"`,
      s.year,
      s.semester,
      s.cgpa,
      s.attendance,
      s.successScore,
      s.placementScore,
      s.academicRisk,
      s.placementRisk,
      `"${s.segment}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `campus_pulse_cohort_export_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Student Explorer & Cohorts</h1>
          <p className="text-xs text-slate-400">
            Search, sort, filter, and inspect detailed diagnostic dossiers for all students.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors self-start sm:self-auto"
        >
          <Download className="h-3.5 w-3.5 text-teal-400" />
          <span>Export Filtered CSV</span>
        </button>
      </div>

      {/* Filter Component */}
      <FilterBar />

      {/* Table Container */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-slate-400">
              <tr>
                <th
                  onClick={() => handleSort('id')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Student ID</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Name</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('department')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Department</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('cgpa')}
                  className="py-3 px-4 text-right font-semibold cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>CGPA</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('attendance')}
                  className="py-3 px-4 text-right font-semibold cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Attendance</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('successScore')}
                  className="py-3 px-4 text-right font-semibold cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Success Score</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('placementScore')}
                  className="py-3 px-4 text-right font-semibold cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Placement</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('academicRisk')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-white text-center"
                >
                  <span>Academic Risk</span>
                </th>
                <th
                  onClick={() => handleSort('placementRisk')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-white text-center"
                >
                  <span>Placement Risk</span>
                </th>
                <th className="py-3 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    No students match the current filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((stu) => (
                  <tr
                    key={stu.id}
                    onClick={() => setSelectedStudentId(stu.id)}
                    className="cursor-pointer hover:bg-slate-900/80 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-[11px] font-medium text-teal-400">
                      {stu.id}
                    </td>
                    <td className="py-3 px-4 font-medium text-white">
                      <div>{stu.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Y{stu.year} · Sem {stu.semester}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <span className="truncate max-w-[150px] inline-block">{stu.department}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-200">
                      {stu.cgpa.toFixed(2)}
                      {stu.backlogsCount > 0 && (
                        <span className="ml-1 text-[10px] text-rose-400">({stu.backlogsCount} b)</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      <span className={stu.attendance < 75 ? 'text-rose-400 font-semibold' : 'text-slate-200'}>
                        {stu.attendance}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold tabular-nums">
                      <span
                        className={
                          stu.successScore < 55
                            ? 'text-rose-400'
                            : stu.successScore < 72
                            ? 'text-amber-400'
                            : 'text-teal-400'
                        }
                      >
                        {stu.successScore}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold tabular-nums">
                      <span
                        className={
                          stu.placementScore < 50
                            ? 'text-rose-400'
                            : stu.placementScore < 75
                            ? 'text-amber-400'
                            : 'text-violet-400'
                        }
                      >
                        {stu.placementScore}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <RiskBadge level={stu.academicRisk} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <RiskBadge level={stu.placementRisk} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedStudentId(stu.id)}
                        className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                        title="View Full Dossier"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/60 px-4 py-3 text-xs text-slate-400">
          <div>
            Showing <span className="font-mono text-white">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-mono text-white">
              {Math.min(currentPage * pageSize, sortedStudents.length)}
            </span>{' '}
            of <span className="font-mono text-white">{sortedStudents.length}</span> students
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded border border-slate-800 bg-slate-900 px-2.5 py-1 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="font-mono text-slate-200">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="rounded border border-slate-800 bg-slate-900 px-2.5 py-1 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
