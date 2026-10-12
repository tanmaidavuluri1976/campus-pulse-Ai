import React from 'react';
import {
  LayoutDashboard,
  Users,
  BrainCircuit,
  FlaskConical,
  SlidersHorizontal,
  BotMessageSquare,
  Database,
  Award,
  Settings,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'command-center', label: 'Command Center', icon: LayoutDashboard },
  { id: 'student-explorer', label: 'Student Explorer', icon: Users },
  { id: 'predictive-intelligence', label: 'Predictive Intelligence', icon: BrainCircuit },
  { id: 'intervention-lab', label: 'Intervention Lab', icon: FlaskConical, badge: 'What-If' },
  { id: 'resource-optimizer', label: 'Resource Optimizer', icon: SlidersHorizontal },
  { id: 'campus-analyst', label: 'AI Campus Analyst', icon: BotMessageSquare },
  { id: 'data-integration', label: 'Data Integration Hub', icon: Database },
  { id: 'outcomes-impact', label: 'Outcomes & Impact', icon: Award },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<{ isOpen: boolean; onCloseMobile: () => void }> = ({
  isOpen,
  onCloseMobile,
}) => {
  const { activeTab, setActiveTab, students, interventions } = useApp();

  // Quick live counts
  const highRiskCount = students.filter((s) => s.overallRisk === 'High').length;
  const activeInterventionsCount = interventions.filter(
    (i) => i.status === 'In Progress' || i.status === 'Accepted'
  ).length;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800/80 bg-slate-950 transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Area */}
        <div className="flex flex-col border-b border-slate-800/80 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-white text-base">
                CAMPUS PULSE AI
              </span>
              <span className="text-[11px] text-slate-400 tracking-wider font-medium">
                Predict · Explain · Simulate · Improve
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>KPMG Campus Analytics</span>
            <span aria-hidden="true">·</span>
            <span>Hackathon 2026</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400">
            Analytics & Operations
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onCloseMobile();
                }}
                className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="rounded bg-teal-500/20 px-1.5 py-0.5 text-[10px] font-medium text-teal-300">
                    {item.badge}
                  </span>
                ) : item.id === 'command-center' && highRiskCount > 0 ? (
                  <span className="font-mono text-[11px] text-amber-400">
                    {highRiskCount} alert
                  </span>
                ) : item.id === 'outcomes-impact' && activeInterventionsCount > 0 ? (
                  <span className="font-mono text-[11px] text-teal-400">
                    {activeInterventionsCount} active
                  </span>
                ) : (
                  <ChevronRight
                    className={`h-3.5 w-3.5 text-slate-600 transition-transform ${
                      isActive ? 'text-teal-400 translate-x-0.5' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* System & Privacy Footer */}
        <div className="border-t border-slate-800/80 p-4 space-y-2 bg-slate-950/60">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-teal-400 shrink-0" />
            <span>Deterministic Local Engine</span>
          </div>
          <div className="text-[11px] text-slate-500 leading-relaxed">
            Data evaluated client-side. No remote API keys or third-party telemetry required.
          </div>
        </div>
      </aside>
    </>
  );
};
