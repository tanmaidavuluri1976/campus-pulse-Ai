import { Student, Department } from '../types';

const FIRST_NAMES = [
  'Aarav', 'Ananya', 'Rohan', 'Priya', 'Aditya', 'Diya', 'Vihaan', 'Sneha',
  'Arjun', 'Isha', 'Kabir', 'Rhea', 'Rahul', 'Meera', 'Kunal', 'Pooja',
  'Siddharth', 'Tanvi', 'Aryan', 'Neha', 'Varun', 'Kavya', 'Gautam', 'Shreya',
  'Harsh', 'Anushka', 'Manish', 'Kritika', 'Nikhil', 'Divya', 'Sameer', 'Rashmi',
  'Ayush', 'Simran', 'Dev', 'Aditi', 'Pranav', 'Nandini', 'Vikram', 'Bhavna'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Iyer', 'Menon', 'Reddy', 'Chopra', 'Kapoor',
  'Nair', 'Singh', 'Deshmukh', 'Bose', 'Chatterjee', 'Gupta', 'Mehta', 'Joshi',
  'Rao', 'Bhat', 'Kulkarni', 'Malhotra', 'Aggarwal', 'Choudhury', 'Pandey', 'Saxena'
];

const DEPARTMENTS: Department[] = [
  'Computer Science',
  'Information Technology',
  'Electronics & Comm',
  'Data Science & AI',
  'Mechanical Eng',
  'Civil Eng',
];

const SUBJECT_LIST: Record<Department, string[]> = {
  'Computer Science': ['Algorithms & DS', 'Operating Systems', 'Database Systems', 'Computer Networks', 'Automata Theory'],
  'Information Technology': ['Web Technologies', 'Cloud Architecture', 'Information Security', 'Software Testing', 'Data Warehousing'],
  'Electronics & Comm': ['Digital Signal Proc', 'VLSI Design', 'Microcontrollers', 'Embedded Systems', 'Analog Circuits'],
  'Data Science & AI': ['Machine Learning', 'Deep Neural Nets', 'Applied Statistics', 'Big Data Engineering', 'Computer Vision'],
  'Mechanical Eng': ['Thermodynamics', 'Fluid Mechanics', 'Machine Design', 'Robotics & Automation', 'Manufacturing Tech'],
  'Civil Eng': ['Structural Analysis', 'Geotechnical Eng', 'Transportation Eng', 'Hydraulics', 'Surveying & GIS'],
};

// Simple deterministic pseudorandom number generator for reproducible synthetic data
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function generateSyntheticStudents(): Student[] {
  const students: Student[] = [];
  const TOTAL_STUDENTS = 150;

  for (let i = 1; i <= TOTAL_STUDENTS; i++) {
    const seed = i * 42.195;
    const r1 = pseudoRandom(seed);
    const r2 = pseudoRandom(seed + 1);
    const r3 = pseudoRandom(seed + 2);
    const r4 = pseudoRandom(seed + 3);
    const r5 = pseudoRandom(seed + 4);
    const r6 = pseudoRandom(seed + 5);
    const r7 = pseudoRandom(seed + 6);
    const r8 = pseudoRandom(seed + 7);
    const r9 = pseudoRandom(seed + 8);
    const r10 = pseudoRandom(seed + 9);

    const dept = DEPARTMENTS[i % DEPARTMENTS.length];
    const year = (i % 4) + 1; // 1 to 4
    const semester = (year - 1) * 2 + (i % 2 === 0 ? 2 : 1); // 1 to 8

    const firstName = FIRST_NAMES[(i * 3) % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(i * 7) % LAST_NAMES.length];
    const gender = (i % 2 === 0) ? 'Female' : 'Male';
    const deptPrefix = dept.split(' ')[0].substring(0, 3).toUpperCase();
    const rollNumber = `22${deptPrefix}${String(100 + i).padStart(3, '0')}`;
    const id = `STU-2025-${deptPrefix}-${String(i).padStart(3, '0')}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@campus.edu.in`;

    // Intentional archetypes to fulfill hackathon requirements:
    let cgpa: number;
    let attendance: number;
    let codingScore: number;
    let mockInterviewScore: number;
    let aptitudeScore: number;
    let technicalSkillScore: number;
    let communicationSkillScore: number;
    let internalAssessmentScore: number;
    let backlogsCount = 0;
    let lmsLoginCountMonthly = Math.round(15 + r1 * 35);
    let lmsAvgHoursWeekly = Math.round((3 + r2 * 12) * 10) / 10;
    let assignmentCompletionRate = Math.round(65 + r3 * 35);
    let missingFields: string[] = [];

    if (i % 15 === 0) {
      // Archetype 1: Strong CGPA but Low Placement Readiness (CGPA > 8.5, low interview/aptitude)
      cgpa = Math.round((8.4 + r1 * 1.3) * 100) / 100;
      attendance = Math.round(85 + r2 * 12);
      codingScore = Math.round(45 + r3 * 15);
      mockInterviewScore = Math.round(35 + r4 * 14);
      aptitudeScore = Math.round(42 + r5 * 18);
      technicalSkillScore = Math.round(60 + r6 * 15);
      communicationSkillScore = Math.round(38 + r7 * 15);
      internalAssessmentScore = Math.round(82 + r8 * 14);
    } else if (i % 14 === 0) {
      // Archetype 2: Strong Technical & Coding (>80) but Weak Mock Interview (<45)
      cgpa = Math.round((7.2 + r1 * 1.2) * 100) / 100;
      attendance = Math.round(75 + r2 * 15);
      codingScore = Math.round(84 + r3 * 14);
      mockInterviewScore = Math.round(32 + r4 * 16);
      aptitudeScore = Math.round(70 + r5 * 20);
      technicalSkillScore = Math.round(85 + r6 * 12);
      communicationSkillScore = Math.round(36 + r7 * 14);
      internalAssessmentScore = Math.round(74 + r8 * 16);
    } else if (i % 12 === 0) {
      // Archetype 3: Declining Attendance & Academic Risk (Attendance < 65%, Backlogs > 0)
      cgpa = Math.round((5.1 + r1 * 1.1) * 100) / 100;
      attendance = Math.round(48 + r2 * 18);
      backlogsCount = 1 + (i % 3);
      codingScore = Math.round(35 + r3 * 25);
      mockInterviewScore = Math.round(38 + r4 * 22);
      aptitudeScore = Math.round(40 + r5 * 20);
      technicalSkillScore = Math.round(42 + r6 * 20);
      communicationSkillScore = Math.round(45 + r7 * 20);
      internalAssessmentScore = Math.round(46 + r8 * 18);
      assignmentCompletionRate = Math.round(40 + r9 * 25);
      lmsLoginCountMonthly = Math.round(6 + r1 * 8);
    } else if (i % 19 === 0) {
      // Archetype 4: Missing Data / Data Insufficient
      cgpa = Math.round((6.8 + r1 * 1.5) * 100) / 100;
      attendance = Math.round(72 + r2 * 15);
      codingScore = Math.round(50 + r3 * 20);
      mockInterviewScore = 0;
      aptitudeScore = 0;
      technicalSkillScore = Math.round(55 + r6 * 20);
      communicationSkillScore = 0;
      internalAssessmentScore = Math.round(60 + r8 * 20);
      missingFields = ['mockInterviewScore', 'aptitudeScore', 'communicationSkillScore', 'resumeScore'];
    } else if (i % 7 === 0) {
      // Archetype 5: Placement Ready Star Performers
      cgpa = Math.round((8.6 + r1 * 1.2) * 100) / 100;
      attendance = Math.round(88 + r2 * 10);
      codingScore = Math.round(86 + r3 * 12);
      mockInterviewScore = Math.round(82 + r4 * 16);
      aptitudeScore = Math.round(85 + r5 * 13);
      technicalSkillScore = Math.round(88 + r6 * 10);
      communicationSkillScore = Math.round(84 + r7 * 14);
      internalAssessmentScore = Math.round(88 + r8 * 10);
      assignmentCompletionRate = Math.round(92 + r9 * 7);
    } else {
      // General balanced distribution
      cgpa = Math.round((6.2 + r1 * 2.8) * 100) / 100;
      attendance = Math.round(68 + r2 * 28);
      codingScore = Math.round(45 + r3 * 45);
      mockInterviewScore = Math.round(42 + r4 * 46);
      aptitudeScore = Math.round(48 + r5 * 42);
      technicalSkillScore = Math.round(50 + r6 * 40);
      communicationSkillScore = Math.round(48 + r7 * 42);
      internalAssessmentScore = Math.round(55 + r8 * 38);
      backlogsCount = r9 > 0.85 ? 1 : 0;
    }

    cgpa = Math.min(9.95, Math.max(4.2, cgpa));
    attendance = Math.min(98, Math.max(42, attendance));

    // Multi-subject attendance
    const subjects = SUBJECT_LIST[dept];
    const subjectAttendance = subjects.map((subj, sIdx) => {
      const variation = Math.round((pseudoRandom(seed + sIdx * 3) - 0.5) * 16);
      const sAtt = Math.min(100, Math.max(35, attendance + variation));
      return {
        subject: subj,
        percentage: sAtt,
      };
    });

    // Historical trends for the student up to current semester
    const historicalTrends = [];
    const prevSemGpa = Math.round(Math.min(9.9, Math.max(4.0, cgpa + (r10 - 0.5) * 0.8)) * 100) / 100;
    for (let sem = 1; sem <= semester; sem++) {
      const semProgression = (sem / semester);
      historicalTrends.push({
        semester: sem,
        cgpa: Math.round(Math.min(9.9, Math.max(4.5, prevSemGpa - (1 - semProgression) * 0.4 + (pseudoRandom(seed + sem * 7) - 0.45) * 0.5)) * 100) / 100,
        attendance: Math.round(Math.min(98, Math.max(45, attendance + (pseudoRandom(seed + sem * 11) - 0.4) * 8))),
        lmsEngagement: Math.round(Math.min(98, Math.max(40, assignmentCompletionRate + (pseudoRandom(seed + sem * 13) - 0.5) * 10))),
        internalMarks: Math.round(Math.min(98, Math.max(40, internalAssessmentScore + (pseudoRandom(seed + sem * 17) - 0.4) * 8))),
      });
    }

    students.push({
      id,
      name: `${firstName} ${lastName}`,
      gender,
      department: dept,
      year,
      semester,
      rollNumber,
      email,
      cgpa,
      previousSemGpa: prevSemGpa,
      internalAssessmentScore,
      backlogsCount,
      attendance,
      labAttendance: Math.min(100, Math.max(40, attendance + Math.round((r4 - 0.5) * 8))),
      subjectAttendance,
      lmsLoginCountMonthly,
      lmsAvgHoursWeekly,
      assignmentCompletionRate,
      forumInteractionsCount: Math.round(2 + r5 * 18),
      eventsParticipated: Math.round(r6 * 5),
      certificationsCompleted: Math.round(r7 * 4),
      aptitudeScore,
      codingScore,
      mockInterviewScore,
      technicalSkillScore,
      communicationSkillScore,
      placementParticipation: year >= 3 ? r8 > 0.15 : false,
      resumeScore: Math.round(50 + r9 * 45),
      studentFeedbackRating: Math.round(3 + r10 * 2),
      facultyFeedbackScore: Math.round(3 + r2 * 2),
      missingFields,
      historicalTrends,
      isSynthetic: true,
    });
  }

  return students;
}

export const INITIAL_INTERVENTIONS = [
  {
    id: 'INT-2025-001',
    studentId: 'STU-2025-COM-012',
    studentName: 'Rohan Deshmukh',
    department: 'Computer Science' as Department,
    type: 'Attendance Mentoring' as const,
    category: 'Academic' as const,
    priority: 'Urgent' as const,
    estimatedHours: 8,
    assignedFaculty: 'Dr. Anand Kumar (CSE)',
    status: 'In Progress' as const,
    createdAt: '2025-09-10',
    followUpDate: '2025-10-18',
    targetMetric: 'Attendance +15%, Lab clearance',
    intendedOutcome: 'Remediate sub-50% class attendance and eliminate backlog risk before midterm exams.',
    beforeMetrics: {
      successScore: 48.2,
      placementScore: 42.0,
      attendance: 52,
      cgpa: 5.6,
    },
    afterMetrics: {
      successScore: 54.1,
      placementScore: 44.5,
      attendance: 64,
      cgpa: 5.7,
    },
    notes: 'Student reported personal transit difficulty. Weekly check-ins with academic counselor scheduled.',
  },
  {
    id: 'INT-2025-002',
    studentId: 'STU-2025-INF-014',
    studentName: 'Priya Iyer',
    department: 'Information Technology' as Department,
    type: 'Mock Interviews' as const,
    category: 'Placement' as const,
    priority: 'High' as const,
    estimatedHours: 12,
    assignedFaculty: 'Prof. Sunita Rao (T&P Cell)',
    status: 'In Progress' as const,
    createdAt: '2025-09-15',
    followUpDate: '2025-10-22',
    targetMetric: 'Mock Interview Score >= 75/100',
    intendedOutcome: 'Overcome interview anxiety for tech screening rounds; student exhibits strong DSA fundamentals.',
    beforeMetrics: {
      successScore: 78.5,
      placementScore: 56.4,
      attendance: 84,
      cgpa: 8.1,
      codingScore: 88,
      mockInterviewScore: 36,
    },
    afterMetrics: {
      successScore: 82.0,
      placementScore: 68.2,
      attendance: 85,
      cgpa: 8.1,
      codingScore: 88,
      mockInterviewScore: 62,
    },
    notes: 'Completed 2 out of 4 behavioral rounds. Articulation of system design projects showed marked improvement.',
  },
  {
    id: 'INT-2025-003',
    studentId: 'STU-2025-ELE-015',
    studentName: 'Kabir Verma',
    department: 'Electronics & Comm' as Department,
    type: 'Coding Practice' as const,
    category: 'Placement' as const,
    priority: 'High' as const,
    estimatedHours: 16,
    assignedFaculty: 'Er. Rajesh Kulkarni (ECE)',
    status: 'Accepted' as const,
    createdAt: '2025-09-20',
    followUpDate: '2025-10-25',
    targetMetric: 'Coding Assessment Score >= 65/100',
    intendedOutcome: 'Targeted bootcamp on C++ STL and basic algorithms to qualify for core hardware-software campus drives.',
    beforeMetrics: {
      successScore: 82.1,
      placementScore: 49.3,
      attendance: 88,
      cgpa: 8.45,
      codingScore: 46,
      mockInterviewScore: 40,
    },
    notes: 'Assigned to LeetCode campus study circle cohort 3.',
  },
  {
    id: 'INT-2025-004',
    studentId: 'STU-2025-MEC-024',
    studentName: 'Vihaan Joshi',
    department: 'Mechanical Eng' as Department,
    type: 'Subject Tutoring' as const,
    category: 'Academic' as const,
    priority: 'Urgent' as const,
    estimatedHours: 10,
    assignedFaculty: 'Prof. Harish Nair (Mech)',
    status: 'Completed' as const,
    createdAt: '2025-08-15',
    followUpDate: '2025-09-30',
    targetMetric: 'Internal Marks in Fluid Mechanics >= 60%',
    intendedOutcome: 'Remedial coaching for Midterm 1 topics and numerical problem solving.',
    beforeMetrics: {
      successScore: 51.4,
      placementScore: 48.0,
      attendance: 62,
      cgpa: 5.8,
    },
    afterMetrics: {
      successScore: 66.8,
      placementScore: 52.0,
      attendance: 76,
      cgpa: 6.4,
    },
    notes: 'Remedial coursework cleared successfully. Midterm 2 marks improved from 42% to 68%.',
  },
  {
    id: 'INT-2025-005',
    studentId: 'STU-2025-CIV-036',
    studentName: 'Tanvi Malhotra',
    department: 'Civil Eng' as Department,
    type: 'Assignment Recovery' as const,
    category: 'Engagement' as const,
    priority: 'Medium' as const,
    estimatedHours: 6,
    assignedFaculty: 'Dr. Shalini Gupta (Civil)',
    status: 'Recommended' as const,
    createdAt: '2025-10-01',
    followUpDate: '2025-10-28',
    targetMetric: 'LMS Assignment Completion >= 80%',
    intendedOutcome: 'Catch up on 4 overdue lab project submissions before semester credit lockout.',
    beforeMetrics: {
      successScore: 61.2,
      placementScore: 55.0,
      attendance: 74,
      cgpa: 6.9,
    },
    notes: 'Notification sent to academic proctor and student portal.',
  },
];
