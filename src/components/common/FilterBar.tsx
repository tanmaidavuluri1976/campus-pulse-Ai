import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FilterBar: React.FC = () => {
  const { filters, setFilters, resetFilters, filteredStudents, allStudentsCount } = useApp();

  const isFiltered =
    filters.department !== 'All' ||
    filters.year !== 'All' ||
    filters.semester !== 'All' ||
    filters.riskCategory !== 'All' ||
    filters.segment !== 'All' ||
    filters.searchQuery !== '';

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by student name, ID (e.g. STU-2025-COM), or roll number..."
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full rounded-lg border border-slate-800 bg-slate-950/80 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter count indicator & Reset */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <span>Showing</span>
            <span className="font-mono font-medium text-white tabular-nums">
              {filteredStudents.length}
            </span>
            <span>of {allStudentsCount}</span>
          </div>

          {isFiltered && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <X className="h-3 w-3" />
              <span>Clear filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Dropdown Filters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1">
        {/* Department */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Department
          </label>
          <select
            value={filters.department}
            onChange={(e) => setFilters((prev) => ({ ...prev, department: e.target.value }))}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:border-teal-500 focus:outline-none"
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

        {/* Academic Year */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Academic Year
          </label>
          <select
            value={filters.year}
            onChange={(e) => setFilters((prev) => ({ ...prev, year: e.target.value }))}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:border-teal-500 focus:outline-none"
          >
            <option value="All">All Years</option>
            <option value="1">Year 1 (Freshman)</option>
            <option value="2">Year 2 (Sophomore)</option>
            <option value="3">Year 3 (Pre-Final)</option>
            <option value="4">Year 4 (Final Year)</option>
          </select>
        </div>

        {/* Semester */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Semester
          </label>
          <select
            value={filters.semester}
            onChange={(e) => setFilters((prev) => ({ ...prev, semester: e.target.value }))}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:border-teal-500 focus:outline-none"
          >
            <option value="All">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s.toString()}>
                Semester {s}
              </option>
            ))}
          </select>
        </div>

        {/* Risk Category */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Risk Classification
          </label>
          <select
            value={filters.riskCategory}
            onChange={(e) => setFilters((prev) => ({ ...prev, riskCategory: e.target.value }))}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:border-teal-500 focus:outline-none"
          >
            <option value="All">All Risk Levels</option>
            <option value="Academic High">Academic High Risk</option>
            <option value="Placement High">Placement High Risk</option>
            <option value="Overall High">Overall Critical</option>
            <option value="Medium">Medium Watchlist</option>
            <option value="Low">Low / On Track</option>
          </select>
        </div>

        {/* Segment */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Behavioral Segment
          </label>
          <select
            value={filters.segment}
            onChange={(e) => setFilters((prev) => ({ ...prev, segment: e.target.value }))}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:border-teal-500 focus:outline-none"
          >
            <option value="All">All Segments</option>
            <option value="Academic Critical">Academic Critical</option>
            <option value="Placement Gaps">Placement Gaps</option>
            <option value="Interview Bottleneck">Interview Bottleneck</option>
            <option value="Placement Ready">Placement Ready</option>
            <option value="Disengaged High-Potential">Disengaged High-Potential</option>
            <option value="Consistent Achiever">Consistent Achiever</option>
            <option value="Data Insufficient">Data Insufficient</option>
          </select>
        </div>
      </div>
    </div>
  );
};
