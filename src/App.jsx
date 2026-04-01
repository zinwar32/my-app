import { useState, useCallback, useEffect } from "react";
import "./App.css";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const T = {
  // Base Colors
  bg: "#0A0C14",
  bgGradient: "linear-gradient(135deg, #0A0C14 0%, #111827 50%, #1F2937 100%)",
  surface: "rgba(255, 255, 255, 0.06)",
  surfaceHover: "rgba(255, 255, 255, 0.10)",
  surfaceGlass: "rgba(255, 255, 255, 0.08)",
  surfaceGlassHover: "rgba(255, 255, 255, 0.14)",

  // Borders & Effects
  border: "rgba(255, 255, 255, 0.15)",
  borderLight: "rgba(255, 255, 255, 0.25)",
  borderAccent: "rgba(59, 130, 246, 0.4)",
  shadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  shadowGlow: "0 0 40px rgba(59, 130, 246, 0.15)",
  shadowPurple: "0 0 40px rgba(139, 92, 246, 0.15)",
  shadowCyan: "0 0 40px rgba(6, 182, 212, 0.15)",

  // Accent Colors
  accent: "#3B82F6",
  accentGradient: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
  accentSoft: "rgba(59,130,246,0.15)",
  accentHover: "#2563EB",
  accentGlow: "rgba(59, 130, 246, 0.25)",

  // Status Colors
  green: "#10B981",
  greenSoft: "rgba(16,185,129,0.15)",
  greenGlow: "rgba(16, 185, 129, 0.25)",
  yellow: "#F59E0B",
  yellowSoft: "rgba(245,158,11,0.15)",
  yellowGlow: "rgba(245, 158, 11, 0.25)",
  red: "#EF4444",
  redSoft: "rgba(239,68,68,0.15)",
  redGlow: "rgba(239, 68, 68, 0.25)",
  purple: "#8B5CF6",
  purpleSoft: "rgba(139,92,246,0.15)",
  purpleGlow: "rgba(139, 92, 246, 0.25)",
  cyan: "#06B6D4",
  cyanSoft: "rgba(6,182,212,0.15)",
  cyanGlow: "rgba(6, 182, 212, 0.25)",

  // Text Colors - Improved contrast
  textPrimary: "#FFFFFF",
  textSecondary: "#E2E8F0",
  textMuted: "#94A3B8",
  textAccent: "#3B82F6",

  // Chart Colors
  chartColors: [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
  ],

  // Glassmorphism
  glassBg: "rgba(255, 255, 255, 0.10)",
  glassBorder: "rgba(255, 255, 255, 0.18)",
  glassBackdrop: "blur(24px)",

  // Animations
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  transitionFast: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
  transitionSlow: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

  // Spacing
  radius: "12px",
  radiusLarge: "16px",
  radiusSmall: "8px",

  // Typography
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const SEED = {
  kpiWeights: {
    participants_satisfaction: 0.3,
    stakeholders_satisfaction: 0.15,
    internal_review: 0.2,
    delivery: 0.15,
    nps: 0.2,
  },
  projectTypes: [
    "Conference",
    "Workshop",
    "Cultural Night",
    "Community Event",
    "Sports Tournament",
    "Networking",
    "Awareness Campaign",
    "Fundraiser",
  ],
  statuses: ["Planning", "Active", "Completed", "Cancelled", "On Hold"],
  taskStatuses: ["To Do", "In Progress", "Done", "Blocked"],
  taskPhases: ["Pre-Event", "During Event", "Post-Event", "Admin"],
  priorities: ["Low", "Medium", "High", "Critical"],
  issueCategories: [
    "Logistics",
    "Communication",
    "Timing",
    "Registration",
    "Speakers",
    "Venue",
    "Content",
    "Other",
  ],
  teamRoles: [
    "Project Lead",
    "Coordinator",
    "Logistics",
    "Marketing",
    "Finance",
    "Technical",
    "Volunteer",
    "Advisor",
  ],
  targetAudiences: [
    "Students",
    "Faculty",
    "Community",
    "Alumni",
    "Corporate",
    "General Public",
  ],
  keywordMap: [
    { keyword: "organized", category: "Logistics", polarity: "positive" },
    { keyword: "smooth", category: "Logistics", polarity: "positive" },
    { keyword: "chaotic", category: "Logistics", polarity: "negative" },
    { keyword: "late", category: "Timing", polarity: "negative" },
    { keyword: "delayed", category: "Timing", polarity: "negative" },
    { keyword: "on time", category: "Timing", polarity: "positive" },
    { keyword: "registration", category: "Registration", polarity: "negative" },
    { keyword: "speaker", category: "Speakers", polarity: "positive" },
    { keyword: "venue", category: "Venue", polarity: "negative" },
    { keyword: "communication", category: "Communication", polarity: "negative" },
    { keyword: "content", category: "Content", polarity: "positive" },
    { keyword: "informative", category: "Content", polarity: "positive" },
  ],
  projects: [
    {
      id: "p1",
      project_code: "PRJ-2025-001",
      name: "Annual KSA Cultural Night",
      project_type: "Cultural Night",
      start_date: "2025-03-10",
      end_date: "2025-03-15",
      location: "Main Auditorium",
      target_audience: "Students",
      objective: "Celebrate Kurdish culture and promote diversity on campus",
      success_metrics: "500+ attendees, 4.0+ satisfaction",
      planned_budget: 8000,
      actual_budget: 8600,
      planned_attendance: 500,
      actual_attendance: 540,
      status: "Completed",
      created_by: "u1",
    },
    {
      id: "p2",
      project_code: "PRJ-2025-002",
      name: "Leadership Workshop Series",
      project_type: "Workshop",
      start_date: "2025-04-01",
      end_date: "2025-04-30",
      location: "Room 204-B",
      target_audience: "Students",
      objective: "Develop leadership skills among KSA members",
      success_metrics: "50+ participants, 90% completion",
      planned_budget: 3000,
      actual_budget: 2800,
      planned_attendance: 60,
      actual_attendance: 55,
      status: "Completed",
      created_by: "u1",
    },
    {
      id: "p3",
      project_code: "PRJ-2025-003",
      name: "Community Outreach Day",
      project_type: "Community Event",
      start_date: "2025-06-01",
      end_date: "2025-06-01",
      location: "City Park",
      target_audience: "Community",
      objective: "Engage local Kurdish diaspora and build community ties",
      success_metrics: "200+ community members reached",
      planned_budget: 5000,
      actual_budget: null,
      planned_attendance: 200,
      actual_attendance: null,
      status: "Active",
      created_by: "u2",
    },
    {
      id: "p4",
      project_code: "PRJ-2025-004",
      name: "Academic Symposium",
      project_type: "Conference",
      start_date: "2025-07-15",
      end_date: "2025-07-16",
      location: "Conference Hall A",
      target_audience: "Faculty",
      objective: "Academic presentations and research showcase",
      success_metrics: "30+ presentations, 150 attendees",
      planned_budget: 12000,
      actual_budget: null,
      planned_attendance: 150,
      actual_attendance: null,
      status: "Planning",
      created_by: "u1",
    },
  ],
  teamMembers: [
    {
      id: "m1",
      member_code: "KSA-001",
      name: "Sardar Ali",
      contact: "sardar@ksa.org",
      role_default: "Project Lead",
      department_role: "VP Events",
      is_active: true,
    },
    {
      id: "m2",
      member_code: "KSA-002",
      name: "Zhino Hassan",
      contact: "zhino@ksa.org",
      role_default: "Coordinator",
      department_role: "Events Coordinator",
      is_active: true,
    },
    {
      id: "m3",
      member_code: "KSA-003",
      name: "Bahoz Karimi",
      contact: "bahoz@ksa.org",
      role_default: "Logistics",
      department_role: "Logistics Head",
      is_active: true,
    },
    {
      id: "m4",
      member_code: "KSA-004",
      name: "Shirin Mahmood",
      contact: "shirin@ksa.org",
      role_default: "Marketing",
      department_role: "Marketing Lead",
      is_active: true,
    },
    {
      id: "m5",
      member_code: "KSA-005",
      name: "Dilman Aziz",
      contact: "dilman@ksa.org",
      role_default: "Finance",
      department_role: "Treasurer",
      is_active: true,
    },
  ],
  projectTeam: [
    { id: "pt1", project_id: "p1", member_id: "m1", role_in_project: "Project Lead", performance_score: 5 },
    { id: "pt2", project_id: "p1", member_id: "m2", role_in_project: "Coordinator", performance_score: 4 },
    { id: "pt3", project_id: "p1", member_id: "m3", role_in_project: "Logistics", performance_score: 4 },
    { id: "pt4", project_id: "p2", member_id: "m1", role_in_project: "Project Lead", performance_score: 5 },
    { id: "pt5", project_id: "p2", member_id: "m4", role_in_project: "Marketing", performance_score: 4 },
    { id: "pt6", project_id: "p3", member_id: "m2", role_in_project: "Project Lead", performance_score: null },
  ],
  tasks: [
    {
      id: "t1",
      project_id: "p1",
      phase: "Pre-Event",
      task_title: "Book auditorium",
      owner_member_id: "m3",
      due_date: "2025-02-15",
      status: "Done",
      priority: "High",
      risk_flag: false,
    },
    {
      id: "t2",
      project_id: "p1",
      phase: "Pre-Event",
      task_title: "Send invitations",
      owner_member_id: "m4",
      due_date: "2025-02-20",
      status: "Done",
      priority: "High",
      risk_flag: false,
    },
    {
      id: "t3",
      project_id: "p1",
      phase: "During Event",
      task_title: "Setup stage decorations",
      owner_member_id: "m3",
      due_date: "2025-03-10",
      status: "Done",
      priority: "Medium",
      risk_flag: false,
    },
    {
      id: "t4",
      project_id: "p2",
      phase: "Pre-Event",
      task_title: "Confirm speakers",
      owner_member_id: "m1",
      due_date: "2025-03-25",
      status: "Done",
      priority: "High",
      risk_flag: false,
    },
    {
      id: "t5",
      project_id: "p2",
      phase: "Pre-Event",
      task_title: "Prepare workshop materials",
      owner_member_id: "m2",
      due_date: "2025-03-28",
      status: "Done",
      priority: "Medium",
      risk_flag: false,
    },
    {
      id: "t6",
      project_id: "p3",
      phase: "Pre-Event",
      task_title: "Obtain park permit",
      owner_member_id: "m5",
      due_date: "2025-05-15",
      status: "In Progress",
      priority: "Critical",
      risk_flag: true,
    },
    {
      id: "t7",
      project_id: "p3",
      phase: "Pre-Event",
      task_title: "Recruit volunteers",
      owner_member_id: "m2",
      due_date: "2025-05-20",
      status: "To Do",
      priority: "High",
      risk_flag: false,
    },
    {
      id: "t8",
      project_id: "p4",
      phase: "Pre-Event",
      task_title: "Call for abstracts",
      owner_member_id: "m1",
      due_date: "2025-06-01",
      status: "To Do",
      priority: "High",
      risk_flag: false,
    },
    {
      id: "t9",
      project_id: "p4",
      phase: "Admin",
      task_title: "Budget approval",
      owner_member_id: "m5",
      due_date: "2025-06-15",
      status: "To Do",
      priority: "High",
      risk_flag: false,
    },
  ],
  feedbackParticipants: [
    {
      id: "fp1",
      project_id: "p1",
      response_date: "2025-03-15",
      satisfaction_overall: 5,
      content_quality: 5,
      logistics_org: 4,
      communication: 4,
      timing: 3,
      gained_useful: 5,
      recommend_0_10: 9,
      best_part: "Amazing cultural performances",
      improve: "Better seating arrangement",
      issue_category: "Logistics",
      permission_quote: true,
    },
    {
      id: "fp2",
      project_id: "p1",
      response_date: "2025-03-15",
      satisfaction_overall: 4,
      content_quality: 4,
      logistics_org: 4,
      communication: 3,
      timing: 3,
      gained_useful: 4,
      recommend_0_10: 8,
      best_part: "Food and music were great",
      improve: "Start on time",
      issue_category: "Timing",
      permission_quote: false,
    },
    {
      id: "fp3",
      project_id: "p1",
      response_date: "2025-03-15",
      satisfaction_overall: 5,
      content_quality: 5,
      logistics_org: 5,
      communication: 5,
      timing: 4,
      gained_useful: 5,
      recommend_0_10: 10,
      best_part: "Well organized and informative",
      improve: "Nothing to improve",
      issue_category: "Other",
      permission_quote: true,
    },
    {
      id: "fp4",
      project_id: "p1",
      response_date: "2025-03-15",
      satisfaction_overall: 3,
      content_quality: 4,
      logistics_org: 3,
      communication: 3,
      timing: 2,
      gained_useful: 3,
      recommend_0_10: 7,
      best_part: "Cultural dance was great",
      improve: "Registration was chaotic",
      issue_category: "Registration",
      permission_quote: false,
    },
    {
      id: "fp5",
      project_id: "p1",
      response_date: "2025-03-15",
      satisfaction_overall: 4,
      content_quality: 4,
      logistics_org: 4,
      communication: 4,
      timing: 3,
      gained_useful: 4,
      recommend_0_10: 9,
      best_part: "Loved the food",
      improve: "More seating needed",
      issue_category: "Logistics",
      permission_quote: true,
    },
    {
      id: "fp6",
      project_id: "p2",
      response_date: "2025-04-30",
      satisfaction_overall: 5,
      content_quality: 5,
      logistics_org: 5,
      communication: 5,
      timing: 5,
      gained_useful: 5,
      recommend_0_10: 10,
      best_part: "Very practical workshop",
      improve: "More sessions needed",
      issue_category: "Other",
      permission_quote: true,
    },
    {
      id: "fp7",
      project_id: "p2",
      response_date: "2025-04-30",
      satisfaction_overall: 4,
      content_quality: 5,
      logistics_org: 4,
      communication: 4,
      timing: 4,
      gained_useful: 5,
      recommend_0_10: 9,
      best_part: "Speaker was excellent",
      improve: "Handouts could be better",
      issue_category: "Content",
      permission_quote: false,
    },
    {
      id: "fp8",
      project_id: "p2",
      response_date: "2025-04-30",
      satisfaction_overall: 5,
      content_quality: 5,
      logistics_org: 5,
      communication: 5,
      timing: 5,
      gained_useful: 5,
      recommend_0_10: 10,
      best_part: "Great networking opportunity",
      improve: "Nothing",
      issue_category: "Other",
      permission_quote: true,
    },
  ],
  feedbackStakeholders: [
    {
      id: "fs1",
      project_id: "p1",
      response_date: "2025-03-16",
      satisfaction: 4,
      professionalism: 5,
      value_to_stakeholder: 4,
      communication_clarity: 4,
      collaborate_again: true,
      notes_improvements: "Great event, some logistics issues",
    },
    {
      id: "fs2",
      project_id: "p1",
      response_date: "2025-03-16",
      satisfaction: 5,
      professionalism: 5,
      value_to_stakeholder: 5,
      communication_clarity: 5,
      collaborate_again: true,
      notes_improvements: "Excellent organization overall",
    },
    {
      id: "fs3",
      project_id: "p2",
      response_date: "2025-05-01",
      satisfaction: 5,
      professionalism: 5,
      value_to_stakeholder: 5,
      communication_clarity: 5,
      collaborate_again: true,
      notes_improvements:
        "Outstanding workshop, will definitely partner again",
    },
  ],
  internalReviews: [
    {
      id: "ir1",
      project_id: "p1",
      review_date: "2025-03-20",
      objective_alignment: 4,
      execution_quality: 4,
      team_coordination: 4,
      risk_management: 3,
      went_well: "Cultural performances, attendance exceeded target",
      went_wrong: "Registration was disorganized, started 20 mins late",
      controllable: "controllable",
      action_1: "Implement digital check-in system",
      action_2: "Add 30 min buffer to schedule",
      action_3: "Pre-assign seating for VIPs",
    },
    {
      id: "ir2",
      project_id: "p2",
      review_date: "2025-05-05",
      objective_alignment: 5,
      execution_quality: 5,
      team_coordination: 5,
      risk_management: 5,
      went_well: "All objectives met, speakers highly rated",
      went_wrong: "Some materials were printed last minute",
      controllable: "controllable",
      action_1: "Finalize materials 1 week prior",
      action_2: "Create reusable workshop template",
      action_3: "Collect speaker bio earlier",
    },
  ],
  insights: {
    p1: {
      strengths: "High participant satisfaction; Strong content quality",
      weaknesses:
        "Registration process issues; Timing/punctuality concerns; Logistics capacity",
      action_items:
        "Implement digital check-in (QR-based)\nCreate 30-minute buffer in schedule\nPre-plan seating layout for large events",
      generated_summary:
        "KSA Cultural Night achieved strong satisfaction scores and exceeded attendance targets. Key improvements needed in registration workflow and event timing management.",
    },
    p2: {
      strengths:
        "Excellent content quality (avg 5.0); Perfect internal review scores; Strong speaker quality",
      weaknesses: "Minor content material preparation delays",
      action_items:
        "Finalize all materials 1 week before event\nCreate reusable workshop template library\nSend speaker briefs 2 weeks in advance",
      generated_summary:
        "Leadership Workshop Series was a standout success with perfect scores across all KPIs. Minor logistical improvements will make future editions even stronger.",
    },
  },
};

// ─── CALCULATION ENGINE ───────────────────────────────────────────────────────
function calcProjectKPIs(projectId, data) {
  const w = data.kpiWeights;
  const pf = data.feedbackParticipants.filter((f) => f.project_id === projectId);
  const sf = data.feedbackStakeholders.filter((f) => f.project_id === projectId);
  const ir = data.internalReviews.filter((r) => r.project_id === projectId);
  const proj = data.projects.find((p) => p.id === projectId);
  if (!proj) return null;

  const avg = (arr, key) =>
    arr.length ? arr.reduce((s, r) => s + r[key], 0) / arr.length : null;

  const partSatAvg = avg(pf, "satisfaction_overall");
  const stakeSatAvg = avg(sf, "satisfaction");
  const internalAvg = ir.length
    ? ir.reduce(
        (s, r) =>
          s +
          (r.objective_alignment +
            r.execution_quality +
            r.team_coordination +
            r.risk_management) /
            4,
        0
      ) / ir.length
    : null;

  let nps = null;
  if (pf.length > 0) {
    const promoters = pf.filter((f) => f.recommend_0_10 >= 9).length;
    const detractors = pf.filter((f) => f.recommend_0_10 <= 6).length;
    nps = (promoters / pf.length) * 100 - (detractors / pf.length) * 100;
  }

  let deliveryScore = null;
  const budgetVar =
    proj.actual_budget && proj.planned_budget > 0
      ? (proj.actual_budget - proj.planned_budget) / proj.planned_budget
      : null;
  const attendVar =
    proj.actual_attendance && proj.planned_attendance > 0
      ? (proj.actual_attendance - proj.planned_attendance) /
        proj.planned_attendance
      : null;

  if (budgetVar !== null && attendVar !== null) {
    deliveryScore =
      100 -
      (0.5 * Math.min(Math.abs(budgetVar) * 100, 100) +
        0.5 * Math.min(Math.abs(attendVar) * 100, 100));
  } else if (budgetVar !== null) {
    deliveryScore = 100 - Math.min(Math.abs(budgetVar) * 100, 100);
  } else if (attendVar !== null) {
    deliveryScore = 100 - Math.min(Math.abs(attendVar) * 100, 100);
  }

  const partScore = partSatAvg !== null ? (partSatAvg / 5) * 100 : null;
  const stakeScore = stakeSatAvg !== null ? (stakeSatAvg / 5) * 100 : null;
  const internalScore = internalAvg !== null ? (internalAvg / 5) * 100 : null;
  const npsNorm = nps !== null ? (nps + 100) / 2 : null;

  const components = [
    { w: w.participants_satisfaction, v: partScore },
    { w: w.stakeholders_satisfaction, v: stakeScore },
    { w: w.internal_review, v: internalScore },
    { w: w.delivery, v: deliveryScore },
    { w: w.nps, v: npsNorm },
  ];

  const available = components.filter((c) => c.v !== null);
  let overall = null;

  if (available.length > 0) {
    const sumW = available.reduce((s, c) => s + c.w, 0);
    overall = available.reduce((s, c) => s + (c.w / sumW) * c.v, 0);
  }

  const issueCounts = {};
  pf.forEach((f) => {
    if (f.issue_category) {
      issueCounts[f.issue_category] = (issueCounts[f.issue_category] || 0) + 1;
    }
  });
  const topIssue =
    Object.entries(issueCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  const tasks = data.tasks.filter((t) => t.project_id === projectId);
  const doneTasks = tasks.filter((t) => t.status === "Done").length;
  const taskProgress = tasks.length
    ? Math.round((doneTasks / tasks.length) * 100)
    : 0;

  return {
    partSatAvg,
    stakeSatAvg,
    internalAvg,
    nps,
    deliveryScore,
    budgetVar,
    attendVar,
    partScore,
    stakeScore,
    internalScore,
    npsNorm,
    overall: overall !== null ? Math.round(overall * 10) / 10 : null,
    topIssue,
    pf,
    sf,
    ir,
    tasks,
    doneTasks,
    taskProgress,
    feedbackCount: pf.length,
    stakeholderCount: sf.length,
  };
}

function generateInsights(projectId, data) {
  const kpis = calcProjectKPIs(projectId, data);
  if (!kpis) return null;

  const strengths = [];
  const weaknesses = [];

  if (kpis.partSatAvg && kpis.partSatAvg >= 4.2) {
    strengths.push("High participant satisfaction");
  }

  const contentAvg = kpis.pf.length
    ? kpis.pf.reduce((s, r) => s + r.content_quality, 0) / kpis.pf.length
    : null;
  if (contentAvg && contentAvg >= 4.2) {
    strengths.push("Strong content quality");
  }

  const logisticsAvg = kpis.pf.length
    ? kpis.pf.reduce((s, r) => s + r.logistics_org, 0) / kpis.pf.length
    : null;
  if (logisticsAvg && logisticsAvg >= 4.2) {
    strengths.push("Strong logistics");
  }

  if (kpis.deliveryScore !== null && kpis.deliveryScore < 70) {
    weaknesses.push("Delivery variance issues");
  }

  const issueCounts = {};
  kpis.pf.forEach((f) => {
    if (f.issue_category) {
      issueCounts[f.issue_category] = (issueCounts[f.issue_category] || 0) + 1;
    }
  });

  const topIssues = Object.entries(issueCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map((e) => e[0]);

  topIssues.forEach((i) => {
    if (!weaknesses.includes(i)) {
      weaknesses.push(`${i} issues noted by participants`);
    }
  });

  const actionMap = {
    Logistics: "Create logistics checklist + rehearsal timeline",
    Communication: "Publish comms plan & reminders schedule",
    Timing: "Improve agenda timing + buffer",
    Registration: "Simplify registration; add QR check-in",
    Speakers: "Pre-brief speakers; confirm slides earlier",
    Venue: "Venue walkthrough + fallback plan",
    Content: "Add needs assessment + revise content structure",
  };

  const actions = topIssues
    .filter((i) => actionMap[i])
    .map((i) => actionMap[i]);

  if (kpis.ir.length) {
    kpis.ir.forEach((r) => {
      if (r.action_1) actions.push(r.action_1);
    });
  }

  const uniqueActions = [...new Set(actions)].slice(0, 3);
  const score = kpis.overall;

  const summary =
    score !== null
      ? `Project scored ${score.toFixed(1)}/100 overall. ${
          strengths.length ? "Key strengths: " + strengths[0] + ". " : ""
        }${
          weaknesses.length
            ? "Focus areas: " + weaknesses[0] + "."
            : "Good performance across all metrics."
        }`
      : "Insufficient data to generate full summary. Add feedback and reviews to unlock insights.";

  return {
    strengths: strengths.join("; ") || "No strengths identified yet",
    weaknesses: weaknesses.join("; ") || "No weaknesses identified yet",
    action_items: uniqueActions.join("\n") || "No action items generated",
    generated_summary: summary,
  };
}

// ─── UI PRIMITIVES ────────────────────────────────────────────────────────────
function Badge({ color = "accent", children, size = "sm" }) {
  const colors = {
    accent: {
      bg: T.accentSoft,
      text: T.accent,
      border: "rgba(59,130,246,0.3)",
    },
    green: {
      bg: T.greenSoft,
      text: T.green,
      border: "rgba(16,185,129,0.3)",
    },
    yellow: {
      bg: T.yellowSoft,
      text: T.yellow,
      border: "rgba(245,158,11,0.3)",
    },
    red: {
      bg: T.redSoft,
      text: T.red,
      border: "rgba(239,68,68,0.3)",
    },
    purple: {
      bg: T.purpleSoft,
      text: T.purple,
      border: "rgba(139,92,246,0.3)",
    },
    gray: {
      bg: "rgba(100,116,139,0.12)",
      text: T.textSecondary,
      border: "rgba(100,116,139,0.3)",
    },
  };

  const c = colors[color] || colors.gray;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: size === "sm" ? "2px 8px" : "4px 12px",
        borderRadius: 20,
        fontSize: size === "sm" ? 11 : 12,
        fontWeight: 600,
        letterSpacing: "0.02em",
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
      }}
    >
      {children}
    </span>
  );
}

function ScoreBadge({ score }) {
  if (score === null || score === undefined) return <Badge color="gray">N/A</Badge>;
  const color = score >= 80 ? "green" : score >= 60 ? "yellow" : "red";
  return <Badge color={color}>{typeof score === "number" ? score.toFixed(1) : score}</Badge>;
}

function StatusBadge({ status }) {
  const map = {
    Completed: "green",
    Active: "accent",
    Planning: "purple",
    "On Hold": "yellow",
    Cancelled: "red",
  };
  return <Badge color={map[status] || "gray"}>{status}</Badge>;
}

function PriorityBadge({ priority }) {
  const map = {
    Critical: "red",
    High: "yellow",
    Medium: "accent",
    Low: "gray",
  };
  return <Badge color={map[priority] || "gray"}>{priority}</Badge>;
}

function Card({ children, style = {}, onClick, hover = false, glass = false }) {
  const [hov, setHov] = useState(false);

  const glassStyle = glass ? {
    background: hov ? T.surfaceGlassHover : T.surfaceGlass,
    backdropFilter: T.glassBackdrop,
    border: `1px solid ${T.border}`,
    boxShadow: T.shadow,
  } : {
    background: hov ? T.surfaceHover : T.surface,
    border: `1px solid ${T.border}`,
  };

  return (
    <div
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      onClick={onClick}
      style={{
        ...glassStyle,
        borderRadius: T.radius,
        padding: 24,
        ...style,
        transition: T.transition,
        cursor: onClick ? "pointer" : "default",
        position: "relative",
      }}
    >
      {glass && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(90deg, transparent 0%, ${T.borderLight} 50%, transparent 100%)`,
            borderRadius: `${T.radius} ${T.radius} 0 0`,
          }}
        />
      )}
      {children}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  options = null,
  required = false,
  small = false,
}) {
  const [focused, setFocused] = useState(false);

  const baseStyle = {
    width: "100%",
    background: "rgba(255, 255, 255, 0.05)",
    border: `1px solid ${focused ? T.borderAccent : T.border}`,
    borderRadius: T.radius,
    padding: small ? "10px 12px" : "12px 16px",
    color: T.textPrimary,
    fontSize: small ? 13 : 14,
    outline: "none",
    fontFamily: T.fontFamily,
    boxSizing: "border-box",
    transition: T.transition,
    boxShadow: focused ? `0 0 0 3px ${T.accentSoft}` : "none",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <label
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: T.textSecondary,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
          {required && <span style={{ color: T.red }}> *</span>}
        </label>
      )}

      {options ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...baseStyle,
            cursor: "pointer",
            background: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e") no-repeat right 12px center`,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            paddingRight: "40px",
          }}
        >
          <option value="">Select…</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={baseStyle}
        />
      )}
    </div>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  icon = null,
  disabled = false,
  style: extStyle = {},
}) {
  const [hov, setHov] = useState(false);

  const variants = {
    primary: {
      bg: hov ? T.accentGradient : T.accent,
      color: "#fff",
      border: "none",
      shadow: hov ? T.shadowGlow : "none",
      transform: hov ? "translateY(-1px)" : "translateY(0)",
    },
    secondary: {
      bg: hov ? T.surfaceGlassHover : T.surfaceGlass,
      color: T.textSecondary,
      border: `1px solid ${T.border}`,
      shadow: "none",
      transform: "translateY(0)",
    },
    danger: {
      bg: hov ? "#DC2626" : T.red,
      color: "#fff",
      border: "none",
      shadow: hov ? T.redGlow : "none",
      transform: hov ? "translateY(-1px)" : "translateY(0)",
    },
    ghost: {
      bg: hov ? T.surfaceGlassHover : "transparent",
      color: T.textSecondary,
      border: "none",
      shadow: "none",
      transform: "translateY(0)",
    },
    success: {
      bg: hov ? "#059669" : T.green,
      color: "#fff",
      border: "none",
      shadow: hov ? T.greenGlow : "none",
      transform: hov ? "translateY(-1px)" : "translateY(0)",
    },
  };

  const sizes = {
    sm: { padding: "8px 14px", fontSize: 12 },
    md: { padding: "10px 18px", fontSize: 13 },
    lg: { padding: "14px 24px", fontSize: 14 },
  };

  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;

  return (
    <button
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        borderRadius: T.radius,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: T.transition,
        fontFamily: T.fontFamily,
        outline: "none",
        position: "relative",
        overflow: "hidden",
        ...v,
        ...s,
        ...extStyle,
      }}
    >
      {variant === "primary" && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "100%",
            height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
            transition: "left 0.5s",
          }}
        />
      )}
      {icon && <span style={{ fontSize: 14, display: "flex", alignItems: "center" }}>{icon}</span>}
      {children}
    </button>
  );
}

function Modal({ open, onClose, title, children, width = 520 }) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10, 12, 20, 0.8)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 20,
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: T.glassBg,
          backdropFilter: T.glassBackdrop,
          border: `1px solid ${T.glassBorder}`,
          borderRadius: T.radiusLarge,
          width: "100%",
          maxWidth: width,
          maxHeight: "90vh",
          overflow: "hidden",
          boxShadow: T.shadow,
          position: "relative",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Glass highlight */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(90deg, transparent 0%, ${T.borderLight} 50%, transparent 100%)`,
            borderRadius: `${T.radiusLarge} ${T.radiusLarge} 0 0`,
          }}
        />

        <div
          style={{
            padding: "24px 32px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontWeight: 700, color: T.textPrimary, fontSize: 18 }}>
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: T.textMuted,
              fontSize: 24,
              cursor: "pointer",
              lineHeight: 1,
              padding: "4px 8px",
              borderRadius: T.radiusSmall,
              transition: T.transition,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = T.surfaceGlassHover;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "none";
            }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: "32px" }}>{children}</div>
      </div>
    </div>
  );
}

function Toast({ toasts }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        zIndex: 2000,
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            background: t.type === "error" ? T.red : T.green,
            color: "#fff",
            padding: "10px 16px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            minWidth: 220,
          }}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}

function ProgressBar({ value, max = 100, height = 6 }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const color = pct >= 80 ? T.green : pct >= 50 ? T.yellow : T.red;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.06)",
        borderRadius: 99,
        height,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: color,
          borderRadius: 99,
          transition: "width 0.4s",
        }}
      />
    </div>
  );
}

function KPICard({ label, value, sub, color = T.accent, icon }) {
  return (
    <Card style={{ flex: 1, minWidth: 140 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 22, opacity: 0.7 }}>{icon}</span>
        <div style={{ width: 4, height: 32, background: color, borderRadius: 2, flexShrink: 0 }} />
      </div>
      <div
        style={{
          marginTop: 12,
          fontSize: 26,
          fontWeight: 800,
          color,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.02em",
        }}
      >
        {value ?? <span style={{ fontSize: 16, color: T.textMuted }}>N/A</span>}
      </div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: T.textMuted,
          marginTop: 3,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </div>
      {sub && <div style={{ fontSize: 11, color: T.textSecondary, marginTop: 4 }}>{sub}</div>}
    </Card>
  );
}

function Table({ columns, rows, onRowClick }) {
  return (
    <div
      style={{
        background: T.surfaceGlass,
        backdropFilter: T.glassBackdrop,
        border: `1px solid ${T.border}`,
        borderRadius: T.radius,
        overflow: "hidden",
        boxShadow: T.shadow,
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: T.surfaceGlassHover }}>
              {columns.map((c) => (
                <th
                  key={c.key + c.label}
                  style={{
                    textAlign: "left",
                    padding: "16px 20px",
                    color: T.textSecondary,
                    fontWeight: 600,
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    borderBottom: `1px solid ${T.border}`,
                    whiteSpace: "nowrap",
                    position: "relative",
                  }}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                onClick={() => onRowClick && onRowClick(row)}
                style={{
                  borderBottom: `1px solid ${T.border}`,
                  cursor: onRowClick ? "pointer" : "default",
                  transition: T.transition,
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  if (onRowClick) {
                    e.currentTarget.style.background = T.surfaceGlassHover;
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {columns.map((c) => (
                  <td
                    key={c.key + c.label}
                    style={{
                      padding: "16px 20px",
                      color: T.textPrimary,
                      verticalAlign: "middle",
                    }}
                  >
                    {c.render ? c.render(row[c.key], row) : row[c.key] ?? <span style={{ color: T.textMuted }}>—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: 60,
              color: T.textMuted,
              fontSize: 14,
              background: T.surfaceGlass,
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>📊</div>
            No records found
          </div>
        )}
      </div>
    </div>
  );
}

function Tabs({ tabs, active, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        borderBottom: `1px solid ${T.border}`,
        marginBottom: 32,
        position: "relative",
      }}
    >
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          style={{
            padding: "12px 20px",
            background: active === t ? T.surfaceGlass : "transparent",
            backdropFilter: active === t ? T.glassBackdrop : "none",
            border: `1px solid ${active === t ? T.borderAccent : "transparent"}`,
            borderBottom: active === t ? `1px solid ${T.surfaceGlass}` : "1px solid transparent",
            borderRadius: `${T.radius} ${T.radius} 0 0`,
            color: active === t ? T.textPrimary : T.textMuted,
            fontWeight: active === t ? 600 : 500,
            fontSize: 14,
            cursor: "pointer",
            fontFamily: T.fontFamily,
            transition: T.transition,
            position: "relative",
            boxShadow: active === t ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "none",
          }}
          onMouseEnter={(e) => {
            if (active !== t) {
              e.target.style.background = T.surfaceGlassHover;
              e.target.style.color = T.textSecondary;
            }
          }}
          onMouseLeave={(e) => {
            if (active !== t) {
              e.target.style.background = "transparent";
              e.target.style.color = T.textMuted;
            }
          }}
        >
          {t}
          {active === t && (
            <div
              style={{
                position: "absolute",
                bottom: -1,
                left: 0,
                right: 0,
                height: "2px",
                background: T.accentGradient,
                borderRadius: "1px 1px 0 0",
              }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "home", icon: "⌂", label: "Home" },
  { id: "projects", icon: "◫", label: "Projects" },
  { id: "team", icon: "◎", label: "Team" },
  { id: "tasks", icon: "☑", label: "Tasks" },
  { id: "feedback", icon: "◈", label: "Feedback" },
  { id: "internal", icon: "◉", label: "Internal Review" },
  { id: "insights", icon: "◆", label: "Insights" },
  { id: "dashboard", icon: "▦", label: "Dashboard" },
  { id: "settings", icon: "◇", label: "Settings" },
  { id: "integrations", icon: "⊕", label: "Integrations" },
];

function Sidebar({ active, onChange, collapsed, onToggle, user, onLogout, isAdmin }) {
  return (
    <div
      style={{
        width: collapsed ? 72 : 280,
        background: T.surfaceGlass,
        backdropFilter: T.glassBackdrop,
        borderRight: `1px solid ${T.border}`,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        transition: T.transition,
        overflow: "hidden",
        boxShadow: T.shadow,
        position: "relative",
      }}
    >
      {/* Glass highlight */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(90deg, transparent 0%, ${T.borderLight} 50%, transparent 100%)`,
        }}
      />

      <div
        style={{
          padding: "24px 20px",
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          gap: 12,
          cursor: "pointer",
        }}
        onClick={onToggle}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: T.radius,
            background: T.accentGradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: "bold",
            flexShrink: 0,
            boxShadow: T.shadowGlow,
          }}
        >
          ك
        </div>
        {!collapsed && (
          <div>
            <div
              style={{
                fontWeight: 900,
                color: T.textPrimary,
                fontSize: 16,
                letterSpacing: "-0.01em",
                lineHeight: "1.2",
              }}
            >
              KSA Kit
            </div>
            <div
              style={{
                fontSize: 12,
                color: T.textMuted,
                fontWeight: 500,
              }}
            >
              Projects & Activities
            </div>
          </div>
        )}
      </div>

      <div style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onChange(item.id)}
              title={collapsed ? item.label : ""}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                borderRadius: T.radius,
                marginBottom: 4,
                cursor: "pointer",
                background: isActive ? T.accentSoft : "transparent",
                border: isActive ? `1px solid ${T.borderAccent}` : "1px solid transparent",
                color: isActive ? T.accent : T.textSecondary,
                transition: T.transition,
                fontWeight: isActive ? 600 : 500,
                fontSize: 14,
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = T.surfaceGlassHover;
                  e.currentTarget.style.borderColor = T.borderLight;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "transparent";
                }
              }}
            >
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "3px",
                    background: T.accentGradient,
                    borderRadius: "0 2px 2px 0",
                  }}
                />
              )}
              <span
                style={{
                  fontSize: 18,
                  flexShrink: 0,
                  width: 24,
                  textAlign: "center",
                  color: isActive ? T.accent : T.textMuted,
                }}
              >
                {item.icon}
              </span>
              {!collapsed && (
                <span style={{ whiteSpace: "nowrap", flex: 1 }}>{item.label}</span>
              )}
              {!collapsed && isActive && (
                <div
                  style={{
                    width: 6,
                    height: 6,
                    background: T.accent,
                    borderRadius: "50%",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div style={{ padding: "20px 16px", borderTop: `1px solid ${T.border}` }}>
        {!collapsed && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: T.radius,
                  background: isAdmin ? T.accentGradient : T.greenSoft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  color: isAdmin ? "#FFFFFF" : T.green,
                  boxShadow: isAdmin ? T.shadowGlow : "none",
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: T.textPrimary,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user?.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: isAdmin ? T.accent : T.green,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {isAdmin ? "Administrator" : "Team Member"}
                </div>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={onLogout}
              style={{
                width: "100%",
                justifyContent: "center",
                fontSize: "13px",
                padding: "10px",
              }}
            >
              Sign Out
            </Button>
          </div>
        )}
        {collapsed && (
          <div title="Sign Out" style={{ display: "flex", justifyContent: "center" }}>
            <button
              onClick={onLogout}
              style={{
                width: 40,
                height: 40,
                borderRadius: T.radius,
                border: `1px solid ${T.border}`,
                background: T.surfaceGlass,
                backdropFilter: T.glassBackdrop,
                color: T.textSecondary,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                transition: T.transition,
              }}
              onMouseEnter={(e) => {
                e.target.style.background = T.surfaceGlassHover;
                e.target.style.borderColor = T.borderLight;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = T.surfaceGlass;
                e.target.style.borderColor = T.border;
              }}
            >
              ⊗
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PAGE: HOME ───────────────────────────────────────────────────────────────
function HomePage({ data, setPage, setSelectedProject, user }) {
  const allKPIs = data.projects.map((p) => ({ p, kpis: calcProjectKPIs(p.id, data) }));
  const completed = data.projects.filter((p) => p.status === "Completed").length;
  const active = data.projects.filter((p) => p.status === "Active").length;
  const scores = allKPIs.map((k) => k.kpis?.overall).filter((v) => v !== null);
  const avgScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : null;
  const overdueTasks = data.tasks.filter(
    (t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== "Done"
  );
  const overBudget = data.projects.filter(
    (p) => p.actual_budget && p.planned_budget && p.actual_budget > p.planned_budget
  );
  const overdueProjects = data.projects.filter(
    (p) =>
      p.end_date &&
      new Date(p.end_date) < new Date() &&
      p.status !== "Completed" &&
      p.status !== "Cancelled"
  );

  return (
    <div
      style={{
        background: T.bgGradient,
        minHeight: "100vh",
        position: "relative",
        padding: "32px",
      }}
    >
      {/* Background Effects */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, ${T.accentGlow} 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, ${T.purpleGlow} 0%, transparent 50%),
            radial-gradient(circle at 60% 40%, ${T.cyanGlow} 0%, transparent 50%)
          `,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header Section */}
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              background: T.surfaceGlass,
              backdropFilter: T.glassBackdrop,
              border: `1px solid ${T.border}`,
              borderRadius: T.radiusLarge,
              padding: "32px",
              marginBottom: 32,
              boxShadow: T.shadow,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Glass highlight */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "1px",
                background: `linear-gradient(90deg, transparent 0%, ${T.borderLight} 50%, transparent 100%)`,
              }}
            />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: 36,
                    fontWeight: 900,
                    background: "linear-gradient(135deg, #F1F5F9 0%, #CBD5E1 50%, #94A3B8 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "-0.02em",
                    lineHeight: "1.1",
                  }}
                >
                  Welcome back, {user?.name || "Guest"} 👋
                </h1>
                <p
                  style={{
                    margin: "8px 0 0",
                    color: T.textMuted,
                    fontSize: 16,
                    fontWeight: 500,
                  }}
                >
                  Kurdistan Students Association — Projects & Activities Portal
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <Button icon="+" onClick={() => setPage("projects")} size="lg" style={{ fontSize: "16px", padding: "16px 24px" }}>
                  New Project
                </Button>
                <Button icon="☑" onClick={() => setPage("tasks")} variant="secondary" size="lg" style={{ fontSize: "16px", padding: "16px 24px" }}>
                  Add Task
                </Button>
                <Button icon="◈" onClick={() => setPage("feedback")} variant="secondary" size="lg" style={{ fontSize: "16px", padding: "16px 24px" }}>
                  Add Feedback
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginBottom: 32 }}>
          <Card glass style={{ position: "relative", overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "80px",
                height: "80px",
                background: `radial-gradient(circle, ${T.accentGlow} 0%, transparent 70%)`,
                borderRadius: "0 0 0 100%",
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: T.accent,
                  }}
                >
                  {data.projects.length}
                </div>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: T.accentSoft,
                    borderRadius: T.radius,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                  }}
                >
                  ◫
                </div>
              </div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: T.textSecondary, marginBottom: 4 }}>
                Total Projects
              </div>
              <div style={{ fontSize: "12px", color: T.textMuted }}>
                Active management portfolio
              </div>
            </div>
          </Card>

          <Card glass style={{ position: "relative", overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "80px",
                height: "80px",
                background: `radial-gradient(circle, ${T.greenGlow} 0%, transparent 70%)`,
                borderRadius: "0 0 0 100%",
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: T.green,
                  }}
                >
                  {completed}
                </div>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: T.greenSoft,
                    borderRadius: T.radius,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                  }}
                >
                  ✓
                </div>
              </div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: T.textSecondary, marginBottom: 4 }}>
                Completed Projects
              </div>
              <div style={{ fontSize: "12px", color: T.textMuted }}>
                Successfully delivered
              </div>
            </div>
          </Card>

          <Card glass style={{ position: "relative", overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "80px",
                height: "80px",
                background: `radial-gradient(circle, ${T.yellowGlow} 0%, transparent 70%)`,
                borderRadius: "0 0 0 100%",
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: T.yellow,
                  }}
                >
                  {active}
                </div>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: T.yellowSoft,
                    borderRadius: T.radius,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                  }}
                >
                  ◉
                </div>
              </div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: T.textSecondary, marginBottom: 4 }}>
                Active Projects
              </div>
              <div style={{ fontSize: "12px", color: T.textMuted }}>
                Currently in progress
              </div>
            </div>
          </Card>

          <Card glass style={{ position: "relative", overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "80px",
                height: "80px",
                background: `radial-gradient(circle, ${T.purpleGlow} 0%, transparent 70%)`,
                borderRadius: "0 0 0 100%",
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: T.purple,
                  }}
                >
                  {avgScore || "—"}
                </div>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: T.purpleSoft,
                    borderRadius: T.radius,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                  }}
                >
                  ◆
                </div>
              </div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: T.textSecondary, marginBottom: 4 }}>
                Average Score
              </div>
              <div style={{ fontSize: "12px", color: T.textMuted }}>
                Performance rating out of 100
              </div>
            </div>
          </Card>
        </div>

        {/* Alerts Section */}
        {(overdueTasks.length > 0 || overBudget.length > 0 || overdueProjects.length > 0) && (
          <Card glass style={{ marginBottom: 32, borderColor: T.redSoft, position: "relative", overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: `linear-gradient(90deg, ${T.red}, ${T.yellow}, ${T.red})`,
              }}
            />
            <div
              style={{
                fontWeight: 700,
                color: T.textPrimary,
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: "18px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: T.redSoft,
                  borderRadius: T.radius,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                }}
              >
                ⚠
              </div>
              Critical Alerts
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {overdueProjects.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "16px",
                    background: T.surfaceGlass,
                    border: `1px solid ${T.redSoft}`,
                    borderRadius: T.radius,
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      background: T.red,
                      borderRadius: "50%",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: T.textPrimary, fontSize: "14px" }}>{p.name}</div>
                    <div style={{ color: T.textMuted, fontSize: "12px" }}>
                      Overdue project • Ended {p.end_date}
                    </div>
                  </div>
                </div>
              ))}

              {overBudget.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "16px",
                    background: T.surfaceGlass,
                    border: `1px solid ${T.yellowSoft}`,
                    borderRadius: T.radius,
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      background: T.yellow,
                      borderRadius: "50%",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: T.textPrimary, fontSize: "14px" }}>{p.name}</div>
                    <div style={{ color: T.textMuted, fontSize: "12px" }}>
                      Over budget by {Math.round(((p.actual_budget - p.planned_budget) / p.planned_budget) * 100)}%
                    </div>
                  </div>
                </div>
              ))}

              {overdueTasks.map((t) => {
                const p = data.projects.find((pr) => pr.id === t.project_id);
                return (
                  <div
                    key={t.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "16px",
                      background: T.surfaceGlass,
                      border: `1px solid ${T.border}`,
                      borderRadius: T.radius,
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        background: T.textMuted,
                        borderRadius: "50%",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: T.textPrimary, fontSize: "14px" }}>{t.task_title}</div>
                      <div style={{ color: T.textMuted, fontSize: "12px" }}>
                        {p?.name} • Due {t.due_date}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Recent Projects */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 700,
                color: T.textPrimary,
              }}
            >
              Recent Projects
            </h2>
            <Button variant="ghost" onClick={() => setPage("projects")}>
              View All →
            </Button>
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            {data.projects.slice(0, 4).map((p) => {
              const kpis = calcProjectKPIs(p.id, data);
              return (
                <Card
                  key={p.id}
                  glass
                  hover
                  onClick={() => {
                    setSelectedProject(p.id);
                    setPage("project-detail");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 16,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: T.textPrimary, fontSize: 16, marginBottom: 4 }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 8 }}>
                        {p.project_code} • {p.project_type} • {p.start_date}
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <StatusBadge status={p.status} />
                        <ScoreBadge score={kpis?.overall} />
                      </div>
                    </div>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        background: T.accentSoft,
                        borderRadius: T.radius,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                        color: T.accent,
                      }}
                    >
                      →
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: PROJECTS ───────────────────────────────────────────────────────────
function ProjectsPage({ data, setData, setPage, setSelectedProject, addToast, isAdmin }) {
  const [filter, setFilter] = useState({ status: "", type: "", search: "" });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    project_type: "",
    start_date: "",
    end_date: "",
    location: "",
    target_audience: "",
    objective: "",
    success_metrics: "",
    planned_budget: "",
    planned_attendance: "",
    status: "Planning",
  });

  const filtered = data.projects.filter((p) => {
    if (filter.status && p.status !== filter.status) return false;
    if (filter.type && p.project_type !== filter.type) return false;
    if (filter.search && !p.name.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  const handleCreate = () => {
    if (!form.name || !form.project_type || !form.start_date || !form.end_date) {
      addToast("Fill required fields", "error");
      return;
    }

    if (new Date(form.end_date) < new Date(form.start_date)) {
      addToast("End date before start date", "error");
      return;
    }

    const newProj = {
      ...form,
      id: "p" + Date.now(),
      project_code: `PRJ-${new Date().getFullYear()}-${String(data.projects.length + 1).padStart(3, "0")}`,
      planned_budget: parseFloat(form.planned_budget) || 0,
      planned_attendance: parseInt(form.planned_attendance) || 0,
      actual_budget: null,
      actual_attendance: null,
      created_by: "u1",
      created_at: new Date().toISOString(),
    };

    setData((d) => ({ ...d, projects: [...d.projects, newProj] }));
    setShowForm(false);
    setForm({
      name: "",
      project_type: "",
      start_date: "",
      end_date: "",
      location: "",
      target_audience: "",
      objective: "",
      success_metrics: "",
      planned_budget: "",
      planned_attendance: "",
      status: "Planning",
    });
    addToast("Project created", "success");
  };

  const handleDelete = (projectId, projectName) => {
    if (confirm(`Are you sure you want to delete "${projectName}"? This will delete all related tasks, feedback, and team assignments.`)) {
      setData((d) => {
        const newInsights = { ...d.insights };
        delete newInsights[projectId];
        
        return {
          ...d,
          projects: d.projects.filter((p) => p.id !== projectId),
          tasks: d.tasks.filter((t) => t.project_id !== projectId),
          feedbackParticipants: d.feedbackParticipants.filter((f) => f.project_id !== projectId),
          feedbackStakeholders: d.feedbackStakeholders.filter((f) => f.project_id !== projectId),
          internalReviews: d.internalReviews.filter((r) => r.project_id !== projectId),
          projectTeam: d.projectTeam.filter((pt) => pt.project_id !== projectId),
          insights: newInsights,
        };
      });
      addToast("Project deleted successfully", "success");
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: T.textPrimary }}>Projects</h1>
        {isAdmin && (
          <Button icon="+" onClick={() => setShowForm(true)}>
            New Project
          </Button>
        )}
      </div>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 2, minWidth: 180 }}>
            <Input placeholder="Search projects…" value={filter.search} onChange={(v) => setFilter((f) => ({ ...f, search: v }))} />
          </div>
          <div style={{ flex: 1, minWidth: 130 }}>
            <Input options={["", ...SEED.statuses]} value={filter.status} onChange={(v) => setFilter((f) => ({ ...f, status: v }))} />
          </div>
          <div style={{ flex: 1, minWidth: 130 }}>
            <Input options={["", ...SEED.projectTypes]} value={filter.type} onChange={(v) => setFilter((f) => ({ ...f, type: v }))} />
          </div>
        </div>
      </Card>

      <Card style={{ padding: 0 }}>
        <Table
          columns={[
            { key: "project_code", label: "Code" },
            {
              key: "name",
              label: "Name",
              render: (v) => <span style={{ fontWeight: 600, color: T.textPrimary }}>{v}</span>,
            },
            { key: "project_type", label: "Type" },
            { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
            { key: "start_date", label: "Start" },
            { key: "end_date", label: "End" },
            {
              key: "planned_budget",
              label: "Budget",
              render: (v, r) => (
                <span style={{ fontSize: 12 }}>
                  {v?.toLocaleString()} → {r.actual_budget?.toLocaleString() ?? <span style={{ color: T.textMuted }}>TBD</span>}
                </span>
              ),
            },
            { key: "id", label: "Score", render: (_, r) => <ScoreBadge score={calcProjectKPIs(r.id, data)?.overall} /> },
            {
              key: "actions",
              label: "Actions",
              render: (_, r) => (
                <div style={{ display: "flex", gap: 8 }}>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(r.id);
                      setPage("project-detail");
                    }}
                  >
                    View
                  </Button>
                  {isAdmin && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(r.id, r.name);
                      }}
                      style={{ color: T.red }}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              ),
            },
          ]}
          rows={filtered.map((r) => ({ ...r, actions: r.id }))}
          onRowClick={(r) => {
            setSelectedProject(r.id);
            setPage("project-detail");
          }}
        />
      </Card>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="New Project" width={600}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ gridColumn: "1/-1" }}>
            <Input label="Project Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
          </div>
          <Input label="Type" options={SEED.projectTypes} value={form.project_type} onChange={(v) => setForm((f) => ({ ...f, project_type: v }))} required />
          <Input label="Status" options={SEED.statuses} value={form.status} onChange={(v) => setForm((f) => ({ ...f, status: v }))} />
          <Input label="Start Date" type="date" value={form.start_date} onChange={(v) => setForm((f) => ({ ...f, start_date: v }))} required />
          <Input label="End Date" type="date" value={form.end_date} onChange={(v) => setForm((f) => ({ ...f, end_date: v }))} required />
          <Input label="Location" value={form.location} onChange={(v) => setForm((f) => ({ ...f, location: v }))} />
          <Input label="Target Audience" options={SEED.targetAudiences} value={form.target_audience} onChange={(v) => setForm((f) => ({ ...f, target_audience: v }))} />
          <Input label="Planned Budget (IQD)" type="number" value={form.planned_budget} onChange={(v) => setForm((f) => ({ ...f, planned_budget: v }))} />
          <Input label="Planned Attendance" type="number" value={form.planned_attendance} onChange={(v) => setForm((f) => ({ ...f, planned_attendance: v }))} />
          <div style={{ gridColumn: "1/-1" }}>
            <Input label="Objective" value={form.objective} onChange={(v) => setForm((f) => ({ ...f, objective: v }))} />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <Input label="Success Metrics" value={form.success_metrics} onChange={(v) => setForm((f) => ({ ...f, success_metrics: v }))} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
          <Button variant="secondary" onClick={() => setShowForm(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create Project</Button>
        </div>
      </Modal>
    </div>
  );
}

// ─── PAGE: PROJECT DETAIL ─────────────────────────────────────────────────────
function ProjectDetailPage({ data, setData, projectId, addToast, setPage, isAdmin, user }) {
  const [tab, setTab] = useState("Overview");
  const project = data.projects.find((p) => p.id === projectId);
  if (!project) return <div style={{ color: T.textMuted }}>Project not found</div>;

  const kpis = calcProjectKPIs(projectId, data);
  const tabs = ["Overview", "Team", "Tasks", "Feedback", "Internal Review", "Insights"];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <button
          onClick={() => setPage("projects")}
          style={{
            background: "none",
            border: "none",
            color: T.textMuted,
            cursor: "pointer",
            fontSize: 13,
            padding: 0,
          }}
        >
          ← Projects
        </button>
        <span style={{ color: T.border }}>/</span>
        <span style={{ fontWeight: 800, fontSize: 18, color: T.textPrimary }}>{project.name}</span>
        <StatusBadge status={project.status} />
        <Badge color="gray">{project.project_code}</Badge>
      </div>

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === "Overview" && <ProjectOverviewTab project={project} kpis={kpis} data={data} setData={setData} addToast={addToast} />}
      {tab === "Team" && <ProjectTeamTab project={project} data={data} setData={setData} addToast={addToast} isAdmin={isAdmin} />}
      {tab === "Tasks" && <ProjectTasksTab project={project} data={data} setData={setData} addToast={addToast} isAdmin={isAdmin} user={user} />}
      {tab === "Feedback" && <ProjectFeedbackTab project={project} data={data} setData={setData} addToast={addToast} />}
      {tab === "Internal Review" && <ProjectInternalTab project={project} data={data} setData={setData} addToast={addToast} />}
      {tab === "Insights" && <ProjectInsightsTab project={project} data={data} setData={setData} addToast={addToast} />}
    </div>
  );
}

function ProjectOverviewTab({ project, kpis, setData, addToast }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    actual_budget: project.actual_budget || "",
    actual_attendance: project.actual_attendance || "",
    status: project.status,
  });

  const handleSave = () => {
    setData((d) => ({
      ...d,
      projects: d.projects.map((p) =>
        p.id === project.id
          ? {
              ...p,
              actual_budget: form.actual_budget ? parseFloat(form.actual_budget) : null,
              actual_attendance: form.actual_attendance ? parseInt(form.actual_attendance) : null,
              status: form.status,
              updated_at: new Date().toISOString(),
            }
          : p
      ),
    }));
    setEditing(false);
    addToast("Project updated", "success");
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Card style={{ gridColumn: "1/-1" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontWeight: 700, color: T.textPrimary }}>KPI Summary</span>
          <ScoreBadge score={kpis?.overall} />
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[
            { label: "Participant Satisfaction", value: kpis?.partSatAvg?.toFixed(2), sub: "/5.00", color: T.green },
            { label: "Stakeholder Satisfaction", value: kpis?.stakeSatAvg?.toFixed(2), sub: "/5.00", color: T.accent },
            { label: "Internal Review", value: kpis?.internalAvg?.toFixed(2), sub: "/5.00", color: T.purple },
            { label: "NPS", value: kpis?.nps?.toFixed(1), sub: "(-100..100)", color: T.accent },
            { label: "Delivery Score", value: kpis?.deliveryScore?.toFixed(1), sub: "/100", color: T.yellow },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                flex: 1,
                minWidth: 120,
                textAlign: "center",
                padding: "12px 8px",
                background: "rgba(255,255,255,0.02)",
                borderRadius: 8,
                border: `1px solid ${T.border}`,
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 800, color: item.color ?? T.accent }}>
                {item.value ?? <span style={{ fontSize: 14, color: T.textMuted }}>N/A</span>}
              </div>
              <div style={{ fontSize: 10, color: T.textMuted, marginTop: 2 }}>{item.sub}</div>
              <div style={{ fontSize: 11, color: T.textSecondary, marginTop: 4, fontWeight: 600 }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div style={{ fontWeight: 700, color: T.textPrimary, marginBottom: 14, display: "flex", justifyContent: "space-between" }}>
          Project Info
          <Button size="sm" variant="ghost" onClick={() => setEditing((e) => !e)}>
            {editing ? "Cancel" : "Edit"}
          </Button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
          {[
            ["Type", project.project_type],
            ["Location", project.location],
            ["Audience", project.target_audience],
            ["Dates", `${project.start_date} → ${project.end_date}`],
            ["Objective", project.objective],
            ["Success Metrics", project.success_metrics],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", gap: 8 }}>
              <span style={{ color: T.textMuted, minWidth: 120, flexShrink: 0, fontWeight: 600 }}>
                {k}
              </span>
              <span style={{ color: T.textSecondary }}>{v || "—"}</span>
            </div>
          ))}

          {editing ? (
            <>
              <Input label="Status" options={SEED.statuses} value={form.status} onChange={(v) => setForm((f) => ({ ...f, status: v }))} />
              <Input label="Actual Budget" type="number" value={form.actual_budget} onChange={(v) => setForm((f) => ({ ...f, actual_budget: v }))} />
              <Input label="Actual Attendance" type="number" value={form.actual_attendance} onChange={(v) => setForm((f) => ({ ...f, actual_attendance: v }))} />
              <Button onClick={handleSave}>Save Changes</Button>
            </>
          ) : (
            <>
              {[
                ["Status", <StatusBadge key="s" status={project.status} />],
                ["Planned Budget", `${project.planned_budget?.toLocaleString() ?? 0} IQD`],
                ["Actual Budget", project.actual_budget ? `${project.actual_budget.toLocaleString()} IQD` : "Not set"],
                ["Planned Attendance", project.planned_attendance],
                ["Actual Attendance", project.actual_attendance ?? "Not set"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ color: T.textMuted, minWidth: 120, flexShrink: 0, fontWeight: 600 }}>
                    {k}
                  </span>
                  <span style={{ color: T.textSecondary }}>{v}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </Card>

      <Card>
        <div style={{ fontWeight: 700, color: T.textPrimary, marginBottom: 14 }}>Variance & Delivery</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.textMuted, marginBottom: 4 }}>
              <span>Budget Variance</span>
              <span style={{ color: kpis?.budgetVar > 0 ? T.red : T.green, fontWeight: 700 }}>
                {kpis?.budgetVar !== null ? `${(kpis.budgetVar * 100).toFixed(1)}%` : "N/A"}
              </span>
            </div>
            <ProgressBar value={kpis?.deliveryScore ?? 0} />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.textMuted, marginBottom: 4 }}>
              <span>Attendance Variance</span>
              <span style={{ color: kpis?.attendVar < 0 ? T.red : T.green, fontWeight: 700 }}>
                {kpis?.attendVar !== null ? `${(kpis.attendVar * 100).toFixed(1)}%` : "N/A"}
              </span>
            </div>
            <ProgressBar value={kpis?.taskProgress ?? 0} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.textMuted }}>
            <span>Task Progress</span>
            <span style={{ fontWeight: 700, color: T.textPrimary }}>
              {kpis?.taskProgress ?? 0}% ({kpis?.doneTasks}/{kpis?.tasks?.length})
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.textMuted }}>
            <span>Top Issue</span>
            <Badge color="yellow">{kpis?.topIssue ?? "None"}</Badge>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.textMuted }}>
            <span>Feedback Responses</span>
            <span style={{ fontWeight: 700, color: T.textPrimary }}>
              {kpis?.feedbackCount} participants, {kpis?.stakeholderCount} stakeholders
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ProjectTeamTab({ project, data, setData, addToast, isAdmin }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [form, setForm] = useState({ member_id: "", role_in_project: "", responsibility: "" });
  const projectTeam = data.projectTeam.filter((pt) => pt.project_id === project.id);

  const resetForm = () => {
    setForm({ member_id: "", role_in_project: "", responsibility: "" });
    setEditingTeamId(null);
  };

  const handleAdd = () => {
    if (!form.member_id) {
      addToast("Select a member", "error");
      return;
    }
    
    // Check if member already in project (but allow editing the same member)
    if (!editingTeamId && projectTeam.find((pt) => pt.member_id === form.member_id)) {
      addToast("Member already in project", "error");
      return;
    }

    if (editingTeamId) {
      // Update existing team member
      setData((d) => ({
        ...d,
        projectTeam: d.projectTeam.map((pt) => (pt.id === editingTeamId ? { ...pt, ...form } : pt)),
      }));
      addToast("Member updated", "success");
    } else {
      // Add new team member
      setData((d) => ({
        ...d,
        projectTeam: [...d.projectTeam, { id: "pt" + Date.now(), ...form, project_id: project.id, performance_score: null }],
      }));
      addToast("Member added", "success");
    }
    setShowAdd(false);
    resetForm();
  };

  const handleEdit = (teamMember) => {
    setForm({ member_id: teamMember.member_id, role_in_project: teamMember.role_in_project, responsibility: teamMember.responsibility });
    setEditingTeamId(teamMember.id);
    setShowAdd(true);
  };

  const handleDelete = (teamId) => {
    if (confirm("Are you sure you want to remove this member from the project?")) {
      setData((d) => ({
        ...d,
        projectTeam: d.projectTeam.filter((pt) => pt.id !== teamId),
      }));
      addToast("Member removed", "success");
    }
  };

  const members = projectTeam.map((pt) => {
    const m = data.teamMembers.find((m) => m.id === pt.member_id);
    return { ...pt, memberName: m?.name, memberRole: m?.role_default };
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        {isAdmin && (
          <Button icon="+" onClick={() => { resetForm(); setShowAdd(true); }}>
            Add Member
          </Button>
        )}
      </div>

      <Card style={{ padding: 0 }}>
        <Table
          columns={[
            {
              key: "memberName",
              label: "Name",
              render: (v) => <span style={{ fontWeight: 600, color: T.textPrimary }}>{v}</span>,
            },
            { key: "role_in_project", label: "Role in Project" },
            { key: "responsibility", label: "Responsibility", render: (v) => v || "—" },
            {
              key: "performance_score",
              label: "Performance",
              render: (v) => (v ? <ScoreBadge score={v * 20} /> : <Badge color="gray">Not rated</Badge>),
            },
            {
              key: "actions",
              label: "Actions",
              render: (_, row) => (
                <div style={{ display: "flex", gap: 8 }}>
                  {isAdmin && (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)} style={{ color: T.red }}>
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              ),
            },
          ]}
          rows={members}
        />
      </Card>

      <Modal open={showAdd} onClose={() => { setShowAdd(false); resetForm(); }} title={editingTeamId ? "Edit Team Member" : "Add Team Member"}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Input
            label="Member"
            options={data.teamMembers.filter((m) => m.is_active).map((m) => m.name)}
            value={data.teamMembers.find((m) => m.id === form.member_id)?.name || ""}
            onChange={(v) => {
              const m = data.teamMembers.find((m) => m.name === v);
              setForm((f) => ({ ...f, member_id: m?.id || "" }));
            }}
          />
          <Input label="Role in Project" options={SEED.teamRoles} value={form.role_in_project} onChange={(v) => setForm((f) => ({ ...f, role_in_project: v }))} />
          <Input label="Responsibility" value={form.responsibility} onChange={(v) => setForm((f) => ({ ...f, responsibility: v }))} />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button variant="secondary" onClick={() => { setShowAdd(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>{editingTeamId ? "Update Member" : "Add Member"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function ProjectTasksTab({ project, data, setData, addToast, isAdmin, user }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [form, setForm] = useState({
    task_title: "",
    phase: "Pre-Event",
    priority: "Medium",
    status: "To Do",
    due_date: "",
    owner_member_id: "",
    risk_flag: false,
    comment: "",
  });

  const tasks = data.tasks.filter((t) => t.project_id === project.id);
  const done = tasks.filter((t) => t.status === "Done").length;

  const resetForm = () => {
    setForm({
      task_title: "",
      phase: "Pre-Event",
      priority: "Medium",
      status: "To Do",
      due_date: "",
      owner_member_id: "",
      risk_flag: false,
      comment: "",
    });
    setEditingTaskId(null);
  };

  const handleAdd = () => {
    if (!form.task_title) {
      addToast("Task title required", "error");
      return;
    }

    if (editingTaskId) {
      // Update existing task
      setData((d) => ({
        ...d,
        tasks: d.tasks.map((t) => (t.id === editingTaskId ? { ...form, id: editingTaskId, project_id: project.id } : t)),
      }));
      addToast("Task updated", "success");
    } else {
      // Add new task
      setData((d) => ({
        ...d,
        tasks: [...d.tasks, { ...form, id: "t" + Date.now(), project_id: project.id }],
      }));
      addToast("Task added", "success");
    }
    setShowAdd(false);
    resetForm();
  };

  const handleEdit = (task) => {
    if (!isAdmin) return;
    setForm(task);
    setEditingTaskId(task.id);
    setShowAdd(true);
  };

  const handleDelete = (taskId) => {
    if (!isAdmin) return;
    if (confirm("Are you sure you want to delete this task?")) {
      setData((d) => ({
        ...d,
        tasks: d.tasks.filter((t) => t.id !== taskId),
      }));
      addToast("Task deleted", "success");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <span style={{ fontSize: 13, color: T.textMuted }}>{done}/{tasks.length} tasks done — </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary }}>
            {tasks.length ? Math.round((done / tasks.length) * 100) : 0}%
          </span>
          <div style={{ marginTop: 6, width: 240 }}>
            <ProgressBar value={tasks.length ? (done / tasks.length) * 100 : 0} />
          </div>
        </div>
        {isAdmin && (
          <Button icon="+" onClick={() => { resetForm(); setShowAdd(true); }}>
            Add Task
          </Button>
        )}
      </div>

      <Card style={{ padding: 0 }}>
        <Table
          columns={[
            {
              key: "task_title",
              label: "Task",
              render: (v) => <span style={{ fontWeight: 600, color: T.textPrimary }}>{v}</span>,
            },
            { key: "phase", label: "Phase", render: (v) => <Badge color="gray">{v}</Badge> },
            { key: "priority", label: "Priority", render: (v) => <PriorityBadge priority={v} /> },
            {
              key: "status",
              label: "Status",
              render: (v) => (
                <Badge color={v === "Done" ? "green" : v === "Blocked" ? "red" : v === "In Progress" ? "accent" : "gray"}>
                  {v}
                </Badge>
              ),
            },
            { key: "due_date", label: "Due" },
            { key: "risk_flag", label: "Risk", render: (v) => (v ? <Badge color="red">⚠ Risk</Badge> : "") },
            {
              key: "owner_member_id",
              label: "Owner",
              render: (v) => data.teamMembers.find((m) => m.id === v)?.name ?? <span style={{ color: T.textMuted }}>Unassigned</span>,
            },
            {
              key: "actions",
              label: "Actions",
              render: (_, row) => (
                <div style={{ display: "flex", gap: 8 }}>
                  {isAdmin && (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)} style={{ color: T.red }}>
                        Delete
                      </Button>
                    </>
                  )}
                  {!isAdmin && row.owner_member_id === user?.id && row.status !== "Done" && (
                    <Button variant="ghost" size="sm" color="green" onClick={() => {
                      setData((d) => ({
                        ...d,
                        tasks: d.tasks.map((t) => {
                          if (t.id === row.id) {
                            if (t.owner_member_id !== user?.id) return t;
                            return { ...t, status: "Done" };
                          }
                          return t;
                        }),
                      }));
                      addToast("Task marked as done", "success");
                    }} style={{ color: T.green }}>
                      Mark Done
                    </Button>
                  )}
                  {!isAdmin && row.status === "Done" && (
                    <span style={{ fontSize: 12, color: T.green }}>✓ Completed</span>
                  )}
                </div>
              ),
            },
          ]}
          rows={tasks}
        />
      </Card>

      <Modal open={showAdd} onClose={() => { setShowAdd(false); resetForm(); }} title={editingTaskId ? "Edit Task" : "New Task"}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Input label="Task Title" value={form.task_title} onChange={(v) => setForm((f) => ({ ...f, task_title: v }))} required />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Phase" options={SEED.taskPhases} value={form.phase} onChange={(v) => setForm((f) => ({ ...f, phase: v }))} />
            <Input label="Priority" options={SEED.priorities} value={form.priority} onChange={(v) => setForm((f) => ({ ...f, priority: v }))} />
            <Input label="Status" options={SEED.taskStatuses} value={form.status} onChange={(v) => setForm((f) => ({ ...f, status: v }))} />
            <Input label="Due Date" type="date" value={form.due_date} onChange={(v) => setForm((f) => ({ ...f, due_date: v }))} />
          </div>

          <Input
            label="Owner"
            options={["", ...data.teamMembers.map((m) => m.name)]}
            value={data.teamMembers.find((m) => m.id === form.owner_member_id)?.name || ""}
            onChange={(v) => {
              const m = data.teamMembers.find((m) => m.name === v);
              setForm((f) => ({ ...f, owner_member_id: m?.id || "" }));
            }}
          />

          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.textSecondary, cursor: "pointer" }}>
            <input type="checkbox" checked={form.risk_flag} onChange={(e) => setForm((f) => ({ ...f, risk_flag: e.target.checked }))} />
            Flag as risk
          </label>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8, borderTop: `1px solid ${T.border}` }}>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>{editingTaskId ? "Update Task" : "Add Task"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

const EMPTY_PF = {
  satisfaction_overall: "3",
  content_quality: "3",
  logistics_org: "3",
  communication: "3",
  timing: "3",
  gained_useful: "3",
  recommend_0_10: "7",
  best_part: "",
  improve: "",
  issue_category: "Other",
  permission_quote: false,
};

const EMPTY_SF = {
  satisfaction: "3",
  professionalism: "3",
  value_to_stakeholder: "3",
  communication_clarity: "3",
  collaborate_again: false,
  notes_improvements: "",
};

function RatingInput({ label, value, onChange, max = 5 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: T.textMuted,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </label>
      <div style={{ display: "flex", gap: 4 }}>
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(String(n))}
            style={{
              width: 34,
              height: 34,
              borderRadius: 6,
              border: `1px solid ${parseInt(value) === n ? T.accent : T.border}`,
              background: parseInt(value) === n ? T.accentSoft : "transparent",
              color: parseInt(value) === n ? T.accent : T.textMuted,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.1s",
              fontFamily: "inherit",
            }}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

function ParticipantFeedbackForm({ project, setData, addToast, onClose }) {
  const [form, setForm] = useState({ ...EMPTY_PF });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.satisfaction_overall) {
      addToast("Please rate Overall Satisfaction", "error");
      return;
    }

    const entry = {
      ...form,
      id: "fp" + Date.now(),
      project_id: project.id,
      response_date: new Date().toISOString().split("T")[0],
      satisfaction_overall: parseInt(form.satisfaction_overall),
      content_quality: parseInt(form.content_quality) || 0,
      logistics_org: parseInt(form.logistics_org) || 0,
      communication: parseInt(form.communication) || 0,
      timing: parseInt(form.timing) || 0,
      gained_useful: parseInt(form.gained_useful) || 0,
      recommend_0_10: parseInt(form.recommend_0_10) || 0,
    };

    setData((d) => ({ ...d, feedbackParticipants: [...d.feedbackParticipants, entry] }));
    addToast("Participant feedback added ✓", "success");
    onClose();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ padding: "10px 14px", background: T.accentSoft, borderRadius: 8, fontSize: 12, color: T.accent, fontWeight: 600 }}>
        Project: {project.name}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <RatingInput label="Overall Satisfaction *" value={form.satisfaction_overall} onChange={(v) => set("satisfaction_overall", v)} />
        <RatingInput label="Content Quality" value={form.content_quality} onChange={(v) => set("content_quality", v)} />
        <RatingInput label="Logistics & Organisation" value={form.logistics_org} onChange={(v) => set("logistics_org", v)} />
        <RatingInput label="Communication" value={form.communication} onChange={(v) => set("communication", v)} />
        <RatingInput label="Timing" value={form.timing} onChange={(v) => set("timing", v)} />
        <RatingInput label="Gained Useful Info" value={form.gained_useful} onChange={(v) => set("gained_useful", v)} />
      </div>

      <div>
        <label
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: T.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            display: "block",
            marginBottom: 6,
          }}
        >
          Recommend (0–10)
        </label>

        <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          {Array.from({ length: 11 }, (_, i) => i).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => set("recommend_0_10", String(n))}
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                border: `1px solid ${
                  parseInt(form.recommend_0_10) === n
                    ? n >= 9
                      ? T.green
                      : n >= 7
                      ? T.yellow
                      : T.red
                    : T.border
                }`,
                background:
                  parseInt(form.recommend_0_10) === n
                    ? n >= 9
                      ? "rgba(16,185,129,0.15)"
                      : n >= 7
                      ? "rgba(245,158,11,0.15)"
                      : "rgba(239,68,68,0.15)"
                    : "transparent",
                color:
                  parseInt(form.recommend_0_10) === n
                    ? n >= 9
                      ? T.green
                      : n >= 7
                      ? T.yellow
                      : T.red
                    : T.textMuted,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {n}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: T.textMuted, marginTop: 4 }}>
          <span>Not at all</span>
          <span>Neutral</span>
          <span>Definitely yes</span>
        </div>
      </div>

      <Input label="Issue Category" options={SEED.issueCategories} value={form.issue_category} onChange={(v) => set("issue_category", v)} />
      <Input label="What was the best part?" value={form.best_part} onChange={(v) => set("best_part", v)} placeholder="e.g. Cultural performances, networking…" />
      <Input label="What could be improved?" value={form.improve} onChange={(v) => set("improve", v)} placeholder="e.g. Registration process, timing…" />

      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.textSecondary, cursor: "pointer" }}>
        <input type="checkbox" checked={form.permission_quote} onChange={(e) => set("permission_quote", e.target.checked)} />
        I give permission to use my comments as a quote
      </label>

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8, borderTop: `1px solid ${T.border}` }}>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="success">
          Submit Feedback
        </Button>
      </div>
    </div>
  );
}

function StakeholderFeedbackForm({ project, setData, addToast, onClose }) {
  const [form, setForm] = useState({ ...EMPTY_SF });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.satisfaction) {
      addToast("Please rate Satisfaction", "error");
      return;
    }

    const entry = {
      ...form,
      id: "fs" + Date.now(),
      project_id: project.id,
      response_date: new Date().toISOString().split("T")[0],
      satisfaction: parseInt(form.satisfaction) || 0,
      professionalism: parseInt(form.professionalism) || 0,
      value_to_stakeholder: parseInt(form.value_to_stakeholder) || 0,
      communication_clarity: parseInt(form.communication_clarity) || 0,
    };

    setData((d) => ({ ...d, feedbackStakeholders: [...d.feedbackStakeholders, entry] }));
    addToast("Stakeholder feedback added ✓", "success");
    onClose();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ padding: "10px 14px", background: T.greenSoft, borderRadius: 8, fontSize: 12, color: T.green, fontWeight: 600 }}>
        Project: {project.name}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <RatingInput label="Overall Satisfaction *" value={form.satisfaction} onChange={(v) => set("satisfaction", v)} />
        <RatingInput label="Professionalism" value={form.professionalism} onChange={(v) => set("professionalism", v)} />
        <RatingInput label="Value" value={form.value_to_stakeholder} onChange={(v) => set("value_to_stakeholder", v)} />
        <RatingInput label="Communication Clarity" value={form.communication_clarity} onChange={(v) => set("communication_clarity", v)} />
      </div>

      <div>
        <label
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: T.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            display: "block",
            marginBottom: 8,
          }}
        >
          Would you collaborate again?
        </label>

        <div style={{ display: "flex", gap: 8 }}>
          {["Yes", "No"].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => set("collaborate_again", opt === "Yes")}
              style={{
                padding: "8px 20px",
                borderRadius: 8,
                border: `1px solid ${
                  form.collaborate_again === (opt === "Yes")
                    ? opt === "Yes"
                      ? T.green
                      : T.red
                    : T.border
                }`,
                background:
                  form.collaborate_again === (opt === "Yes")
                    ? opt === "Yes"
                      ? T.greenSoft
                      : T.redSoft
                    : "transparent",
                color:
                  form.collaborate_again === (opt === "Yes")
                    ? opt === "Yes"
                      ? T.green
                      : T.red
                    : T.textMuted,
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Notes & Improvement Suggestions"
        value={form.notes_improvements}
        onChange={(v) => set("notes_improvements", v)}
        placeholder="Any comments or suggestions…"
      />

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8, borderTop: `1px solid ${T.border}` }}>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="success">
          Submit Feedback
        </Button>
      </div>
    </div>
  );
}

function ProjectFeedbackTab({ project, data, setData, addToast }) {
  const [subTab, setSubTab] = useState("Participants");
  const [showAdd, setShowAdd] = useState(false);

  const pf = data.feedbackParticipants.filter((f) => f.project_id === project.id);
  const sf = data.feedbackStakeholders.filter((f) => f.project_id === project.id);

  const avgRating = (arr, key) =>
    arr.length ? (arr.reduce((s, r) => s + (r[key] || 0), 0) / arr.length).toFixed(2) : "N/A";

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {["Participants", "Stakeholders"].map((t) => (
            <Button
              key={t}
              size="sm"
              variant={subTab === t ? "primary" : "secondary"}
              onClick={() => {
                setSubTab(t);
                setShowAdd(false);
              }}
            >
              {t} ({t === "Participants" ? pf.length : sf.length})
            </Button>
          ))}
        </div>

        <Button icon="+" onClick={() => setShowAdd(true)}>
          Add {subTab === "Participants" ? "Participant" : "Stakeholder"} Response
        </Button>
      </div>

      {subTab === "Participants" && (
        <>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
            {[
              ["Overall", avgRating(pf, "satisfaction_overall"), T.accent],
              ["Content", avgRating(pf, "content_quality"), T.green],
              ["Logistics", avgRating(pf, "logistics_org"), T.yellow],
              ["Communication", avgRating(pf, "communication"), T.purple],
              ["Timing", avgRating(pf, "timing"), T.red],
            ].map(([k, v, c]) => (
              <div
                key={k}
                style={{
                  textAlign: "center",
                  padding: "10px 16px",
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                  minWidth: 80,
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 800, color: c }}>{v}</div>
                <div style={{ fontSize: 10, color: T.textMuted, marginTop: 2, textTransform: "uppercase" }}>{k}</div>
              </div>
            ))}
          </div>

          <Card style={{ padding: 0 }}>
            <Table
              columns={[
                { key: "response_date", label: "Date" },
                { key: "satisfaction_overall", label: "Overall", render: (v) => <ScoreBadge score={v * 20} /> },
                { key: "content_quality", label: "Content" },
                { key: "logistics_org", label: "Logistics" },
                {
                  key: "recommend_0_10",
                  label: "NPS (0–10)",
                  render: (v) => (
                    <span style={{ fontWeight: 700, color: v >= 9 ? T.green : v >= 7 ? T.yellow : T.red }}>
                      {v}
                    </span>
                  ),
                },
                { key: "issue_category", label: "Issue", render: (v) => <Badge color="yellow">{v}</Badge> },
                {
                  key: "best_part",
                  label: "Best Part",
                  render: (v) => (
                    <span
                      style={{
                        fontSize: 11,
                        color: T.textSecondary,
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "block",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {v || "—"}
                    </span>
                  ),
                },
              ]}
              rows={pf}
            />
          </Card>
        </>
      )}

      {subTab === "Stakeholders" && (
        <>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
            {[
              ["Satisfaction", avgRating(sf, "satisfaction"), T.green],
              ["Professionalism", avgRating(sf, "professionalism"), T.accent],
              ["Value", avgRating(sf, "value_to_stakeholder"), T.yellow],
              ["Communication", avgRating(sf, "communication_clarity"), T.purple],
            ].map(([k, v, c]) => (
              <div
                key={k}
                style={{
                  textAlign: "center",
                  padding: "10px 16px",
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                  minWidth: 80,
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 800, color: c }}>{v}</div>
                <div style={{ fontSize: 10, color: T.textMuted, marginTop: 2, textTransform: "uppercase" }}>{k}</div>
              </div>
            ))}
          </div>

          <Card style={{ padding: 0 }}>
            <Table
              columns={[
                { key: "response_date", label: "Date" },
                { key: "satisfaction", label: "Satisfaction", render: (v) => <ScoreBadge score={v * 20} /> },
                { key: "professionalism", label: "Professionalism" },
                { key: "value_to_stakeholder", label: "Value" },
                {
                  key: "collaborate_again",
                  label: "Collaborate Again",
                  render: (v) => <Badge color={v ? "green" : "red"}>{v ? "Yes" : "No"}</Badge>,
                },
                {
                  key: "notes_improvements",
                  label: "Notes",
                  render: (v) => <span style={{ fontSize: 11, color: T.textSecondary }}>{v || "—"}</span>,
                },
              ]}
              rows={sf}
            />
          </Card>
        </>
      )}

      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title={`Add ${subTab === "Participants" ? "Participant" : "Stakeholder"} Feedback`}
        width={580}
      >
        {subTab === "Participants" ? (
          <ParticipantFeedbackForm project={project} setData={setData} addToast={addToast} onClose={() => setShowAdd(false)} />
        ) : (
          <StakeholderFeedbackForm project={project} setData={setData} addToast={addToast} onClose={() => setShowAdd(false)} />
        )}
      </Modal>
    </div>
  );
}

function ProjectInternalTab({ project, data, setData, addToast }) {
  const [showAdd, setShowAdd] = useState(false);
  const reviews = data.internalReviews.filter((r) => r.project_id === project.id);
  const [form, setForm] = useState({
    objective_alignment: "",
    execution_quality: "",
    team_coordination: "",
    risk_management: "",
    went_well: "",
    went_wrong: "",
    controllable: "controllable",
    action_1: "",
    action_2: "",
    action_3: "",
  });

  const handleAdd = () => {
    if (!form.objective_alignment) {
      addToast("Ratings required", "error");
      return;
    }

    setData((d) => ({
      ...d,
      internalReviews: [
        ...d.internalReviews,
        {
          ...form,
          id: "ir" + Date.now(),
          project_id: project.id,
          review_date: new Date().toISOString().split("T")[0],
          objective_alignment: parseInt(form.objective_alignment),
          execution_quality: parseInt(form.execution_quality),
          team_coordination: parseInt(form.team_coordination),
          risk_management: parseInt(form.risk_management),
        },
      ],
    }));
    setShowAdd(false);
    addToast("Review added", "success");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Button icon="+" onClick={() => setShowAdd(true)}>
          Add Review
        </Button>
      </div>

      <Card style={{ padding: 0 }}>
        <Table
          columns={[
            { key: "review_date", label: "Date" },
            { key: "objective_alignment", label: "Objective", render: (v) => <ScoreBadge score={v * 20} /> },
            { key: "execution_quality", label: "Execution", render: (v) => <ScoreBadge score={v * 20} /> },
            { key: "team_coordination", label: "Team", render: (v) => <ScoreBadge score={v * 20} /> },
            { key: "risk_management", label: "Risk Mgmt", render: (v) => <ScoreBadge score={v * 20} /> },
            {
              key: "controllable",
              label: "Controllable",
              render: (v) => (
                <Badge color={v === "controllable" ? "green" : v === "not_controllable" ? "red" : "yellow"}>
                  {v}
                </Badge>
              ),
            },
            {
              key: "went_well",
              label: "Went Well",
              render: (v) => (
                <span
                  style={{
                    fontSize: 11,
                    color: T.textSecondary,
                    maxWidth: 200,
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {v || "—"}
                </span>
              ),
            },
          ]}
          rows={reviews}
        />
      </Card>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Internal Review" width={560}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            ["objective_alignment", "Objective Alignment (1-5)"],
            ["execution_quality", "Execution Quality (1-5)"],
            ["team_coordination", "Team Coordination (1-5)"],
            ["risk_management", "Risk Management (1-5)"],
          ].map(([k, l]) => (
            <Input
              key={k}
              label={l}
              type="number"
              value={form[k]}
              onChange={(v) => setForm((f) => ({ ...f, [k]: v }))}
            />
          ))}
          <Input label="Controllable?" options={["controllable", "partially", "not_controllable"]} value={form.controllable} onChange={(v) => setForm((f) => ({ ...f, controllable: v }))} />
        </div>

        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
          <Input label="What Went Well" value={form.went_well} onChange={(v) => setForm((f) => ({ ...f, went_well: v }))} />
          <Input label="What Went Wrong" value={form.went_wrong} onChange={(v) => setForm((f) => ({ ...f, went_wrong: v }))} />
          <Input label="Action Item 1" value={form.action_1} onChange={(v) => setForm((f) => ({ ...f, action_1: v }))} />
          <Input label="Action Item 2" value={form.action_2} onChange={(v) => setForm((f) => ({ ...f, action_2: v }))} />
          <Input label="Action Item 3" value={form.action_3} onChange={(v) => setForm((f) => ({ ...f, action_3: v }))} />
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
          <Button variant="secondary" onClick={() => setShowAdd(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd}>Add Review</Button>
        </div>
      </Modal>
    </div>
  );
}

function ProjectInsightsTab({ project, data, setData, addToast }) {
  const ins = data.insights[project.id] || {};
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    strengths: ins.strengths || "",
    weaknesses: ins.weaknesses || "",
    action_items: ins.action_items || "",
  });

  const handleRegenerate = () => {
    const generated = generateInsights(project.id, data);
    if (!generated) {
      addToast("Insufficient data", "error");
      return;
    }

    setData((d) => ({
      ...d,
      insights: {
        ...d.insights,
        [project.id]: { ...generated, last_generated_at: new Date().toISOString() },
      },
    }));

    setForm({
      strengths: generated.strengths,
      weaknesses: generated.weaknesses,
      action_items: generated.action_items,
    });

    addToast("Insights regenerated", "success");
  };

  const handleSave = () => {
    setData((d) => ({
      ...d,
      insights: {
        ...d.insights,
        [project.id]: {
          ...(d.insights[project.id] || {}),
          strengths: form.strengths,
          weaknesses: form.weaknesses,
          action_items: form.action_items,
          updated_at: new Date().toISOString(),
        },
      },
    }));
    setEditing(false);
    addToast("Insights saved", "success");
  };

  const current = data.insights[project.id] || {};

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button variant="secondary" icon="↺" onClick={handleRegenerate}>
          Regenerate Insights
        </Button>
        {!editing && (
          <Button variant="secondary" onClick={() => setEditing(true)}>
            Edit Override
          </Button>
        )}
      </div>
        {current.generated_summary && (
          <div className="card">
            <div className="section-title">AI Summary</div>
            <div className="insight-content">{current.generated_summary}</div>
          </div>
        )}

      {editing ? (
        <div className="no-print">
          <div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: T.textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "block",
                marginBottom: 6,
              }}
            >
              Strengths
            </label>
            <textarea
              value={form.strengths}
              onChange={(e) => setForm((f) => ({ ...f, strengths: e.target.value }))}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${T.borderLight}`,
                borderRadius: 8,
                padding: "10px 12px",
                color: T.textPrimary,
                fontSize: 13,
                minHeight: 80,
                resize: "vertical",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: T.textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "block",
                marginBottom: 6,
              }}
            >
              Weaknesses
            </label>
            <textarea
              value={form.weaknesses}
              onChange={(e) => setForm((f) => ({ ...f, weaknesses: e.target.value }))}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${T.borderLight}`,
                borderRadius: 8,
                padding: "10px 12px",
                color: T.textPrimary,
                fontSize: 13,
                minHeight: 80,
                resize: "vertical",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: T.textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "block",
                marginBottom: 6,
              }}
            >
              Action Items (one per line)
            </label>
            <textarea
              value={form.action_items}
              onChange={(e) => setForm((f) => ({ ...f, action_items: e.target.value }))}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${T.borderLight}`,
                borderRadius: 8,
                padding: "10px 12px",
                color: T.textPrimary,
                fontSize: 13,
                minHeight: 100,
                resize: "vertical",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <Button onClick={handleSave}>Save</Button>
            <Button variant="secondary" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          {[
            { label: "Strengths", value: current.strengths, color: T.green },
            { label: "Weaknesses", value: current.weaknesses, color: T.red },
          ].map((item) => (
            <div key={item.label} className="card">
              <div className="section-title" style={{ color: item.color }}>{item.label}</div>
              <div className="insight-content">
                {item.value || "No data yet — regenerate insights."}
              </div>
            </div>
          ))}

          <div className="card">
            <div className="section-title">Action Items</div>
            {current.action_items ? (
              <div className="action-items">
                {current.action_items
                  .split("\n")
                  .filter(Boolean)
                  .map((a, i) => (
                    <div key={i} className="action-item">
                      {a}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="insight-content">No action items yet — regenerate insights.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── PAGE: TEAM ───────────────────────────────────────────────────────────────
function TeamPage({ data, setData, addToast, isAdmin }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    role_default: "Project Lead",
    department_role: "",
  });
  const [search, setSearch] = useState("");

  const filtered = data.teamMembers.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()) && m.is_active);

  const resetForm = () => {
    setForm({ name: "", contact: "", role_default: "Project Lead", department_role: "" });
    setEditingMemberId(null);
  };

  const handleAdd = () => {
    if (!form.name) {
      addToast("Name required", "error");
      return;
    }

    if (editingMemberId) {
      // Update existing member
      setData((d) => ({
        ...d,
        teamMembers: d.teamMembers.map((m) => (m.id === editingMemberId ? { ...m, ...form } : m)),
      }));
      addToast("Member updated", "success");
    } else {
      // Add new member
      setData((d) => ({
        ...d,
        teamMembers: [
          ...d.teamMembers,
          {
            ...form,
            id: "m" + Date.now(),
            member_code: `KSA-${String(d.teamMembers.length + 1).padStart(3, "0")}`,
            is_active: true,
            created_at: new Date().toISOString(),
          },
        ],
      }));
      addToast("Member added", "success");
    }

    setShowAdd(false);
    resetForm();
  };

  const handleEdit = (member) => {
    setForm({ name: member.name, contact: member.contact, role_default: member.role_default, department_role: member.department_role });
    setEditingMemberId(member.id);
    setShowAdd(true);
  };

  const handleDelete = (memberId) => {
    if (confirm("Are you sure you want to delete this member?")) {
      setData((d) => ({
        ...d,
        teamMembers: d.teamMembers.map((m) => (m.id === memberId ? { ...m, is_active: false } : m)),
      }));
      addToast("Member deleted", "success");
    }
  };

  const enriched = filtered.map((m) => {
    const activeProj = data.projectTeam.filter((pt) => pt.member_id === m.id).length;
    const activeTasks = data.tasks.filter((t) => t.owner_member_id === m.id && t.status !== "Done").length;
    return { ...m, activeProj, activeTasks };
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: T.textPrimary }}>Team Members</h1>
        {isAdmin && (
          <Button icon="+" onClick={() => { resetForm(); setShowAdd(true); }}>
            Add Member
          </Button>
        )}
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Input placeholder="Search members…" value={search} onChange={setSearch} />
      </Card>

      <Card style={{ padding: 0 }}>
        <Table
          columns={[
            { key: "member_code", label: "Code", render: (v) => <Badge color="gray">{v}</Badge> },
            { key: "name", label: "Name", render: (v) => <span style={{ fontWeight: 600, color: T.textPrimary }}>{v}</span> },
            { key: "role_default", label: "Role" },
            { key: "department_role", label: "Dept. Role" },
            { key: "contact", label: "Contact", render: (v) => <span style={{ fontSize: 12, color: T.textMuted }}>{v || "—"}</span> },
            { key: "activeProj", label: "Projects", render: (v) => <Badge color="accent">{v}</Badge> },
            {
              key: "activeTasks",
              label: "Open Tasks",
              render: (v) => <Badge color={v > 3 ? "red" : v > 0 ? "yellow" : "green"}>{v}</Badge>,
            },
            { key: "is_active", label: "Status", render: (v) => <Badge color={v ? "green" : "gray"}>{v ? "Active" : "Inactive"}</Badge> },
            ...(isAdmin ? [{
              key: "actions",
              label: "Actions",
              render: (_, row) => (
                <div style={{ display: "flex", gap: 8 }}>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)} style={{ color: T.red }}>
                    Delete
                  </Button>
                </div>
              ),
            }] : []),
          ]}
          rows={enriched}
        />
      </Card>

      <Modal open={showAdd} onClose={() => { setShowAdd(false); resetForm(); }} title={editingMemberId ? "Edit Team Member" : "Add Team Member"}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Input label="Full Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
          <Input label="Contact (email/phone)" value={form.contact} onChange={(v) => setForm((f) => ({ ...f, contact: v }))} />
          <Input label="Default Role" options={SEED.teamRoles} value={form.role_default} onChange={(v) => setForm((f) => ({ ...f, role_default: v }))} />
          <Input label="Department Role" value={form.department_role} onChange={(v) => setForm((f) => ({ ...f, department_role: v }))} />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button variant="secondary" onClick={() => { setShowAdd(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>{editingMemberId ? "Update Member" : "Add Member"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── PAGE: TASKS ──────────────────────────────────────────────────────────────
function TasksPage({ data, setData, addToast, user, isAdmin }) {
  const [filter, setFilter] = useState({ status: "", priority: "", project: "", risk: "" });
  const [search, setSearch] = useState("");

  const filtered = data.tasks.filter((t) => {
    if (filter.status && t.status !== filter.status) return false;
    if (filter.priority && t.priority !== filter.priority) return false;
    if (filter.project && t.project_id !== filter.project) return false;
    if (filter.risk === "yes" && !t.risk_flag) return false;
    if (search && !t.task_title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const enriched = filtered.map((t) => ({
    ...t,
    projectName: data.projects.find((p) => p.id === t.project_id)?.name,
    ownerName: data.teamMembers.find((m) => m.id === t.owner_member_id)?.name,
  }));

  const updateStatus = (taskId, newStatus) => {
    const task = data.tasks.find((t) => t.id === taskId);
    if (!task) return;

    if (!isAdmin && task.owner_member_id !== user?.id) {
      addToast("You can only update status of your own tasks", "error");
      return;
    }

    setData((d) => ({
      ...d,
      tasks: d.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
    }));
    addToast("Status updated", "success");
  };

  return (
    <div>
      <h1 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 800, color: T.textPrimary }}>Tasks</h1>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 2, minWidth: 160 }}>
            <Input placeholder="Search tasks…" value={search} onChange={setSearch} />
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <Input options={["", "To Do", "In Progress", "Done", "Blocked"]} value={filter.status} onChange={(v) => setFilter((f) => ({ ...f, status: v }))} />
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <Input options={["", "Low", "Medium", "High", "Critical"]} value={filter.priority} onChange={(v) => setFilter((f) => ({ ...f, priority: v }))} />
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <Input
              options={["", ...data.projects.map((p) => p.name)]}
              value={data.projects.find((p) => p.id === filter.project)?.name || ""}
              onChange={(v) => {
                const p = data.projects.find((p) => p.name === v);
                setFilter((f) => ({ ...f, project: p?.id || "" }));
              }}
            />
          </div>
        </div>
      </Card>

      <Card style={{ padding: 0 }}>
        <Table
          columns={[
            {
              key: "task_title",
              label: "Task",
              render: (v) => <span style={{ fontWeight: 600, color: T.textPrimary }}>{v}</span>,
            },
           
            { key: "phase", label: "Phase", render: (v) => <Badge color="gray">{v}</Badge> },
            { key: "priority", label: "Priority", render: (v) => <PriorityBadge priority={v} /> },
            {
              key: "status",
              label: "Status",
              render: (v, r) => {
                const canUpdate = isAdmin || r.owner_member_id === user?.id;
                return (
                  <select
                    value={v}
                    onChange={(e) => updateStatus(r.id, e.target.value)}
                    disabled={!canUpdate}
                    style={{
                      background: "transparent",
                      border: `1px solid ${T.border}`,
                      color: canUpdate ? T.textSecondary : T.textMuted,
                      borderRadius: 6,
                      padding: "3px 8px",
                      fontSize: 12,
                      cursor: canUpdate ? "pointer" : "not-allowed",
                      fontFamily: "inherit",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {SEED.taskStatuses.map((s) => (
                      <option key={s} value={s}> {s} </option>
                    ))}
                  </select>
                );
              },
            },
            {
              key: "due_date",
              label: "Due",
              render: (v) => {
                if (!v) return "—";
                const overdue = new Date(v) < new Date();
                return <span style={{ color: overdue ? T.red : T.textSecondary, fontSize: 12 }}>{v}</span>;
              },
            },
            { key: "ownerName", label: "Owner", render: (v) => v || <span style={{ color: T.textMuted }}>Unassigned</span> },
            { key: "risk_flag", label: "", render: (v) => (v ? <Badge color="red">⚠</Badge> : "") },
          ]}
          rows={enriched}
        />
      </Card>
    </div>
  );
}

// ─── PAGE: DASHBOARD ─────────────────────────────────────────────────────────
function DashboardPage({ data }) {
  const [selectedProject, setSelectedProject] = useState("");

  const allKPIs = data.projects.map((p) => ({ p, kpis: calcProjectKPIs(p.id, data) }));
  const completed = data.projects.filter((p) => p.status === "Completed");
  const scores = allKPIs.map((k) => k.kpis?.overall).filter((v) => v !== null);
  const avgScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
  const allNPS = allKPIs.map((k) => k.kpis?.nps).filter((v) => v !== null);
  const avgNPS = allNPS.length ? allNPS.reduce((a, b) => a + b, 0) / allNPS.length : null;
  const allBudgetVar = allKPIs.map((k) => k.kpis?.budgetVar).filter((v) => v !== null);
  const avgBudgetVar = allBudgetVar.length ? allBudgetVar.reduce((a, b) => a + b, 0) / allBudgetVar.length : null;
  const allPartSat = allKPIs.map((k) => k.kpis?.partSatAvg).filter((v) => v !== null);
  const avgPartSat = allPartSat.length ? allPartSat.reduce((a, b) => a + b, 0) / allPartSat.length : null;

  const statusData = SEED.statuses.map((s) => ({
    name: s,
    value: data.projects.filter((p) => p.status === s).length,
  })).filter((d) => d.value > 0);

  const scoreByType = SEED.projectTypes
    .map((t) => {
      const projs = allKPIs.filter((k) => k.p.project_type === t && k.kpis?.overall !== null);
      return projs.length
        ? { type: t, score: +(projs.reduce((s, k) => s + k.kpis.overall, 0) / projs.length).toFixed(1) }
        : null;
    })
    .filter(Boolean);

  const issueData = SEED.issueCategories
    .map((cat) => ({
      category: cat,
      count: data.feedbackParticipants.filter((f) => f.issue_category === cat).length,
    }))
    .sort((a, b) => b.count - a.count)
    .filter((d) => d.count > 0);

  const satisfactionTrend = data.feedbackParticipants.reduce((acc, f) => {
    const d = f.response_date?.slice(0, 7);
    if (d) {
      acc[d] = acc[d] || [];
      acc[d].push(f.satisfaction_overall);
    }
    return acc;
  }, {});

  const satisfactionChartData = Object.entries(satisfactionTrend)
    .map(([month, vals]) => ({
      month,
      avg: +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2),
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const budgetVarData = allKPIs
    .filter((k) => k.kpis?.budgetVar !== null)
    .map((k) => ({ name: k.p.name.substring(0, 18), variance: +(k.kpis.budgetVar * 100).toFixed(1) }));

  const taskCompletion = data.projects.map((p) => {
    const tasks = data.tasks.filter((t) => t.project_id === p.id);
    return {
      name: p.name.substring(0, 18),
      pct: tasks.length ? Math.round((tasks.filter((t) => t.status === "Done").length / tasks.length) * 100) : 0,
    };
  });

  const snap = selectedProject ? calcProjectKPIs(selectedProject, data) : null;

  return (
    <div>
      <h1 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 800, color: T.textPrimary }}>Dashboard</h1>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <KPICard label="Total Projects" value={data.projects.length} icon="◫" color={T.accent} />
        <KPICard label="Completed" value={completed.length} icon="✓" color={T.green} />
        <KPICard label="Avg Score" value={avgScore?.toFixed(1)} icon="◆" color={T.purple} />
        <KPICard label="Avg Satisfaction" value={avgPartSat?.toFixed(2)} icon="◈" color={T.yellow} sub="/5.00" />
        <KPICard label="Avg NPS" value={avgNPS?.toFixed(1)} icon="↑" color={T.green} />
        <KPICard
          label="Avg Budget Variance"
          value={avgBudgetVar !== null ? `${(avgBudgetVar * 100).toFixed(1)}%` : null}
          icon="$"
          color={avgBudgetVar > 0 ? T.red : T.green}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <Card>
          <div style={{ fontWeight: 700, color: T.textPrimary, marginBottom: 16, fontSize: 13 }}>Projects by Status</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {statusData.map((e, i) => (
                  <Cell key={i} fill={T.chartColors[i % T.chartColors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, color: T.textPrimary }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div style={{ fontWeight: 700, color: T.textPrimary, marginBottom: 16, fontSize: 13 }}>Avg Score by Project Type</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={scoreByType} margin={{ top: 0, right: 0, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="type" tick={{ fill: T.textMuted, fontSize: 10 }} angle={-30} textAnchor="end" />
              <YAxis tick={{ fill: T.textMuted, fontSize: 10 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, color: T.textPrimary }} />
              <Bar dataKey="score" fill={T.accent} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div style={{ fontWeight: 700, color: T.textPrimary, marginBottom: 16, fontSize: 13 }}>Satisfaction Trend</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={satisfactionChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="month" tick={{ fill: T.textMuted, fontSize: 10 }} />
              <YAxis tick={{ fill: T.textMuted, fontSize: 10 }} domain={[1, 5]} />
              <Tooltip contentStyle={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, color: T.textPrimary }} />
              <Line type="monotone" dataKey="avg" stroke={T.green} strokeWidth={2} dot={{ fill: T.green, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div style={{ fontWeight: 700, color: T.textPrimary, marginBottom: 16, fontSize: 13 }}>Top Issue Categories</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={issueData} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis type="number" tick={{ fill: T.textMuted, fontSize: 10 }} />
              <YAxis dataKey="category" type="category" tick={{ fill: T.textMuted, fontSize: 10 }} />
              <Tooltip contentStyle={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, color: T.textPrimary }} />
              <Bar dataKey="count" fill={T.yellow} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div style={{ fontWeight: 700, color: T.textPrimary, marginBottom: 16, fontSize: 13 }}>Budget Variance by Project (%)</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={budgetVarData} margin={{ bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="name" tick={{ fill: T.textMuted, fontSize: 10 }} angle={-20} textAnchor="end" />
              <YAxis tick={{ fill: T.textMuted, fontSize: 10 }} />
              <Tooltip contentStyle={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, color: T.textPrimary }} />
              <Bar dataKey="variance" radius={[4, 4, 0, 0]} fill={T.red}>
                {budgetVarData.map((e, i) => (
                  <Cell key={i} fill={e.variance > 0 ? T.red : T.green} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div style={{ fontWeight: 700, color: T.textPrimary, marginBottom: 16, fontSize: 13 }}>Task Completion by Project (%)</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={taskCompletion} margin={{ bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="name" tick={{ fill: T.textMuted, fontSize: 10 }} angle={-20} textAnchor="end" />
              <YAxis tick={{ fill: T.textMuted, fontSize: 10 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, color: T.textPrimary }} />
              <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
                {taskCompletion.map((e, i) => (
                  <Cell key={i} fill={e.pct === 100 ? T.green : e.pct >= 50 ? T.yellow : T.red} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <div
          style={{
            fontWeight: 700,
            color: T.textPrimary,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          Project Snapshot
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            style={{
              background: T.surfaceHover,
              border: `1px solid ${T.border}`,
              color: T.textPrimary,
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <option value="">Select a project…</option>
            {data.projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {snap ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 12 }}>
            {[
              { label: "Overall Score", value: snap.overall?.toFixed(1) ?? "N/A", color: T.accent },
              { label: "Participant Sat.", value: snap.partSatAvg?.toFixed(2) ?? "N/A", color: T.green },
              { label: "NPS", value: snap.nps?.toFixed(1) ?? "N/A", color: T.yellow },
              { label: "Delivery Score", value: snap.deliveryScore?.toFixed(1) ?? "N/A", color: T.purple },
              {
                label: "Budget Variance",
                value: snap.budgetVar !== null ? `${(snap.budgetVar * 100).toFixed(1)}%` : "N/A",
                color: snap.budgetVar > 0 ? T.red : T.green,
              },
              { label: "Task Progress", value: `${snap.taskProgress}%`, color: T.accent },
              { label: "Risk Tasks", value: snap.tasks.filter((t) => t.risk_flag).length, color: T.red },
              { label: "Top Issue", value: snap.topIssue ?? "None", color: T.yellow },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  textAlign: "center",
                  padding: "14px 10px",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: 8,
                  border: `1px solid ${T.border}`,
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 800, color: item.color }}>{item.value}</div>
                <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4, fontWeight: 600 }}>{item.label}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: T.textMuted, fontSize: 13, textAlign: "center", padding: 20 }}>
            Select a project to see its snapshot
          </div>
        )}

        {snap && data.insights[selectedProject] && (
          <div
            style={{
              marginTop: 16,
              padding: "12px 14px",
              background: "rgba(59,130,246,0.05)",
              border: `1px solid ${T.accentSoft}`,
              borderRadius: 8,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: T.accent, marginBottom: 6, textTransform: "uppercase" }}>
              Latest Insight
            </div>
            <p style={{ margin: 0, color: T.textSecondary, fontSize: 13, lineHeight: 1.6 }}>
              {data.insights[selectedProject].generated_summary}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── PAGE: SETTINGS ───────────────────────────────────────────────────────────
function SettingsPage({ data, setData, addToast }) {
  const [tab, setTab] = useState("KPI Weights");
  const [weights, setWeights] = useState({ ...data.kpiWeights });
  const weightSum = Object.values(weights).reduce((a, b) => a + parseFloat(b || 0), 0);

  const saveWeights = () => {
    if (Math.abs(weightSum - 1.0) > 0.001) {
      addToast("Weights must sum to 1.0", "error");
      return;
    }
    setData((d) => ({ ...d, kpiWeights: { ...weights } }));
    addToast("Weights updated", "success");
  };

  return (
    <div>
      <h1 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 800, color: T.textPrimary }}>Settings</h1>
      <Tabs tabs={["KPI Weights", "Keyword Map", "How To Use"]} active={tab} onChange={setTab} />

      {tab === "KPI Weights" && (
        <Card style={{ maxWidth: 500 }}>
          <div style={{ fontWeight: 700, color: T.textPrimary, marginBottom: 16 }}>KPI Weight Configuration</div>
          <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 16 }}>Weights must sum to exactly 1.0 (100%)</div>

          {Object.entries(weights).map(([k, v]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ flex: 1, fontSize: 13, color: T.textSecondary, textTransform: "capitalize" }}>
                {k.replace(/_/g, " ")}
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={v}
                onChange={(e) => setWeights((w) => ({ ...w, [k]: parseFloat(e.target.value) || 0 }))}
                style={{
                  width: 80,
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${T.borderLight}`,
                  borderRadius: 6,
                  padding: "6px 8px",
                  color: T.textPrimary,
                  fontSize: 13,
                  textAlign: "center",
                  fontFamily: "inherit",
                }}
              />
              <div style={{ width: 60, fontSize: 12, color: T.textMuted }}>
                {(parseFloat(v) * 100).toFixed(0)}%
              </div>
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 13 }}>
              <span style={{ color: T.textMuted }}>Sum: </span>
              <span style={{ fontWeight: 700, color: Math.abs(weightSum - 1.0) < 0.001 ? T.green : T.red }}>
                {weightSum.toFixed(2)}
              </span>
              <span style={{ color: T.textMuted }}> / 1.00</span>
            </div>
            <Button onClick={saveWeights}>Save Weights</Button>
          </div>
        </Card>
      )}

      {tab === "Keyword Map" && (
        <div>
          <Card style={{ padding: 0 }}>
            <Table
              columns={[
                { key: "keyword", label: "Keyword", render: (v) => <span style={{ fontWeight: 600, color: T.textPrimary }}>{v}</span> },
                { key: "category", label: "Category", render: (v) => <Badge color="accent">{v}</Badge> },
                { key: "polarity", label: "Polarity", render: (v) => <Badge color={v === "positive" ? "green" : "red"}>{v}</Badge> },
              ]}
              rows={data.keywordMap || SEED.keywordMap}
            />
          </Card>
        </div>
      )}

      {tab === "How To Use" && (
        <Card style={{ maxWidth: 680 }}>
          <div style={{ lineHeight: 1.8, color: T.textSecondary, fontSize: 13 }}>
            <h3 style={{ color: T.textPrimary, marginTop: 0 }}>KSA Project Assessment Kit — Quick Guide</h3>
            <p><strong style={{ color: T.accent }}>1. Create a Project</strong> — Go to Projects → New Project. Fill in the project details including budget and attendance targets.</p>
            <p><strong style={{ color: T.accent }}>2. Add Team Members</strong> — Go to Team to create member profiles. Then in each project's Team tab, assign members with roles.</p>
            <p><strong style={{ color: T.accent }}>3. Manage Tasks</strong> — Add tasks per project in the Tasks tab. Use phases (Pre/During/Post-Event) and set priorities.</p>
            <p><strong style={{ color: T.accent }}>4. Collect Feedback</strong> — After the event, enter participant and stakeholder feedback. Import CSV files from Google Forms exports via Integrations.</p>
            <p><strong style={{ color: T.accent }}>5. Add Internal Review</strong> — The team completes an internal review with ratings and lessons learned for each project.</p>
            <p><strong style={{ color: T.accent }}>6. Generate Insights</strong> — Visit the Insights tab of any project and click "Regenerate Insights" to auto-generate strengths, weaknesses, and action items.</p>
            <p><strong style={{ color: T.accent }}>7. Monitor Dashboard</strong> — Use the Dashboard page for a full organizational overview. Use the Project Snapshot for quick per-project deep-dives.</p>
            <p><strong style={{ color: T.accent }}>KPI Weights</strong> — Adjust how each component contributes to the Overall Score in Settings → KPI Weights. Sum must equal 1.0.</p>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── PAGE: INTEGRATIONS ───────────────────────────────────────────────────────
function IntegrationsPage({ data, setData, addToast }) {
  const [importPreview, setImportPreview] = useState(null);
  const [importType, setImportType] = useState("participants");
  const [activeMethod, setActiveMethod] = useState("csv");
  const [copied, setCopied] = useState("");

  const csvTemplates = {
    participants:
      "response_date,project_code,satisfaction_overall,content_quality,logistics_org,communication,timing,gained_useful,recommend_0_10,best_part,improve,issue_category,permission_quote\n2025-03-15,PRJ-2025-001,5,5,4,4,3,5,9,Great event,More seating,Logistics,true",
    stakeholders:
      "response_date,project_code,satisfaction,professionalism,value_to_stakeholder,communication_clarity,collaborate_again,notes_improvements\n2025-03-16,PRJ-2025-001,4,5,4,4,true,Great event",
    internal:
      "review_date,project_code,objective_alignment,execution_quality,team_coordination,risk_management,went_well,went_wrong,controllable,action_1\n2025-03-20,PRJ-2025-001,4,4,4,3,Good coordination,Late start,controllable,Implement QR check-in",
  };

  const downloadCSV = (type) => {
    const blob = new Blob([csvTemplates[type]], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ksa_${type}_template.csv`;
    a.click();
    addToast("CSV template downloaded", "success");
  };

  const copyCode = (id, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(""), 2000);
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = ev.target.result.split("\n").filter(Boolean);
      const headers = lines[0].split(",");
      const rows = lines.slice(1).map((line, i) => {
        const vals = line.split(",");
        const obj = {};
        headers.forEach((h, j) => {
          obj[h.trim()] = vals[j]?.trim();
        });
        const projMatch = data.projects.find((p) => p.project_code === obj.project_code || p.name === obj.project_code);
        return {
          ...obj,
          _line: i + 2,
          _project: projMatch?.name,
          _valid: !!projMatch,
          _error: projMatch ? "" : "project_code not found",
        };
      });
      setImportPreview({ rows, headers, type: importType });
    };

    reader.readAsText(file);
    e.target.value = "";
  };

  const confirmImport = () => {
    if (!importPreview) return;
    const valid = importPreview.rows.filter((r) => r._valid);

    if (importPreview.type === "participants") {
      const entries = valid.map((r) => ({
        id: "fp" + Date.now() + Math.random(),
        project_id: data.projects.find((p) => p.project_code === r.project_code || p.name === r.project_code)?.id,
        response_date: r.response_date || new Date().toISOString().split("T")[0],
        satisfaction_overall: parseInt(r.satisfaction_overall) || 3,
        content_quality: parseInt(r.content_quality) || 3,
        logistics_org: parseInt(r.logistics_org) || 3,
        communication: parseInt(r.communication) || 3,
        timing: parseInt(r.timing) || 3,
        gained_useful: parseInt(r.gained_useful) || 3,
        recommend_0_10: parseInt(r.recommend_0_10) || 5,
        best_part: r.best_part || "",
        improve: r.improve || "",
        issue_category: r.issue_category || "Other",
        permission_quote: r.permission_quote === "true",
      }));
      setData((d) => ({ ...d, feedbackParticipants: [...d.feedbackParticipants, ...entries] }));
    } else if (importPreview.type === "stakeholders") {
      const entries = valid.map((r) => ({
        id: "fs" + Date.now() + Math.random(),
        project_id: data.projects.find((p) => p.project_code === r.project_code || p.name === r.project_code)?.id,
        response_date: r.response_date || new Date().toISOString().split("T")[0],
        satisfaction: parseInt(r.satisfaction) || 3,
        professionalism: parseInt(r.professionalism) || 3,
        value_to_stakeholder: parseInt(r.value_to_stakeholder) || 3,
        communication_clarity: parseInt(r.communication_clarity) || 3,
        collaborate_again: r.collaborate_again === "true",
        notes_improvements: r.notes_improvements || "",
      }));
      setData((d) => ({ ...d, feedbackStakeholders: [...d.feedbackStakeholders, ...entries] }));
    }

    addToast(
      `${valid.length} rows imported${importPreview.rows.length - valid.length > 0 ? `, ${importPreview.rows.length - valid.length} skipped` : ""}`,
      valid.length > 0 ? "success" : "error"
    );
    setImportPreview(null);
  };

  const appsScriptCode = `// ════════════════════════════════════════════════
// KSA Forms Auto-Sync — Google Apps Script
// Paste this in your Google Sheet's Script Editor
// (Extensions → Apps Script)
// ════════════════════════════════════════════════

const FORM_ID = "YOUR_GOOGLE_FORM_ID_HERE";
const PROJECT_QUESTION_TITLE = "Which project is this feedback for?";

const PROJECT_LIST = [
${data.projects.map((p) => `  "${p.project_code} — ${p.name}"`).join(",\n")}
];

function updateProjectDropdown() {
  var form = FormApp.openById(FORM_ID);
  var items = form.getItems(FormApp.ItemType.LIST);
  for (var i = 0; i < items.length; i++) {
    if (items[i].getTitle() === PROJECT_QUESTION_TITLE) {
      items[i].asListItem().setChoiceValues(PROJECT_LIST);
      Logger.log("✓ Updated " + PROJECT_LIST.length + " project choices");
      return;
    }
  }
  Logger.log("✗ Question not found: " + PROJECT_QUESTION_TITLE);
}

function createDailyTrigger() {
  ScriptApp.newTrigger("updateProjectDropdown")
    .timeBased().everyDays(1).atHour(8).create();
  Logger.log("✓ Daily trigger created");
}`;

  const webhookCode = `// ════════════════════════════════════════════════
// KSA Webhook — Auto-send form responses to KSA Kit
// ════════════════════════════════════════════════

const KSA_WEBHOOK_URL = "https://YOUR_PROJECT.supabase.co/functions/v1/form-webhook";
const KSA_SECRET = "YOUR_WEBHOOK_SECRET";

const PARTICIPANT_FIELD_MAP = {
  "Which project is this feedback for?": "project_code",
  "Overall Satisfaction (1-5)": "satisfaction_overall",
  "Content Quality (1-5)": "content_quality",
  "Logistics & Organisation (1-5)": "logistics_org",
  "Communication (1-5)": "communication",
  "Timing (1-5)": "timing",
  "Gained Useful Info (1-5)": "gained_useful",
  "Would you recommend us? (0-10)": "recommend_0_10",
  "What was the best part?": "best_part",
  "What could be improved?": "improve",
  "Issue Category": "issue_category",
  "Permission to use as quote?": "permission_quote",
};

function onFormSubmit(e) {
  var responses = e.response.getItemResponses();
  var payload = { type: "participant_feedback", source: "google_forms" };

  responses.forEach(function(r) {
    var question = r.getItem().getTitle();
    var answer = r.getResponse();
    var field = PARTICIPANT_FIELD_MAP[question];
    if (field) payload[field] = answer;
  });

  if (payload.project_code && payload.project_code.includes("—")) {
    payload.project_code = payload.project_code.split("—")[0].trim();
  }

  var options = {
    method: "post",
    contentType: "application/json",
    headers: { "x-webhook-secret": KSA_SECRET },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(KSA_WEBHOOK_URL, options);
  Logger.log("Webhook response: " + response.getResponseCode());
}

function setupTrigger() {
  var form = FormApp.openById("YOUR_FORM_ID");
  ScriptApp.newTrigger("onFormSubmit")
    .forForm(form).onFormSubmit().create();
  Logger.log("✓ onFormSubmit trigger created");
}`;

  const supabaseEdgeFn = `import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SECRET = Deno.env.get("WEBHOOK_SECRET") ?? "";

serve(async (req) => {
  if (req.headers.get("x-webhook-secret") !== SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  );

  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("project_code", body.project_code)
    .single();

  if (!project) {
    return new Response(JSON.stringify({ error: "Project not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }

  const { error } = await supabase.from("feedback_participants").insert({
    project_id: project.id,
    response_date: new Date().toISOString().split("T")[0],
    satisfaction_overall: parseInt(body.satisfaction_overall) || 3,
    content_quality: parseInt(body.content_quality) || 3,
    logistics_org: parseInt(body.logistics_org) || 3,
    communication: parseInt(body.communication) || 3,
    timing: parseInt(body.timing) || 3,
    gained_useful: parseInt(body.gained_useful) || 3,
    recommend_0_10: parseInt(body.recommend_0_10) || 5,
    best_part: body.best_part || "",
    improve: body.improve || "",
    issue_category: body.issue_category || "Other",
    permission_quote: body.permission_quote === "Yes",
  });

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" }
  });
});`;

  const CodeBlock = ({ id, code }) => (
    <div style={{ position: "relative", marginTop: 8 }}>
      <div
        style={{
          background: "rgba(0,0,0,0.4)",
          border: `1px solid ${T.border}`,
          borderRadius: 8,
          padding: "14px 16px",
          fontFamily: "'Fira Code', monospace",
          fontSize: 11,
          color: "#A8D8A8",
          lineHeight: 1.7,
          whiteSpace: "pre",
          overflowX: "auto",
          maxHeight: 300,
          overflow: "auto",
        }}
      >
        {code}
      </div>
      <button
        onClick={() => copyCode(id, code)}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          background: copied === id ? T.green : T.surfaceHover,
          border: `1px solid ${T.border}`,
          color: copied === id ? "#fff" : T.textMuted,
          borderRadius: 6,
          padding: "4px 10px",
          fontSize: 11,
          cursor: "pointer",
          fontFamily: "inherit",
          fontWeight: 600,
          transition: "all 0.15s",
        }}
      >
        {copied === id ? "✓ Copied" : "Copy"}
      </button>
    </div>
  );

  const METHOD_STEPS = {
    csv: {
      label: "Method A — CSV Export & Import",
      badge: "Easiest",
      badgeColor: "green",
      desc: "Best for: small teams, occasional imports, no technical setup needed.",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              {
                n: 1,
                title: "Create your Google Form",
                body: 'Build a Google Form with the question titles below. Add a dropdown question titled exactly: "Which project is this feedback for?" with these choices:',
              },
              {
                n: 2,
                title: "Link to Google Sheets",
                body: "In your form: Responses tab → click the Google Sheets icon → Create a new spreadsheet. This stores all responses automatically.",
              },
              {
                n: 3,
                title: "Export CSV",
                body: "Open the linked Sheet → File → Download → CSV. The column headers must match the template below.",
              },
              {
                n: 4,
                title: "Import here",
                body: "Use the Import CSV panel below to upload the CSV. The system will match rows to projects by project code.",
              },
            ].map((step) => (
              <div key={step.n} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: T.accentSoft,
                    color: T.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 13,
                    flexShrink: 0,
                  }}
                >
                  {step.n}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: T.textPrimary, fontSize: 13, marginBottom: 4 }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: 12, color: T.textSecondary, lineHeight: 1.6 }}>{step.body}</div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", marginBottom: 8, letterSpacing: "0.05em" }}>
              Required Question Titles for Participant Form
            </div>
            <div
              style={{
                background: "rgba(0,0,0,0.3)",
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                padding: "12px 14px",
                fontFamily: "monospace",
                fontSize: 11,
                color: T.green,
                lineHeight: 2,
              }}
            >
{`Which project is this feedback for?   → project_code
Overall Satisfaction (1-5)            → satisfaction_overall
Content Quality (1-5)                 → content_quality
Logistics & Organisation (1-5)        → logistics_org
Communication (1-5)                   → communication
Timing (1-5)                          → timing
Gained Useful Info (1-5)              → gained_useful
Would you recommend us? (0-10)        → recommend_0_10
What was the best part?               → best_part
What could be improved?               → improve
Issue Category                        → issue_category
Permission to use as quote?           → permission_quote`}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Download CSV Templates
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[["participants", "Participant Feedback"], ["stakeholders", "Stakeholder Feedback"], ["internal", "Internal Review"]].map(([t, l]) => (
                <Button key={t} variant="secondary" icon="↓" size="sm" onClick={() => downloadCSV(t)}>
                  {l}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", marginBottom: 8, letterSpacing: "0.05em" }}>
              Import CSV File
            </div>

            <Card style={{ padding: 16 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", marginBottom: 6, display: "block" }}>
                    Type
                  </label>
                  <select
                    value={importType}
                    onChange={(e) => setImportType(e.target.value)}
                    style={{
                      background: T.surfaceHover,
                      border: `1px solid ${T.border}`,
                      color: T.textPrimary,
                      borderRadius: 8,
                      padding: "8px 12px",
                      fontSize: 13,
                      width: "100%",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    <option value="participants">Participant Feedback</option>
                    <option value="stakeholders">Stakeholder Feedback</option>
                    <option value="internal">Internal Review</option>
                  </select>
                </div>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "9px 16px",
                    border: `1px solid ${T.border}`,
                    borderRadius: 8,
                    cursor: "pointer",
                    color: T.textSecondary,
                    fontSize: 13,
                    background: T.surfaceHover,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  <input type="file" accept=".csv" onChange={handleFileUpload} style={{ display: "none" }} />
                  ↑ Upload CSV
                </label>
              </div>
            </Card>
          </div>
        </div>
      ),
    },
    script: {
      label: "Method B — Apps Script Auto-Sync",
      badge: "Recommended",
      badgeColor: "accent",
      desc: "Best for: regular events, automatic project dropdown updates, no manual CSV exports needed.",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[
            {
              n: 1,
              title: "Open your Google Form's linked Sheet",
              body: "Make sure your form is linked to a Google Sheet. Open the Sheet, then go to Extensions → Apps Script.",
            },
            {
              n: 2,
              title: "Paste the Auto-Dropdown script",
              body: "Copy the script below and paste it in the Apps Script editor. Replace YOUR_GOOGLE_FORM_ID_HERE with your form ID.",
            },
            {
              n: 3,
              title: "Run updateProjectDropdown()",
              body: "Click Run. The dropdown question in your form will now show all current KSA projects as options.",
            },
            {
              n: 4,
              title: "Set up daily auto-refresh",
              body: "Run createDailyTrigger() once to automatically keep the project list updated every morning.",
            },
          ].map((step) => (
            <div key={step.n} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: T.accentSoft,
                  color: T.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                {step.n}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: T.textPrimary, fontSize: 13, marginBottom: 4 }}>
                  {step.title}
                </div>
                <div style={{ fontSize: 12, color: T.textSecondary, lineHeight: 1.6 }}>{step.body}</div>
              </div>
            </div>
          ))}

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", marginBottom: 4, letterSpacing: "0.05em" }}>
              Apps Script — Auto-Dropdown Updater
            </div>
            <CodeBlock id="appsscript" code={appsScriptCode} />
          </div>
        </div>
      ),
    },
    webhook: {
      label: "Method C — Real-Time Webhook",
      badge: "Most Powerful",
      badgeColor: "purple",
      desc: "Best for: production use with Supabase backend.",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              padding: "12px 16px",
              background: T.purpleSoft,
              border: `1px solid rgba(139,92,246,0.3)`,
              borderRadius: 8,
              fontSize: 12,
              color: T.purple,
              fontWeight: 600,
            }}
          >
            ⚡ This method requires the Supabase backend to be deployed.
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", marginBottom: 4, letterSpacing: "0.05em" }}>
              Apps Script — Webhook Sender
            </div>
            <CodeBlock id="webhook" code={webhookCode} />
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", marginBottom: 4, letterSpacing: "0.05em" }}>
              Supabase Edge Function
            </div>
            <CodeBlock id="edgefn" code={supabaseEdgeFn} />
          </div>
        </div>
      ),
    },
  };

  const methods = [
    { id: "csv", label: "A — CSV Import", badge: "Easiest", badgeColor: "green" },
    { id: "script", label: "B — Apps Script", badge: "Recommended", badgeColor: "accent" },
    { id: "webhook", label: "C — Webhook", badge: "Most Powerful", badgeColor: "purple" },
  ];

  return (
    <div>
      <h1 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 800, color: T.textPrimary }}>Google Forms Integration</h1>
      <p style={{ margin: "0 0 24px", color: T.textMuted, fontSize: 13 }}>
        Three methods to connect Google Forms feedback to KSA Kit — choose the one that fits your setup.
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {methods.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveMethod(m.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              borderRadius: 10,
              border: `1px solid ${activeMethod === m.id ? T.accent : T.border}`,
              background: activeMethod === m.id ? T.accentSoft : "transparent",
              color: activeMethod === m.id ? T.accent : T.textSecondary,
              fontWeight: activeMethod === m.id ? 700 : 500,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
          >
            {m.label} <Badge color={activeMethod === m.id ? m.badgeColor : "gray"} size="sm">{m.badge}</Badge>
          </button>
        ))}
      </div>

      {Object.entries(METHOD_STEPS).map(
        ([id, method]) =>
          id === activeMethod && (
            <div key={id}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: T.textPrimary }}>{method.label}</h2>
                <Badge color={methods.find((m) => m.id === id)?.badgeColor}>
                  {methods.find((m) => m.id === id)?.badge}
                </Badge>
              </div>

              <p style={{ margin: "0 0 20px", fontSize: 13, color: T.textSecondary, lineHeight: 1.6 }}>
                {method.desc}
              </p>

              <Card>{method.content}</Card>
            </div>
          )
      )}

      {importPreview && (
        <Modal open={true} onClose={() => setImportPreview(null)} title="Import Preview" width={660}>
          <div style={{ marginBottom: 14, display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ color: T.textSecondary, fontSize: 13 }}>{importPreview.rows.length} rows</span>
            <Badge color="green">{importPreview.rows.filter((r) => r._valid).length} valid</Badge>
            {importPreview.rows.filter((r) => !r._valid).length > 0 && (
              <Badge color="red">{importPreview.rows.filter((r) => !r._valid).length} errors</Badge>
            )}
          </div>

          <div
            style={{
              maxHeight: 300,
              overflow: "auto",
              marginBottom: 16,
              border: `1px solid ${T.border}`,
              borderRadius: 8,
            }}
          >
            {importPreview.rows.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  padding: "8px 12px",
                  borderBottom: `1px solid rgba(37,43,59,0.5)`,
                  fontSize: 12,
                  background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                }}
              >
                <span style={{ color: r._valid ? T.green : T.red, fontSize: 14, width: 16, textAlign: "center" }}>
                  {r._valid ? "✓" : "✗"}
                </span>
                <span style={{ color: T.textMuted, width: 36, flexShrink: 0 }}>L{r._line}</span>
                <span style={{ color: T.textSecondary, flex: 1 }}>{r.project_code || "—"}</span>
                {r._valid ? <Badge color="green">{r._project}</Badge> : <Badge color="red">{r._error}</Badge>}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button variant="secondary" onClick={() => setImportPreview(null)}>
              Cancel
            </Button>
            <Button onClick={confirmImport} disabled={importPreview.rows.filter((r) => r._valid).length === 0}>
              Import {importPreview.rows.filter((r) => r._valid).length} Row
              {importPreview.rows.filter((r) => r._valid).length !== 1 ? "s" : ""}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── PAGE: INSIGHTS ───────────────────────────────────────────────────────────
function InsightsPage({ data, setData, addToast, setSelectedProject, setPage }) {
  const handleBulkRegen = () => {
    const newInsights = { ...data.insights };
    data.projects.forEach((p) => {
      const gen = generateInsights(p.id, data);
      if (gen) newInsights[p.id] = { ...gen, last_generated_at: new Date().toISOString() };
    });
    setData((d) => ({ ...d, insights: newInsights }));
    addToast("All insights regenerated", "success");
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: T.textPrimary }}>Insights</h1>
        <Button icon="↺" onClick={handleBulkRegen} variant="secondary">
          Regenerate All
        </Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {data.projects.map((p) => {
          const ins = data.insights[p.id];
          const kpis = calcProjectKPIs(p.id, data);
          return (
            <Card
              key={p.id}
              hover
              onClick={() => {
                setSelectedProject(p.id);
                setPage("project-detail");
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, color: T.textPrimary }}>{p.name}</span>
                    <StatusBadge status={p.status} />
                    <ScoreBadge score={kpis?.overall} />
                  </div>
                  {ins?.generated_summary ? (
                    <p style={{ margin: 0, color: T.textMuted, fontSize: 12, lineHeight: 1.6 }}>
                      {ins.generated_summary}
                    </p>
                  ) : (
                    <span style={{ fontSize: 12, color: T.textMuted }}>No insights yet</span>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                  <Badge color={ins ? "green" : "gray"}>{ins ? "Generated" : "Pending"}</Badge>
                  {ins?.last_generated_at && (
                    <span style={{ fontSize: 10, color: T.textMuted }}>
                      {new Date(ins.last_generated_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── PAGE: FEEDBACK (Global) ──────────────────────────────────────────────────
function FeedbackPage({ data }) {
  const [tab, setTab] = useState("Participants");
  const [projectFilter, setProjectFilter] = useState("");

  const pf = data.feedbackParticipants.filter((f) => !projectFilter || f.project_id === projectFilter);
  const sf = data.feedbackStakeholders.filter((f) => !projectFilter || f.project_id === projectFilter);
  const enrichPF = pf.map((f) => ({ ...f, projectName: data.projects.find((p) => p.id === f.project_id)?.name }));
  const enrichSF = sf.map((f) => ({ ...f, projectName: data.projects.find((p) => p.id === f.project_id)?.name }));

  return (
    <div>
      <h1 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 800, color: T.textPrimary }}>Feedback</h1>

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ minWidth: 200 }}>
          <Input
            options={["", ...data.projects.map((p) => p.name)]}
            value={data.projects.find((p) => p.id === projectFilter)?.name || ""}
            onChange={(v) => {
              const p = data.projects.find((p) => p.name === v);
              setProjectFilter(p?.id || "");
            }}
            placeholder="Filter by project…"
          />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {["Participants", "Stakeholders"].map((t) => (
            <Button key={t} size="sm" variant={tab === t ? "primary" : "secondary"} onClick={() => setTab(t)}>
              {t}
            </Button>
          ))}
        </div>
      </div>

      {tab === "Participants" ? (
        <Card style={{ padding: 0 }}>
          <Table
            columns={[
              { key: "projectName", label: "Project", render: (v) => <span style={{ fontWeight: 600, color: T.textPrimary, fontSize: 12 }}>{v}</span> },
              { key: "response_date", label: "Date" },
              { key: "satisfaction_overall", label: "Overall", render: (v) => <ScoreBadge score={v * 20} /> },
              { key: "content_quality", label: "Content" },
              { key: "logistics_org", label: "Logistics" },
              { key: "recommend_0_10", label: "NPS Score" },
              { key: "issue_category", label: "Issue", render: (v) => <Badge color="yellow">{v}</Badge> },
              { key: "permission_quote", label: "Quote OK", render: (v) => <Badge color={v ? "green" : "gray"}>{v ? "Yes" : "No"}</Badge> },
            ]}
            rows={enrichPF}
          />
        </Card>
      ) : (
        <Card style={{ padding: 0 }}>
          <Table
            columns={[
              { key: "projectName", label: "Project", render: (v) => <span style={{ fontWeight: 600, color: T.textPrimary, fontSize: 12 }}>{v}</span> },
              { key: "response_date", label: "Date" },
              { key: "satisfaction", label: "Satisfaction", render: (v) => <ScoreBadge score={v * 20} /> },
              { key: "professionalism", label: "Professionalism" },
              { key: "value_to_stakeholder", label: "Value" },
              { key: "collaborate_again", label: "Collaborate Again", render: (v) => <Badge color={v ? "green" : "red"}>{v ? "Yes" : "No"}</Badge> },
            ]}
            rows={enrichSF}
          />
        </Card>
      )}
    </div>
  );
}

// ─── PAGE: INTERNAL REVIEW (Global) ──────────────────────────────────────────
function InternalReviewPage({ data }) {
  const [projectFilter, setProjectFilter] = useState("");
  const reviews = data.internalReviews.filter((r) => !projectFilter || r.project_id === projectFilter);
  const enriched = reviews.map((r) => ({
    ...r,
    projectName: data.projects.find((p) => p.id === r.project_id)?.name,
  }));

  return (
    <div>
      <h1 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 800, color: T.textPrimary }}>Internal Reviews</h1>

      <div style={{ minWidth: 220, marginBottom: 16 }}>
        <Input
          options={["", ...data.projects.map((p) => p.name)]}
          value={data.projects.find((p) => p.id === projectFilter)?.name || ""}
          onChange={(v) => {
            const p = data.projects.find((p) => p.name === v);
            setProjectFilter(p?.id || "");
          }}
        />
      </div>

      <Card style={{ padding: 0 }}>
        <Table
          columns={[
            { key: "projectName", label: "Project", render: (v) => <span style={{ fontWeight: 600, color: T.textPrimary, fontSize: 12 }}>{v}</span> },
            { key: "review_date", label: "Date" },
            { key: "objective_alignment", label: "Objective", render: (v) => <ScoreBadge score={v * 20} /> },
            { key: "execution_quality", label: "Execution", render: (v) => <ScoreBadge score={v * 20} /> },
            { key: "team_coordination", label: "Team", render: (v) => <ScoreBadge score={v * 20} /> },
            { key: "risk_management", label: "Risk Mgmt", render: (v) => <ScoreBadge score={v * 20} /> },
            {
              key: "went_well",
              label: "Went Well",
              render: (v) => (
                <span
                  style={{
                    fontSize: 11,
                    color: T.textSecondary,
                    maxWidth: 200,
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {v || "—"}
                </span>
              ),
            },
            {
              key: "controllable",
              label: "Controllable",
              render: (v) => <Badge color={v === "controllable" ? "green" : v === "not_controllable" ? "red" : "yellow"}>{v}</Badge>,
            },
          ]}
          rows={enriched}
        />
      </Card>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ allMembers, onLogin, addToast }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLogin = () => {
    if (!username || !password) {
      setLoginError("Please enter both username and password.");
      return;
    }

    const normalizedUsername = username.trim().toLowerCase();

    // Admin login
    if (normalizedUsername === "zinwar") {
      if (password !== "12345678") {
        setLoginError("Password is wrong for admin.");
        return;
      }
      setLoginError("");
      onLogin({ id: "admin", name: "Zinwar Zardasht", role: "admin", username: "zinwar" });
      addToast("Welcome Admin!", "success");
      return;
    }

    // Member login - username is first name
    const member = allMembers.find((m) => m.name.split(" ")[0].toLowerCase() === normalizedUsername && m.is_active);
    if (!member) {
      setLoginError("Member is not assigned or is inactive.");
      return;
    }

    if (password !== "12345678") {
      setLoginError("Password is wrong.");
      return;
    }

    setLoginError("");
    onLogin({ id: member.id, name: member.name, role: "member", username: normalizedUsername });
    addToast(`Welcome ${member.name}!`, "success");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0A0C14 0%, #111827 50%, #1F2937 100%)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Background Effects */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 60% 40%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)
          `,
          animation: "float 20s ease-in-out infinite",
        }}
      />

      {/* Floating Orbs */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "15%",
          width: "200px",
          height: "200px",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(40px)",
          animation: "pulse 4s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "10%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(50px)",
          animation: "pulse 6s ease-in-out infinite reverse",
        }}
      />

      {/* Grid Pattern */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          opacity: 0.3,
        }}
      />

      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Branding Side */}
        <div
          style={{
            flex: "0 0 60%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px 100px",
            position: "relative",
          }}
        >
          {/* Floating Stat Cards */}
          <div
            style={{
              position: "absolute",
              top: "20%",
              right: "15%",
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              animation: "float 8s ease-in-out infinite",
            }}
          >
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#3B82F6", marginBottom: "4px" }}>247</div>
            <div style={{ fontSize: "12px", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Active Projects</div>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: "25%",
              right: "20%",
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              animation: "float 10s ease-in-out infinite reverse",
            }}
          >
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#10B981", marginBottom: "4px" }}>98.5%</div>
            <div style={{ fontSize: "12px", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Success Rate</div>
          </div>

          <div
            style={{
              position: "absolute",
              top: "75%",
              left: "10%",
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              animation: "float 12s ease-in-out infinite",
            }}
          >
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#8B5CF6", marginBottom: "4px" }}>1,429</div>
            <div style={{ fontSize: "12px", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Tasks Completed</div>
          </div>

          {/* Main Branding */}
          <div style={{ maxWidth: "500px" }}>
            <div
              style={{
                fontSize: "48px",
                fontWeight: "900",
                background: "linear-gradient(135deg, #F1F5F9 0%, #CBD5E1 50%, #94A3B8 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "16px",
                lineHeight: "1.1",
              }}
            >
              KSA PROJECTS & ACTIVTIES PORTAL
            </div>

            <div
              style={{
                fontSize: "18px",
                color: "#64748B",
                marginBottom: "24px",
                fontWeight: "500",
                lineHeight: "1.6",
              }}
            >
              Project Intelligence • Team Management • Analytics & Insights
            </div>

            <div
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#F1F5F9",
                marginBottom: "32px",
                lineHeight: "1.3",
              }}
            >
              Transforming Activities into
              <span
                style={{
                  background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {" "}Measurable Results
              </span>
            </div>

            <div
              style={{
                fontSize: "16px",
                color: "#94A3B8",
                lineHeight: "1.7",
                maxWidth: "400px",
              }}
            >
              Streamline project workflows, track performance metrics, and drive team collaboration with our comprehensive management platform designed for modern organizations.
            </div>
          </div>
        </div>

        {/* Login Form Side */}
        <div
          style={{
            flex: "0 0 40%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "400px",
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "24px",
              padding: "48px 40px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
              position: "relative",
            }}
          >
            {/* Glassmorphism highlight */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "1px",
                background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)",
                borderRadius: "24px 24px 0 0",
              }}
            />

            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  color: "#F1F5F9",
                  margin: "0 0 8px",
                }}
              >
                Welcome Back
              </h2>
              <p style={{ fontSize: "14px", color: "#94A3B8", margin: 0 }}>
                Sign in to access your dashboard
              </p>
            </div>

            {loginError && (
              <div
                style={{
                  marginBottom: "24px",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#F87171",
                  fontSize: "13px",
                  fontWeight: "500",
                  textAlign: "center",
                }}
              >
                {loginError}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#CBD5E1",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "8px",
                  }}
                >
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "#F1F5F9",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(59, 130, 246, 0.5)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.12)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <p style={{ fontSize: "11px", color: "#64748B", marginTop: "6px" }}>
                  Use your first name (lowercase)
                </p>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#CBD5E1",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "8px",
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "#F1F5F9",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(59, 130, 246, 0.5)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.12)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    width: "16px",
                    height: "16px",
                    accentColor: "#3B82F6",
                    cursor: "pointer",
                  }}
                />
                <label
                  htmlFor="remember"
                  style={{
                    fontSize: "14px",
                    color: "#CBD5E1",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  Remember me
                </label>
              </div>

              <Button
                onClick={handleLogin}
                style={{
                  width: "100%",
                  padding: "16px",
                  fontSize: "16px",
                  fontWeight: "600",
                  background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                  border: "none",
                  borderRadius: "12px",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 20px rgba(59, 130, 246, 0.3)",
                  marginTop: "8px",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 30px rgba(59, 130, 246, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 20px rgba(59, 130, 246, 0.3)";
                }}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }

          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.05); }
          }
        `}
      </style>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [toasts, setToasts] = useState([]);

  const [data, setData] = useState({
    ...SEED,
    insights: { ...SEED.insights },
    keywordMap: [...SEED.keywordMap],
  });

  const addToast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3000);
  }, []);

  const loadState = useCallback(async () => {
    try {
      const res = await fetch('/api/state');
      const json = await res.json();

      if (json.data?.data) {
        const savedData = JSON.parse(json.data.data);
        const savedUser = json.data.user ? JSON.parse(json.data.user) : null;
        setData({ ...SEED, ...savedData, insights: { ...SEED.insights, ...savedData.insights } });
        setUser(savedUser);
        addToast('App data loaded from central server', 'success');
      } else {
        addToast('Central state not found, starting with local seed data', 'info');
      }
    } catch (e) {
      console.error('Failed to load remote state:', e);
      addToast('Could not load centralized data; using local data', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const saveState = useCallback(async (nextData, nextUser) => {
    try {
      const res = await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: nextData, user: nextUser }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to save state');
      }
      console.log('✓ App state saved in central server');
    } catch (e) {
      console.error('Failed to save central state:', e);
      addToast('Could not save to central server', 'error');
    }
  }, [addToast]);

  useEffect(() => {
    loadState();
  }, [loadState]);

  useEffect(() => {
    if (loading) return;
    saveState(data, user);
  }, [data, user, loading, saveState]);

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      setUser(null);
      setPage("home");
      addToast("Logged out successfully", "success");
    }
  };

  const isAdmin = user?.role === "admin";

  const pageProps = { data, setData, addToast, setPage, setSelectedProject, user, isAdmin };

  if (loading) {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'grid', placeItems: 'center', fontSize: 18, color: '#E2E8F0' }}>
        Loading centralized data...
      </div>
    );
  }

  if (!user) {
    return <LoginPage allMembers={data.teamMembers} onLogin={setUser} addToast={addToast} />;
  }

  return (
    <div
      className="app-shell"
      style={{
        background: T.bgGradient,
        color: T.textPrimary,
        position: "relative",
      }}
    >
      {/* Background Effects */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, ${T.accentGlow} 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, ${T.purpleGlow} 0%, transparent 50%),
            radial-gradient(circle at 60% 40%, ${T.cyanGlow} 0%, transparent 50%)
          `,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Sidebar
        active={page === "project-detail" ? "projects" : page}
        onChange={(p) => setPage(p)}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
        user={user}
        onLogout={handleLogout}
        isAdmin={isAdmin}
      />

      <div className="app-main" style={{ position: "relative", zIndex: 1 }}>
        {page === "home" && <HomePage {...pageProps} />}
        {page === "projects" && <ProjectsPage {...pageProps} />}
        {page === "project-detail" && selectedProject && (
          <ProjectDetailPage {...pageProps} projectId={selectedProject} />
        )}
        {page === "team" && <TeamPage {...pageProps} />}
        {page === "tasks" && <TasksPage {...pageProps} />}
        {page === "feedback" && <FeedbackPage {...pageProps} />}
        {page === "internal" && <InternalReviewPage {...pageProps} />}
        {page === "insights" && <InsightsPage {...pageProps} />}
        {page === "dashboard" && <DashboardPage {...pageProps} />}
        {page === "settings" && <SettingsPage {...pageProps} />}
        {page === "integrations" && <IntegrationsPage {...pageProps} />}
      </div>

      <Toast toasts={toasts} />
    </div>
  );
}