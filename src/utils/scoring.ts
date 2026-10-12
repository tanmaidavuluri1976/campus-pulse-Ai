import {
  Student,
  ScoredStudent,
  SystemSettings,
  RiskLevel,
  StudentSegment,
  FactorAttribution
} from '../types';

export const DEFAULT_SETTINGS: SystemSettings = {
  successWeights: {
    academic: 30,
    attendance: 20,
    lms: 15,
    assessment: 15,
    skills: 10,
    participation: 10,
  },
  placementWeights: {
    aptitude: 20,
    coding: 25,
    mockInterview: 25,
    technical: 15,
    communication: 15,
  },
  thresholds: {
    academicHighCutoff: 55,   // < 55 is High Risk
    academicMediumCutoff: 72, // 55-72 is Medium Risk, > 72 is Low Risk
    placementHighCutoff: 50,  // < 50 is High Placement Risk
    placementMediumCutoff: 75,// 50-75 is Medium Risk, > 75 is Low Risk
  },
  totalFacultyHoursBudget: 120,
  academicYear: '2025-26',
};

/**
 * Calculates Student Success Score (0 - 100)
 */
export function calculateSuccessScore(
  student: Student,
  weights = DEFAULT_SETTINGS.successWeights
): { score: number; componentScores: Record<string, number> } {
  // 1. Academic Performance (0 - 100)
  // CGPA is on 10 pt scale. Deduct 5 pts per active backlog.
  const rawAcademic = Math.min(100, Math.max(0, (student.cgpa * 10) - (student.backlogsCount * 6)));
  
  // 2. Attendance (0 - 100)
  const rawAttendance = Math.min(100, Math.max(0, student.attendance));

  // 3. LMS Engagement (0 - 100)
  // Normalized: assignment rate (50%), login frequency (25%), weekly hours (25%)
  const loginNorm = Math.min(100, (student.lmsLoginCountMonthly / 30) * 100);
  const hoursNorm = Math.min(100, (student.lmsAvgHoursWeekly / 15) * 100);
  const rawLms = Math.min(
    100,
    (student.assignmentCompletionRate * 0.5) + (loginNorm * 0.25) + (hoursNorm * 0.25)
  );

  // 4. Assessment Consistency (0 - 100)
  const assessmentDiffPenalty = Math.abs(student.cgpa * 10 - student.previousSemGpa * 10) > 15 ? 10 : 0;
  const rawAssessment = Math.min(
    100,
    Math.max(0, student.internalAssessmentScore - assessmentDiffPenalty)
  );

  // 5. Skill Development (0 - 100)
  const certBonus = Math.min(30, student.certificationsCompleted * 10);
  const rawSkills = Math.min(100, (student.technicalSkillScore * 0.7) + certBonus);

  // 6. Participation & Feedback (0 - 100)
  const eventsNorm = Math.min(50, student.eventsParticipated * 12.5);
  const feedbackNorm = (student.studentFeedbackRating / 5) * 25 + (student.facultyFeedbackScore / 5) * 25;
  const rawParticipation = Math.min(100, eventsNorm + feedbackNorm);

  const totalWeight =
    weights.academic +
    weights.attendance +
    weights.lms +
    weights.assessment +
    weights.skills +
    weights.participation;

  const weightedScore =
    (rawAcademic * weights.academic +
      rawAttendance * weights.attendance +
      rawLms * weights.lms +
      rawAssessment * weights.assessment +
      rawSkills * weights.skills +
      rawParticipation * weights.participation) /
    totalWeight;

  const finalScore = Math.round(Math.min(100, Math.max(0, weightedScore)) * 10) / 10;

  return {
    score: finalScore,
    componentScores: {
      academic: Math.round(rawAcademic),
      attendance: Math.round(rawAttendance),
      lms: Math.round(rawLms),
      assessment: Math.round(rawAssessment),
      skills: Math.round(rawSkills),
      participation: Math.round(rawParticipation),
    },
  };
}

/**
 * Calculates Placement Readiness Score (0 - 100)
 */
export function calculatePlacementScore(
  student: Student,
  weights = DEFAULT_SETTINGS.placementWeights
): { score: number; componentScores: Record<string, number> } {
  const totalWeight =
    weights.aptitude +
    weights.coding +
    weights.mockInterview +
    weights.technical +
    weights.communication;

  const weighted =
    (student.aptitudeScore * weights.aptitude +
      student.codingScore * weights.coding +
      student.mockInterviewScore * weights.mockInterview +
      student.technicalSkillScore * weights.technical +
      student.communicationSkillScore * weights.communication) /
    totalWeight;

  // If student hasn't registered or opted for placement participation
  const multiplier = student.placementParticipation ? 1.0 : 0.85;
  const finalScore = Math.round(Math.min(100, Math.max(0, weighted * multiplier)) * 10) / 10;

  return {
    score: finalScore,
    componentScores: {
      aptitude: student.aptitudeScore,
      coding: student.codingScore,
      mockInterview: student.mockInterviewScore,
      technical: student.technicalSkillScore,
      communication: student.communicationSkillScore,
    },
  };
}

/**
 * Calculates Data Quality completeness percentage
 */
export function calculateDataQuality(student: Student): number {
  const expectedFields = 16;
  const missingCount = student.missingFields ? student.missingFields.length : 0;
  const percentage = Math.max(20, Math.round(((expectedFields - missingCount) / expectedFields) * 100));
  return percentage;
}

/**
 * Attribution of strongest positive and negative contributors
 */
export function explainScoreFactors(
  student: Student,
  successScore: number,
  placementScore: number
): { positive: FactorAttribution[]; negative: FactorAttribution[] } {
  const factors: FactorAttribution[] = [];

  // Attendance
  if (student.attendance < 75) {
    factors.push({
      factor: 'Low Attendance',
      category: 'Attendance',
      impactValue: -(75 - student.attendance),
      explanation: `Current attendance is ${student.attendance}%, below the mandatory 75% threshold.`,
      isPositive: false,
    });
  } else if (student.attendance >= 88) {
    factors.push({
      factor: 'Consistent Attendance',
      category: 'Attendance',
      impactValue: (student.attendance - 80),
      explanation: `Strong regular classroom presence at ${student.attendance}%.`,
      isPositive: true,
    });
  }

  // CGPA & Backlogs
  if (student.backlogsCount > 0) {
    factors.push({
      factor: 'Active Backlogs',
      category: 'Academic',
      impactValue: -(student.backlogsCount * 12),
      explanation: `${student.backlogsCount} pending backlog(s) impacting degree progress and eligibility.`,
      isPositive: false,
    });
  }
  if (student.cgpa >= 8.5) {
    factors.push({
      factor: 'Distinction CGPA',
      category: 'Academic',
      impactValue: (student.cgpa - 7.5) * 10,
      explanation: `High academic benchmark with ${student.cgpa.toFixed(2)} cumulative GPA.`,
      isPositive: true,
    });
  } else if (student.cgpa < 6.5) {
    factors.push({
      factor: 'Sub-Par Academic Standing',
      category: 'Academic',
      impactValue: -((7.0 - student.cgpa) * 12),
      explanation: `CGPA is ${student.cgpa.toFixed(2)}, risking campus recruitment cutoff criteria.`,
      isPositive: false,
    });
  }

  // LMS
  if (student.assignmentCompletionRate < 70) {
    factors.push({
      factor: 'Low Assignment Submissions',
      category: 'LMS',
      impactValue: -(75 - student.assignmentCompletionRate) * 0.5,
      explanation: `Only ${student.assignmentCompletionRate}% of digital coursework completed.`,
      isPositive: false,
    });
  } else if (student.assignmentCompletionRate >= 92) {
    factors.push({
      factor: 'Timely LMS Delivery',
      category: 'LMS',
      impactValue: 12,
      explanation: `${student.assignmentCompletionRate}% on-time submission rate on campus portal.`,
      isPositive: true,
    });
  }

  // Coding & Placement
  if (student.codingScore >= 80) {
    factors.push({
      factor: 'Advanced Problem Solving',
      category: 'Skills',
      impactValue: 18,
      explanation: `Scored ${student.codingScore}/100 in benchmark data structures and algorithm trials.`,
      isPositive: true,
    });
  } else if (student.codingScore < 50 && (student.department === 'Computer Science' || student.department === 'Information Technology')) {
    factors.push({
      factor: 'DSA Proficiency Gap',
      category: 'Skills',
      impactValue: -15,
      explanation: `Coding assessment score is ${student.codingScore}/100, lagging tech role expectations.`,
      isPositive: false,
    });
  }

  // Mock Interview
  if (student.mockInterviewScore < 50) {
    factors.push({
      factor: 'Weak Interview Presentation',
      category: 'Placement',
      impactValue: -16,
      explanation: `Mock HR/Tech evaluation scored ${student.mockInterviewScore}/100, identifying interview anxiety or articulation blocks.`,
      isPositive: false,
    });
  } else if (student.mockInterviewScore >= 82) {
    factors.push({
      factor: 'Polished Interview Demeanor',
      category: 'Placement',
      impactValue: 15,
      explanation: `Demonstrated strong executive communication and role readiness in mock boards.`,
      isPositive: true,
    });
  }

  // Certifications
  if (student.certificationsCompleted >= 3) {
    factors.push({
      factor: 'Industry Certifications',
      category: 'Skills',
      impactValue: 14,
      explanation: `Earned ${student.certificationsCompleted} accredited industry credentials.`,
      isPositive: true,
    });
  }

  // Split into positive and negative
  const positive = factors.filter((f) => f.isPositive).sort((a, b) => b.impactValue - a.impactValue).slice(0, 3);
  const negative = factors.filter((f) => !f.isPositive).sort((a, b) => a.impactValue - b.impactValue).slice(0, 3);

  return { positive, negative };
}

/**
 * Categorize into segment using transparent deterministic rules
 */
export function determineSegment(
  student: Student,
  successScore: number,
  placementScore: number,
  dataQuality: number
): StudentSegment {
  if (dataQuality < 70) {
    return 'Data Insufficient';
  }

  if (student.backlogsCount >= 2 || (student.cgpa < 6.0 && student.attendance < 70)) {
    return 'Academic Critical';
  }

  if (student.year >= 3 && student.codingScore >= 70 && student.mockInterviewScore < 50) {
    return 'Interview Bottleneck';
  }

  if (student.year >= 3 && student.cgpa >= 7.8 && placementScore < 60) {
    return 'Placement Gaps';
  }

  if (student.cgpa >= 8.0 && student.attendance < 75 && student.lmsLoginCountMonthly < 10) {
    return 'Disengaged High-Potential';
  }

  if (successScore >= 75 && placementScore >= 75) {
    return 'Placement Ready';
  }

  return 'Consistent Achiever';
}

/**
 * Determine risk level based on score and thresholds
 */
export function getRiskLevel(score: number, highCutoff: number, mediumCutoff: number): RiskLevel {
  if (score < highCutoff) return 'High';
  if (score < mediumCutoff) return 'Medium';
  return 'Low';
}

/**
 * Generate transparent suggested interventions for student
 */
export function getSuggestedInterventions(student: Student, segment: StudentSegment): string[] {
  const suggestions: string[] = [];

  if (student.attendance < 75) {
    suggestions.push('Attendance Mentoring');
  }
  if (student.cgpa < 6.5 || student.backlogsCount > 0) {
    suggestions.push('Subject Tutoring');
  }
  if (student.assignmentCompletionRate < 70) {
    suggestions.push('Assignment Recovery');
  }
  if (student.codingScore < 60) {
    suggestions.push('Coding Practice');
  }
  if (student.aptitudeScore < 60) {
    suggestions.push('Aptitude Training');
  }
  if (student.mockInterviewScore < 60) {
    suggestions.push('Mock Interviews');
  }
  if (student.communicationSkillScore < 60) {
    suggestions.push('Communication Coaching');
  }
  if (student.certificationsCompleted === 0) {
    suggestions.push('Certification Programs');
  }

  return suggestions.length > 0 ? suggestions : ['Continuous Performance Monitoring'];
}

/**
 * Fully score student record with all computed intelligence fields
 */
export function scoreStudentRecord(
  student: Student,
  settings: SystemSettings = DEFAULT_SETTINGS
): ScoredStudent {
  const { score: successScore } = calculateSuccessScore(student, settings.successWeights);
  const { score: placementScore } = calculatePlacementScore(student, settings.placementWeights);
  const dataQuality = calculateDataQuality(student);

  const academicRisk = getRiskLevel(
    successScore,
    settings.thresholds.academicHighCutoff,
    settings.thresholds.academicMediumCutoff
  );

  const placementRisk = getRiskLevel(
    placementScore,
    settings.thresholds.placementHighCutoff,
    settings.thresholds.placementMediumCutoff
  );

  let overallRisk: RiskLevel = 'Low';
  if (academicRisk === 'High' || placementRisk === 'High') {
    overallRisk = 'High';
  } else if (academicRisk === 'Medium' || placementRisk === 'Medium') {
    overallRisk = 'Medium';
  }

  const segment = determineSegment(student, successScore, placementScore, dataQuality);
  const { positive, negative } = explainScoreFactors(student, successScore, placementScore);
  const suggestedInterventions = getSuggestedInterventions(student, segment);

  return {
    ...student,
    successScore,
    placementScore,
    academicRisk,
    placementRisk,
    overallRisk,
    segment,
    dataQuality,
    topPositiveFactors: positive,
    topNegativeFactors: negative,
    suggestedInterventions,
  };
}
