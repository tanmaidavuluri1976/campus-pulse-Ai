import React from 'react';
import { Menu, RotateCcw, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  'command-center': { title: 'Command Center', subtitle: 'Institutional Performance & Executive Intelligence' },
  'student-explorer': { title: 'Student Explorer', subtitle: 'Searchable Cohort Directory & Digital Student Dossiers' },
  'predictive-intelligence': { title: 'Predictive Intelligence', subtitle: 'Early-Warning Signals & Behavioral Segmentation' },
  'intervention-lab': { title: 'Intervention Lab', subtitle: 'What-If Simulation Engine & Multi-Scenario Modeling' },
  'resource-optimizer': { title: 'Resource Optimizer', subtitle: 'Capacity-Constrained Faculty Allocation & Action Queue' },
  'campus-analyst': { title: 'AI Campus Analyst', subtitle: 'Natural Language Rule-Based Analytics & Query Engine' },
  'data-integration': { title: 'Data Integration Hub', subtitle: 'CSV Importer, Schema Validation & Student Linkage' },
  'outcomes-impact': { title: 'Outcomes & Impact', subtitle: 'Longitudinal Action Tracking & Observed Metric Progress' },
  'settings': { title: 'Settings & Weights', subtitle: 'Score Coefficients, Risk Thresholds & System Calibration' },
};

export const Header: React.FC<{ onOpenMobileNav: () => void }> = ({ onOpenMobileNav }) => {
  const { activeTab, allStudentsCount, filteredStudents, resetToSyntheticData, settings } = useApp();
  const currentTabInfo = TAB_TITLES[activeTab] || { title: 'Dashboard', subtitle: '' };

  const handleReset = () => {
    if (window.confirm('Reset all demo student records and interventions to default synthetic baseline?')) {
      resetToSyntheticData();
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/90 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile Menu + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Campus Pulse AI</span>
            <span aria-hidden="true">/</span>
            <span className="font-medium text-teal-400">{currentTabInfo.title}</span>
          </div>
          <span className="text-sm font-semibold text-white truncate max-w-[240px] sm:max-w-md">
            {currentTabInfo.subtitle}
          </span>
        </div>
      </div>

      {/* Right: Quick Context & Actions */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="text-slate-300 font-mono tabular-nums">
            {filteredStudents.length} of {allStudentsCount}
          </span>
          <span className="text-slate-500">Students Active</span>
          <span className="h-3 w-px bg-slate-700 mx-1" />
          <span className="text-teal-400 font-mono tabular-nums">{settings.totalFacultyHoursBudget}h</span>
          <span className="text-slate-500">Faculty Cap</span>
        </div>

        <button
          onClick={handleReset}
          title="Reset to clean synthetic demonstration data"
          className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
          <span className="hidden sm:inline">Reset Demo</span>
        </button>
      </div>
    </header>
  );
};
