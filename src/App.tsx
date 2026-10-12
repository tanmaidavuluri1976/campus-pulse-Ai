import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CommandCenter } from './pages/CommandCenter';
import { StudentExplorer } from './pages/StudentExplorer';
import { PredictiveIntelligence } from './pages/PredictiveIntelligence';
import { InterventionLab } from './pages/InterventionLab';
import { ResourceOptimizer } from './pages/ResourceOptimizer';
import { CampusAnalyst } from './pages/CampusAnalyst';
import { DataIntegration } from './pages/DataIntegration';
import { OutcomesImpact } from './pages/OutcomesImpact';
import { Settings } from './pages/Settings';
import { StudentProfileModal } from './components/student/StudentProfileModal';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500/20 selection:text-teal-300">
      {/* Persistent Left Sidebar */}
      <Sidebar
        isOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <Header onOpenMobileNav={() => setIsMobileNavOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'command-center' && <CommandCenter />}
          {activeTab === 'student-explorer' && <StudentExplorer />}
          {activeTab === 'predictive-intelligence' && <PredictiveIntelligence />}
          {activeTab === 'intervention-lab' && <InterventionLab />}
          {activeTab === 'resource-optimizer' && <ResourceOptimizer />}
          {activeTab === 'campus-analyst' && <CampusAnalyst />}
          {activeTab === 'data-integration' && <DataIntegration />}
          {activeTab === 'outcomes-impact' && <OutcomesImpact />}
          {activeTab === 'settings' && <Settings />}
        </main>
      </div>

      {/* Global Student Digital Dossier Modal */}
      <StudentProfileModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
