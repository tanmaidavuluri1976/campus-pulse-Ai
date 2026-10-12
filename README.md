# CAMPUS PULSE AI
> **Tagline:** Predict. Explain. Simulate. Improve.  
> **Initiative:** KPMG in India Smart Campus Analytics Hackathon 2026  
> **Domain:** AI-Powered Student Success Intelligence & Resource Optimization Platform

---

## 1. Executive Summary

**Campus Pulse AI** is an enterprise-grade analytics and decision-support platform designed for academic leadership, departmental deans, and training & placement officers (T&P). It addresses the systemic disconnect between academic transcript records, LMS behavioral telemetry, and real-world placement readiness.

Rather than acting as a black-box predictive model, Campus Pulse AI delivers **transparent, deterministic, and explainable scoring heuristics** with a **What-If Intervention Simulator** and a **Capacity-Constrained Faculty Resource Optimizer**.

---

## 2. Core Architecture & Feature Matrix

The platform is organized into 9 modules accessible via the persistent navigation sidebar:

1. **Command Center (Executive Dashboard)**
   - High-level KPIs: Active students analyzed, academic support candidates, placement-readiness gaps, average composite success score, average placement readiness index.
   - Interactive Department-by-Year Risk Concentration Heatmap.
   - Cohort distributions and emerging systemic risk triggers.
   - Reactive filtering by department, academic year, semester, risk tier, and behavioral segment.

2. **Student Explorer (Cohorts & Digital Dossiers)**
   - High-density, sortable, and searchable student table.
   - Multi-factor sorting across CGPA, attendance, success scores, and placement indexes.
   - In-depth modal dossier with score attribution, subject-level attendance bars, longitudinal historical trajectory line charts, and competency benchmarks.
   - Filtered dataset CSV export.

3. **Predictive Intelligence & Segmentation**
   - Heuristic classification into distinct archetypes: *Academic Critical*, *Interview Bottleneck*, *Placement Gaps*, *Disengaged High-Potential*, *Placement Ready*, and *Data Insufficient*.
   - Transparent attribution explaining the specific criteria and metric triggers behind each categorization.

4. **What-If Intervention Lab (Core Differentiator)**
   - Counterfactual simulation engine allowing academic advisors to test candidate interventions on an individual student or an entire cohort.
   - Side-by-side **Scenario A vs. Scenario B** trade-off comparison.
   - Interactive controls for intervention type, intensity multiplier, duration in weeks, and faculty hours demanded.
   - Instant commitment of simulated scenarios directly into the live Resource Optimizer queue without altering historical student records.

5. **Resource Optimizer (Capacity-Constrained Allocation)**
   - Greedy allocation engine prioritizing candidate interventions within a user-defined faculty-hours budget slider (40h - 250h).
   - Return-on-effort ranking algorithm based on student risk severity, backlog urgency, and intervention suitability.
   - Interactive faculty assignment modal with follow-up review scheduling.

6. **AI Campus Analyst**
   - Natural language rule-based query engine operating 100% locally and deterministically.
   - Clickable questions answering queries on department risks, placement bottlenecks, faculty budgets, and data quality.
   - Strict factual grounding: presents verified metric evidence and supporting student samples.

7. **Data Integration Hub**
   - Ingestion portal supporting CSV upload with schema mapping and range checks.
   - Student ID matching and duplicate detection.
   - Downloadable standard CSV template and validation error audit reports.
   - Safe merge functionality recalculating live dashboard analytics upon import.

8. **Outcomes & Impact Monitor**
   - Longitudinal tracking of active, accepted, and completed interventions.
   - Overdue follow-up alert flagging when review milestones lapse.
   - Before-and-after metric recording to measure observed score trajectories.

9. **Settings & Calibration**
   - Custom calibration of Student Success Score weights (Academic 30%, Attendance 20%, LMS 15%, Assessment 15%, Skills 10%, Participation 10%).
   - Placement Readiness weights (Aptitude 20%, Coding 25%, Mock Interview 25%, Tech Skills 15%, Communication 15%).
   - Adjustable risk cutoffs (High, Medium, Low) and synthetic data reset tools.

---

## 3. Scoring Engine & Assumptions

### Student Success Score (0 – 100)
A holistic index measuring academic health and institutional retention:
$$\text{Success Score} = \frac{\sum (w_i \cdot s_i)}{\sum w_i}$$
Where initial configurable default weights are:
- **Academic Performance (30%):** Normalized from 10-point CGPA, deducting 6 points per active backlog.
- **Attendance (20%):** Direct classroom and laboratory presence percentage.
- **LMS Engagement (15%):** Weighted combination of coursework completion rate (50%), monthly login frequency (25%), and weekly active study hours (25%).
- **Assessment Consistency (15%):** Internal exam score adjusted for semester-over-semester stability.
- **Skill Development (10%):** Laboratory technical skill assessment plus accredited industry certification bonus.
- **Participation & Feedback (10%):** Extracurricular campus events and faculty proctor ratings.

### Placement Readiness Score (0 – 100)
A targeted assessment measuring campus recruitment employability:
- **Coding & Algorithms (25%)**
- **Mock Interview Performance (25%)**
- **Quantitative & Logical Aptitude (20%)**
- **Technical Competencies (15%)**
- **Communication & Presentation (15%)**

### Data Completeness & Integrity
Measures the proportion of available diagnostic records out of 16 critical fields. If a student's data quality is below 70%, they are placed into the *Data Insufficient* review queue to prevent premature penalization.

---

## 4. Synthetic Demonstration Dataset

The demo environment includes **150 deterministic, internally consistent synthetic records** generated across:
- **6 Departments:** Computer Science, Information Technology, Electronics & Communication, Data Science & AI, Mechanical Engineering, Civil Engineering.
- **4 Academic Years:** 1st Year (Freshman) through 4th Year (Final Year).
- **Representative Archetypes:**
  - High CGPA with Interview Anxiety
  - Algorithmic Master with Low Soft Skills
  - Severe Academic Risk (Sub-50% Attendance & Backlogs)
  - Disengaged High-Potential (Skipping classes with strong marks)
  - Placement-Ready All-Rounders
  - Incomplete Data Profiles

---

## 5. Technology Stack

- **Framework:** React 19 with TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS (Midnight navy enterprise theme, teal and violet accents)
- **Charts:** Recharts
- **Iconography:** Lucide React
- **Persistence:** Browser `localStorage` with real-time reactive state synchronization

---

## 6. Ethical AI & Modeling Limitations

1. **Deterministic Heuristics:** The platform explicitly avoids black-box neural networks or fabricated prediction accuracy metrics. All recommendations stem from auditable rules.
2. **Correlation vs. Causation:** Before-and-after improvements recorded in the Outcomes module represent observed longitudinal progress and must not be interpreted as absolute causal proof.
3. **Decision Support:** Outputs are intended as decision augmentations for academic advisors, never automated punitive actions against students.
