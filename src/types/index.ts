export type Department = 
  | 'Computer Science' 
  | 'Information Technology' 
  | 'Electronics & Comm' 
  | 'Mechanical Eng' 
  | 'Civil Eng' 
  | 'Data Science & AI';

export type RiskLevel = 'High' | 'Medium' | 'Low';

export type StudentSegment = 
  | 'Academic Critical' 
  | 'Placement Gaps' 
  | 'Interview Bottleneck' 
  | 'Placement Ready' 
  | 'Disengaged High-Potential' 
  | 'Consistent Achiever' 
  | 'Data Insufficient';

export interface HistoricalSemester {
  semester: number;
  cgpa: number;
  attendance: number;
  lmsEngagement: number;
  internalMarks: number;
}

export interface Student {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  department: Department;
  year: number; // 1, 2, 3, 4
  semester: number; // 1-8
  rollNumber: string;
  email: string;
  
  // Academic Performance (0 - 10)
  cgpa: number;
  previousSemGpa: number;
  internalAssessmentScore: number; // 0 - 100
  backlogsCount: number;
  
  // Attendance (0 - 100%)
  attendance: number;
  labAttendance: number;
  subjectAttendance: {
    subject: string;
    percentage: number;
  }[];
  
  // LMS Engagement
  lmsLoginCountMonthly: number; // e.g. 5 - 60
  lmsAvgHoursWeekly: number; // e.g. 1 - 25
  assignmentCompletionRate: number; // 0 - 100%
  forumInteractionsCount: number;
  
  // Extra-curricular & Skill Development
  eventsParticipated: number;
  certificationsCompleted: number;
  
  // Placement Readiness metrics (0 - 100)
  aptitudeScore: number;
  codingScore: number;
  mockInterviewScore: number;
  technicalSkillScore: number;
  communicationSkillScore: number;
  placementParticipation: boolean;
  resumeScore: number; // 0 - 100
  
  // Feedback
  studentFeedbackRating: number; // 1 - 5
  facultyFeedbackScore: number; // 1 - 5
  
  // Data metadata
  missingFields: string[];
  historicalTrends: HistoricalSemester[];
  isSynthetic: boolean;
  isImported?: boolean;
}

export interface FactorAttribution {
  factor: string;
  category: 'Academic' | 'Attendance' | 'LMS' | 'Assessment' | 'Skills' | 'Placement';
  impactValue: number; // percentage or weighted contribution
  explanation: string;
  isPositive: boolean;
}

export interface ScoredStudent extends Student {
  successScore: number; // 0 - 100
  placementScore: number; // 0 - 100
  academicRisk: RiskLevel;
  placementRisk: RiskLevel;
  overallRisk: RiskLevel;
  segment: StudentSegment;
  dataQuality: number; // 0 - 100%
  topPositiveFactors: FactorAttribution[];
  topNegativeFactors: FactorAttribution[];
  suggestedInterventions: string[];
}

export type InterventionType = 
  | 'Attendance Mentoring'
  | 'Subject Tutoring'
  | 'Assignment Recovery'
  | 'Coding Practice'
  | 'Aptitude Training'
  | 'Mock Interviews'
  | 'Communication Coaching'
  | 'Certification Programs';

export type InterventionStatus = 'Recommended' | 'Accepted' | 'In Progress' | 'Completed' | 'Dismissed';

export interface Intervention {
  id: string;
  studentId: string;
  studentName: string;
  department: Department;
  type: InterventionType;
  category: 'Academic' | 'Placement' | 'Engagement';
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  estimatedHours: number;
  assignedFaculty: string;
  status: InterventionStatus;
  createdAt: string;
  followUpDate: string;
  targetMetric: string;
  intendedOutcome: string;
  beforeMetrics: {
    successScore: number;
    placementScore: number;
    attendance: number;
    cgpa: number;
    codingScore?: number;
    mockInterviewScore?: number;
  };
  afterMetrics?: {
    successScore: number;
    placementScore: number;
    attendance: number;
    cgpa: number;
    codingScore?: number;
    mockInterviewScore?: number;
  };
  notes?: string;
}

export interface SuccessScoreWeights {
  academic: number;      // default 30
  attendance: number;    // default 20
  lms: number;           // default 15
  assessment: number;    // default 15
  skills: number;        // default 10
  participation: number; // default 10
}

export interface PlacementScoreWeights {
  aptitude: number;      // default 20
  coding: number;        // default 25
  mockInterview: number; // default 25
  technical: number;     // default 15
  communication: number; // default 15
}

export interface RiskThresholds {
  academicHighCutoff: number;   // < 50 => High
  academicMediumCutoff: number; // 50 - 70 => Medium, >70 => Low
  placementHighCutoff: number;  // < 50 => High
  placementMediumCutoff: number;// 50 - 75 => Medium, >75 => Low
}

export interface SystemSettings {
  successWeights: SuccessScoreWeights;
  placementWeights: PlacementScoreWeights;
  thresholds: RiskThresholds;
  totalFacultyHoursBudget: number; // default 150 hours
  academicYear: string;
}

export interface FilterState {
  department: string;
  year: string;
  semester: string;
  riskCategory: string;
  segment: string;
  searchQuery: string;
}
