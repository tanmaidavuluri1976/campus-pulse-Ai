import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Save,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEFAULT_SETTINGS } from '../utils/scoring';

export const Settings: React.FC = () => {
  const { settings, updateSettings, resetSettings, resetToSyntheticData } = useApp();

  const [localSettings, setLocalSettings] = useState(settings);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  // Success weights sum validation
  const totalSuccessWeight =
    localSettings.successWeights.academic +
    localSettings.successWeights.attendance +
    localSettings.successWeights.lms +
    localSettings.successWeights.assessment +
    localSettings.successWeights.skills +
    localSettings.successWeights.participation;

  // Placement weights sum validation
  const totalPlacementWeight =
    localSettings.placementWeights.aptitude +
    localSettings.placementWeights.coding +
    localSettings.placementWeights.mockInterview +
    localSettings.placementWeights.technical +
    localSettings.placementWeights.communication;

  const handleSave = () => {
    updateSettings(localSettings);
    setSaveNotice('Settings successfully applied! All student composite scores and risks updated in real-time.');
    setTimeout(() => setSaveNotice(null), 4000);
  };

  const handleResetDefaults = () => {
    resetSettings();
    setLocalSettings(DEFAULT_SETTINGS);
    setSaveNotice('Reset to official KPMG Smart Campus Analytics baseline weights.');
    setTimeout(() => setSaveNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold">
            <SettingsIcon className="h-4 w-4" />
            <span>Institutional Calibration & Algorithm Weights</span>
          </div>
          <span className="font-mono text-xs text-slate-400">
            Real-Time Reactive Pipeline
          </span>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white">
          System Scoring Configuration & Thresholds
        </h1>

        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          Calibrate the relative weights of the Student Success Score and Placement Readiness Index to reflect your campus grading policy and institutional priorities. Changes immediately re-compute scores across all dashboards.
        </p>
      </div>

      {saveNotice && (
        <div className="rounded-xl border border-teal-500/30 bg-teal-950/40 p-4 flex items-center justify-between text-xs text-teal-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-teal-400" />
            <span>{saveNotice}</span>
          </div>
          <button onClick={() => setSaveNotice(null)} className="text-slate-400 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* 1. Student Success Score Weights */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white">Student Success Score Weights</h2>
            <p className="text-xs text-slate-400">Composite index measuring overall student academic & campus wellness.</p>
          </div>
          <span
            className={`font-mono text-xs font-bold tabular-nums ${
              totalSuccessWeight === 100 ? 'text-teal-400' : 'text-rose-400'
            }`}
          >
            Total: {totalSuccessWeight}% / 100%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Academic */}
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-2">
            <div className="flex justify-between font-medium">
              <span className="text-slate-300">Academic Performance</span>
              <span className="font-mono text-teal-400">{localSettings.successWeights.academic}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              value={localSettings.successWeights.academic}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  successWeights: { ...prev.successWeights, academic: parseInt(e.target.value) },
                }))
              }
              className="w-full accent-teal-400"
            />
            <span className="text-[10px] text-slate-500 block">CGPA normalized (0-10 scale) & backlog factor</span>
          </div>

          {/* Attendance */}
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-2">
            <div className="flex justify-between font-medium">
              <span className="text-slate-300">Class Attendance</span>
              <span className="font-mono text-teal-400">{localSettings.successWeights.attendance}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={40}
              value={localSettings.successWeights.attendance}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  successWeights: { ...prev.successWeights, attendance: parseInt(e.target.value) },
                }))
              }
              className="w-full accent-teal-400"
            />
            <span className="text-[10px] text-slate-500 block">Classroom & laboratory presence logs</span>
          </div>

          {/* LMS Engagement */}
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-2">
            <div className="flex justify-between font-medium">
              <span className="text-slate-300">LMS Portal Engagement</span>
              <span className="font-mono text-teal-400">{localSettings.successWeights.lms}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              value={localSettings.successWeights.lms}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  successWeights: { ...prev.successWeights, lms: parseInt(e.target.value) },
                }))
              }
              className="w-full accent-teal-400"
            />
            <span className="text-[10px] text-slate-500 block">Portal logins, hours, and digital coursework</span>
          </div>

          {/* Assessment Consistency */}
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-2">
            <div className="flex justify-between font-medium">
              <span className="text-slate-300">Assessment Consistency</span>
              <span className="font-mono text-teal-400">{localSettings.successWeights.assessment}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              value={localSettings.successWeights.assessment}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  successWeights: { ...prev.successWeights, assessment: parseInt(e.target.value) },
                }))
              }
              className="w-full accent-teal-400"
            />
            <span className="text-[10px] text-slate-500 block">Internal midterm marks and consistency</span>
          </div>

          {/* Skill Development */}
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-2">
            <div className="flex justify-between font-medium">
              <span className="text-slate-300">Skill Development</span>
              <span className="font-mono text-teal-400">{localSettings.successWeights.skills}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={25}
              value={localSettings.successWeights.skills}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  successWeights: { ...prev.successWeights, skills: parseInt(e.target.value) },
                }))
              }
              className="w-full accent-teal-400"
            />
            <span className="text-[10px] text-slate-500 block">Certifications and hands-on laboratory tech skills</span>
          </div>

          {/* Participation & Feedback */}
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-2">
            <div className="flex justify-between font-medium">
              <span className="text-slate-300">Campus Participation</span>
              <span className="font-mono text-teal-400">{localSettings.successWeights.participation}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={25}
              value={localSettings.successWeights.participation}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  successWeights: { ...prev.successWeights, participation: parseInt(e.target.value) },
                }))
              }
              className="w-full accent-teal-400"
            />
            <span className="text-[10px] text-slate-500 block">Events, clubs, and mentor feedback scores</span>
          </div>
        </div>
      </div>

      {/* 2. Placement Readiness Weights */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white">Placement Readiness Weights</h2>
            <p className="text-xs text-slate-400">Relative weighting of pre-recruitment benchmarks.</p>
          </div>
          <span
            className={`font-mono text-xs font-bold tabular-nums ${
              totalPlacementWeight === 100 ? 'text-violet-400' : 'text-rose-400'
            }`}
          >
            Total: {totalPlacementWeight}% / 100%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-2">
            <div className="flex justify-between font-medium">
              <span className="text-slate-300">Aptitude</span>
              <span className="font-mono text-violet-400">{localSettings.placementWeights.aptitude}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={40}
              value={localSettings.placementWeights.aptitude}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  placementWeights: { ...prev.placementWeights, aptitude: parseInt(e.target.value) },
                }))
              }
              className="w-full accent-violet-400"
            />
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-2">
            <div className="flex justify-between font-medium">
              <span className="text-slate-300">Coding (DSA)</span>
              <span className="font-mono text-violet-400">{localSettings.placementWeights.coding}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={45}
              value={localSettings.placementWeights.coding}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  placementWeights: { ...prev.placementWeights, coding: parseInt(e.target.value) },
                }))
              }
              className="w-full accent-violet-400"
            />
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-2">
            <div className="flex justify-between font-medium">
              <span className="text-slate-300">Mock Interview</span>
              <span className="font-mono text-violet-400">{localSettings.placementWeights.mockInterview}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={45}
              value={localSettings.placementWeights.mockInterview}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  placementWeights: { ...prev.placementWeights, mockInterview: parseInt(e.target.value) },
                }))
              }
              className="w-full accent-violet-400"
            />
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-2">
            <div className="flex justify-between font-medium">
              <span className="text-slate-300">Tech Skill</span>
              <span className="font-mono text-violet-400">{localSettings.placementWeights.technical}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={30}
              value={localSettings.placementWeights.technical}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  placementWeights: { ...prev.placementWeights, technical: parseInt(e.target.value) },
                }))
              }
              className="w-full accent-violet-400"
            />
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-2">
            <div className="flex justify-between font-medium">
              <span className="text-slate-300">Communication</span>
              <span className="font-mono text-violet-400">{localSettings.placementWeights.communication}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={30}
              value={localSettings.placementWeights.communication}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  placementWeights: { ...prev.placementWeights, communication: parseInt(e.target.value) },
                }))
              }
              className="w-full accent-violet-400"
            />
          </div>
        </div>
      </div>

      {/* 3. Risk Threshold Cutoffs */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
        <h2 className="text-sm font-bold text-white">Risk Classification Thresholds</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-1.5">
            <span className="text-slate-300 font-medium">Academic High Risk Cutoff</span>
            <input
              type="number"
              value={localSettings.thresholds.academicHighCutoff}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  thresholds: { ...prev.thresholds, academicHighCutoff: parseInt(e.target.value) || 50 },
                }))
              }
              className="w-full rounded border border-slate-800 bg-slate-900 px-2 py-1 text-xs text-white font-mono"
            />
            <span className="text-[10px] text-slate-500">Scores below this trigger Critical Alert</span>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-1.5">
            <span className="text-slate-300 font-medium">Academic Medium Risk Cutoff</span>
            <input
              type="number"
              value={localSettings.thresholds.academicMediumCutoff}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  thresholds: { ...prev.thresholds, academicMediumCutoff: parseInt(e.target.value) || 70 },
                }))
              }
              className="w-full rounded border border-slate-800 bg-slate-900 px-2 py-1 text-xs text-white font-mono"
            />
            <span className="text-[10px] text-slate-500">Scores between High and Medium form Watchlist</span>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-1.5">
            <span className="text-slate-300 font-medium">Placement High Risk Cutoff</span>
            <input
              type="number"
              value={localSettings.thresholds.placementHighCutoff}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  thresholds: { ...prev.thresholds, placementHighCutoff: parseInt(e.target.value) || 50 },
                }))
              }
              className="w-full rounded border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-white font-mono"
            />
            <span className="text-[10px] text-slate-500">Pre-placement disqualification warning</span>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-1.5">
            <span className="text-slate-300 font-medium">Placement Medium Cutoff</span>
            <input
              type="number"
              value={localSettings.thresholds.placementMediumCutoff}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  thresholds: { ...prev.thresholds, placementMediumCutoff: parseInt(e.target.value) || 75 },
                }))
              }
              className="w-full rounded border border-slate-800 bg-slate-900 px-2 py-1 text-xs text-white font-mono"
            />
            <span className="text-[10px] text-slate-500">Tier-1 campus recruitment threshold</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <button
          onClick={handleResetDefaults}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Restore Default Coefficients</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm('Reset all demo student records and interventions?')) {
                resetToSyntheticData();
                setSaveNotice('Synthetic demo dataset cleanly restored.');
              }
            }}
            className="rounded-lg border border-rose-500/20 bg-rose-950/20 px-3 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-950/40"
          >
            Hard Reset Demo Data
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-lg bg-teal-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:bg-teal-400 transition-colors"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Apply Calibration</span>
          </button>
        </div>
      </div>
    </div>
  );
};
