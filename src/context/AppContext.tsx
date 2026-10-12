import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Student,
  ScoredStudent,
  SystemSettings,
  FilterState,
  Intervention,
  Department,
  RiskLevel,
  StudentSegment
} from '../types';
import { generateSyntheticStudents, INITIAL_INTERVENTIONS } from '../data/mockStudents';
import { scoreStudentRecord, DEFAULT_SETTINGS } from '../utils/scoring';

interface AppContextType {
  students: ScoredStudent[];
  allStudentsCount: number;
  filteredStudents: ScoredStudent[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  resetSettings: () => void;
  interventions: Intervention[];
  addIntervention: (intervention: Omit<Intervention, 'id' | 'createdAt'>) => void;
  updateIntervention: (id: string, updates: Partial<Intervention>) => void;
  deleteIntervention: (id: string) => void;
  selectedStudentId: string | null;
  setSelectedStudentId: (id: string | null) => void;
  selectedStudent: ScoredStudent | null;
  importStudents: (newStudents: Student[]) => { imported: number; duplicates: number };
  resetToSyntheticData: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STUDENTS: 'campuspulse_students_v1',
  SETTINGS: 'campuspulse_settings_v1',
  INTERVENTIONS: 'campuspulse_interventions_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<string>('command-center');
  
  // Selected student for quick modal inspection across any page
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Settings
  const [settings, setSettings] = useState<SystemSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved settings, falling back to defaults', e);
    }
    return DEFAULT_SETTINGS;
  });

  // Base raw students
  const [rawStudents, setRawStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved students, re-generating defaults', e);
    }
    return generateSyntheticStudents();
  });

  // Interventions
  const [interventions, setInterventions] = useState<Intervention[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INTERVENTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved interventions', e);
    }
    return INITIAL_INTERVENTIONS;
  });

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    department: 'All',
    year: 'All',
    semester: 'All',
    riskCategory: 'All',
    segment: 'All',
    searchQuery: '',
  });

  // Persist rawStudents, settings, and interventions
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(rawStudents));
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [rawStudents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INTERVENTIONS, JSON.stringify(interventions));
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [interventions]);

  // Compute scored students dynamically when raw data or settings change
  const scoredStudents = useMemo(() => {
    return rawStudents.map((stu) => scoreStudentRecord(stu, settings));
  }, [rawStudents, settings]);

  // Find currently selected student
  const selectedStudent = useMemo(() => {
    if (!selectedStudentId) return null;
    return scoredStudents.find((s) => s.id === selectedStudentId) || null;
  }, [selectedStudentId, scoredStudents]);

  // Filter students based on current filter state
  const filteredStudents = useMemo(() => {
    return scoredStudents.filter((stu) => {
      if (filters.department !== 'All' && stu.department !== filters.department) {
        return false;
      }
      if (filters.year !== 'All' && stu.year.toString() !== filters.year) {
        return false;
      }
      if (filters.semester !== 'All' && stu.semester.toString() !== filters.semester) {
        return false;
      }
      if (filters.riskCategory !== 'All') {
        if (filters.riskCategory === 'Academic High' && stu.academicRisk !== 'High') return false;
        if (filters.riskCategory === 'Placement High' && stu.placementRisk !== 'High') return false;
        if (filters.riskCategory === 'Overall High' && stu.overallRisk !== 'High') return false;
        if (filters.riskCategory === 'Medium' && stu.overallRisk !== 'Medium') return false;
        if (filters.riskCategory === 'Low' && stu.overallRisk !== 'Low') return false;
      }
      if (filters.segment !== 'All' && stu.segment !== filters.segment) {
        return false;
      }
      if (filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = stu.name.toLowerCase().includes(query);
        const matchesId = stu.id.toLowerCase().includes(query);
        const matchesRoll = stu.rollNumber.toLowerCase().includes(query);
        const matchesEmail = stu.email.toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesRoll && !matchesEmail) {
          return false;
        }
      }
      return true;
    });
  }, [scoredStudents, filters]);

  const resetFilters = () => {
    setFilters({
      department: 'All',
      year: 'All',
      semester: 'All',
      riskCategory: 'All',
      segment: 'All',
      searchQuery: '',
    });
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
      successWeights: { ...prev.successWeights, ...(newSettings.successWeights || {}) },
      placementWeights: { ...prev.placementWeights, ...(newSettings.placementWeights || {}) },
      thresholds: { ...prev.thresholds, ...(newSettings.thresholds || {}) },
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const addIntervention = (item: Omit<Intervention, 'id' | 'createdAt'>) => {
    const newId = `INT-${new Date().getFullYear()}-${String(interventions.length + 1).padStart(3, '0')}`;
    const newRecord: Intervention = {
      ...item,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setInterventions((prev) => [newRecord, ...prev]);
  };

  const updateIntervention = (id: string, updates: Partial<Intervention>) => {
    setInterventions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteIntervention = (id: string) => {
    setInterventions((prev) => prev.filter((item) => item.id !== id));
  };

  const importStudents = (importedList: Student[]) => {
    let duplicateCount = 0;
    let addedCount = 0;
    const existingIds = new Set(rawStudents.map((s) => s.id));

    const toAdd: Student[] = [];
    importedList.forEach((stu) => {
      if (existingIds.has(stu.id)) {
        duplicateCount++;
      } else {
        toAdd.push(stu);
        existingIds.add(stu.id);
        addedCount++;
      }
    });

    if (toAdd.length > 0) {
      setRawStudents((prev) => [...toAdd, ...prev]);
    }

    return { imported: addedCount, duplicates: duplicateCount };
  };

  const resetToSyntheticData = () => {
    const fresh = generateSyntheticStudents();
    setRawStudents(fresh);
    setInterventions(INITIAL_INTERVENTIONS);
    setSettings(DEFAULT_SETTINGS);
    resetFilters();
    try {
      localStorage.removeItem(STORAGE_KEYS.STUDENTS);
      localStorage.removeItem(STORAGE_KEYS.INTERVENTIONS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        students: scoredStudents,
        allStudentsCount: scoredStudents.length,
        filteredStudents,
        filters,
        setFilters,
        resetFilters,
        settings,
        updateSettings,
        resetSettings,
        interventions,
        addIntervention,
        updateIntervention,
        deleteIntervention,
        selectedStudentId,
        setSelectedStudentId,
        selectedStudent,
        importStudents,
        resetToSyntheticData,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
