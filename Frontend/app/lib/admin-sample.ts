export type SessionStatus = "Completed" | "Active" | "Interrupted" | "Failed";
export type TraineeStatus = "Completed" | "In Progress" | "Needs Review";

export interface SessionRecord {
  id: string;
  date: string;
  duration: string;
  scenario: string;
  score: number;
  status: SessionStatus;
}

export interface SkillScore {
  skill: string;
  score: number;
  applicable: boolean;
}

export interface TraineeRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  registered: string;
  instructor: string;
  status: TraineeStatus;
  sessionCount: number;
  latestScore: number;
  scoreTrend: number[];
  recentSessions: SessionRecord[];
  skills: SkillScore[];
  feedback: string;
  aiPatterns: { pattern: string; confidence: number; adjustment: string }[];
  notes: { date: string; author: string; text: string }[];
}

export const ADMIN_KPIS = [
  { label: "Total Trainees", value: "128", note: "Registered profiles" },
  { label: "Active Sessions", value: "06", note: "Currently training" },
  { label: "Average Score", value: "78%", note: "Across completed sessions" },
  { label: "Assessments Pending", value: "09", note: "Awaiting instructor review" },
];

export const SESSIONS_PER_WEEK = {
  labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7"],
  values: [14, 18, 21, 19, 26, 31, 34],
};

export const SKILL_AVERAGES = [
  { skill: "Flight control", score: 81 },
  { skill: "Task performance", score: 76 },
  { skill: "Error analysis", score: 72 },
  { skill: "Detection", score: 68 },
  { skill: "Classification", score: 63 },
  { skill: "Decision-making", score: 70 },
];

export const TRAINEES: TraineeRecord[] = [
  {
    id: "TR-001",
    name: "Maya Chen",
    email: "maya.chen@example.com",
    phone: "+1 555 0101",
    registered: "12 Jan 2026",
    instructor: "Dana Whitfield",
    status: "Completed",
    sessionCount: 12,
    latestScore: 86,
    scoreTrend: [58, 61, 63, 66, 70, 72, 74, 77, 79, 81, 84, 86],
    recentSessions: [
      { id: "S-2011", date: "08 Oct 2026", duration: "09:40", scenario: "Obstacle Course · Gusty Wind", score: 86, status: "Completed" },
      { id: "S-1997", date: "03 Oct 2026", duration: "08:55", scenario: "Obstacle Course · Gusty Wind", score: 84, status: "Completed" },
      { id: "S-1984", date: "28 Sep 2026", duration: "10:12", scenario: "Waypoint Navigation", score: 81, status: "Completed" },
      { id: "S-1970", date: "22 Sep 2026", duration: "07:30", scenario: "Hover & Takeoff", score: 79, status: "Interrupted" },
      { id: "S-1962", date: "17 Sep 2026", duration: "09:05", scenario: "Waypoint Navigation", score: 77, status: "Completed" },
    ],
    skills: [
      { skill: "Flight control", score: 88, applicable: true },
      { skill: "Position accuracy", score: 84, applicable: true },
      { skill: "Orientation stability", score: 86, applicable: true },
      { skill: "Task completion", score: 90, applicable: true },
      { skill: "Error avoidance", score: 79, applicable: true },
      { skill: "Detection", score: 0, applicable: false },
      { skill: "Classification", score: 0, applicable: false },
    ],
    feedback: "Strong hover and waypoint control. Reduce overcorrection in gusts.",
    aiPatterns: [
      { pattern: "Overcorrection after gust onset", confidence: 0.84, adjustment: "Keep Intermediate; add gust variety" },
      { pattern: "Consistent speed profile", confidence: 0.91, adjustment: "None" },
    ],
    notes: [
      { date: "08 Oct 2026", author: "Dana Whitfield", text: "Good recovery on the second gate. Practise yaw holds." },
      { date: "01 Oct 2026", author: "Dana Whitfield", text: "Ready to attempt Threat Detection after one more gust session." },
    ],
  },
  {
    id: "TR-002",
    name: "Omar Haddad",
    email: "omar.haddad@example.com",
    phone: "+1 555 0102",
    registered: "03 Feb 2026",
    instructor: "Dana Whitfield",
    status: "In Progress",
    sessionCount: 8,
    latestScore: 64,
    scoreTrend: [41, 44, 49, 52, 55, 58, 61, 64],
    recentSessions: [
      { id: "S-2041", date: "16 Oct 2026", duration: "08:42", scenario: "Obstacle Course · Gusty Wind", score: 64, status: "Active" },
      { id: "S-2029", date: "13 Oct 2026", duration: "09:18", scenario: "Obstacle Course · Gusty Wind", score: 61, status: "Completed" },
      { id: "S-2016", date: "09 Oct 2026", duration: "06:50", scenario: "Hover & Takeoff", score: 58, status: "Completed" },
      { id: "S-2003", date: "05 Oct 2026", duration: "05:12", scenario: "Hover & Takeoff", score: 55, status: "Failed" },
      { id: "S-1995", date: "01 Oct 2026", duration: "07:03", scenario: "Hover & Takeoff", score: 52, status: "Completed" },
    ],
    skills: [
      { skill: "Flight control", score: 71, applicable: true },
      { skill: "Position accuracy", score: 66, applicable: true },
      { skill: "Orientation stability", score: 60, applicable: true },
      { skill: "Task completion", score: 68, applicable: true },
      { skill: "Error avoidance", score: 58, applicable: true },
      { skill: "Detection", score: 0, applicable: false },
      { skill: "Classification", score: 0, applicable: false },
    ],
    feedback: "Improving steadily. Focus on altitude hold before adding obstacles.",
    aiPatterns: [
      { pattern: "Altitude drift above 2 m during turns", confidence: 0.78, adjustment: "Repeat Hover & Takeoff with wind off" },
      { pattern: "Late correction on roll", confidence: 0.71, adjustment: "Hold difficulty at Beginner" },
    ],
    notes: [
      { date: "13 Oct 2026", author: "Dana Whitfield", text: "Altitude control is the main gap. Run hover drills before the next obstacle run." },
    ],
  },
  {
    id: "TR-003",
    name: "Priya Nair",
    email: "priya.nair@example.com",
    phone: "+1 555 0103",
    registered: "21 Nov 2025",
    instructor: "Marcus Hale",
    status: "Completed",
    sessionCount: 15,
    latestScore: 91,
    scoreTrend: [60, 64, 67, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 89, 91],
    recentSessions: [
      { id: "S-2038", date: "15 Oct 2026", duration: "11:20", scenario: "Threat Detection · Low Light", score: 91, status: "Completed" },
      { id: "S-2025", date: "11 Oct 2026", duration: "10:05", scenario: "Threat Detection · Low Light", score: 89, status: "Completed" },
      { id: "S-2012", date: "07 Oct 2026", duration: "09:33", scenario: "Night Navigation · Sensor Degraded", score: 88, status: "Completed" },
      { id: "S-1999", date: "02 Oct 2026", duration: "10:48", scenario: "Night Navigation · Sensor Degraded", score: 86, status: "Completed" },
      { id: "S-1986", date: "27 Sep 2026", duration: "12:02", scenario: "Threat Detection · Low Light", score: 84, status: "Interrupted" },
    ],
    skills: [
      { skill: "Flight control", score: 92, applicable: true },
      { skill: "Position accuracy", score: 90, applicable: true },
      { skill: "Orientation stability", score: 89, applicable: true },
      { skill: "Task completion", score: 93, applicable: true },
      { skill: "Error avoidance", score: 85, applicable: true },
      { skill: "Detection", score: 88, applicable: true },
      { skill: "Classification", score: 84, applicable: true },
    ],
    feedback: "Excellent detection timing. Keep classification confidence checks in the debrief.",
    aiPatterns: [
      { pattern: "Fast threat detection under low light", confidence: 0.93, adjustment: "Raise to Advanced" },
      { pattern: "Occasional classification hesitation", confidence: 0.67, adjustment: "Add one decoy scenario" },
    ],
    notes: [
      { date: "15 Oct 2026", author: "Marcus Hale", text: "Ready for the Advanced evaluation block." },
    ],
  },
  {
    id: "TR-004",
    name: "Lukas Berger",
    email: "lukas.berger@example.com",
    phone: "+1 555 0104",
    registered: "08 Oct 2026",
    instructor: "Marcus Hale",
    status: "Needs Review",
    sessionCount: 3,
    latestScore: 48,
    scoreTrend: [39, 45, 48],
    recentSessions: [
      { id: "S-2034", date: "14 Oct 2026", duration: "04:10", scenario: "Hover & Takeoff", score: 48, status: "Failed" },
      { id: "S-2022", date: "12 Oct 2026", duration: "03:55", scenario: "Hover & Takeoff", score: 45, status: "Interrupted" },
      { id: "S-2008", date: "10 Oct 2026", duration: "03:02", scenario: "Hover & Takeoff", score: 39, status: "Failed" },
    ],
    skills: [
      { skill: "Flight control", score: 52, applicable: true },
      { skill: "Position accuracy", score: 45, applicable: true },
      { skill: "Orientation stability", score: 41, applicable: true },
      { skill: "Task completion", score: 50, applicable: true },
      { skill: "Error avoidance", score: 38, applicable: true },
      { skill: "Detection", score: 0, applicable: false },
      { skill: "Classification", score: 0, applicable: false },
    ],
    feedback: "Two failed takeoffs with repeated boundary warnings. Instructor review requested.",
    aiPatterns: [
      { pattern: "Repeated boundary violations on takeoff", confidence: 0.88, adjustment: "Hold at Beginner; review tutorial" },
    ],
    notes: [
      { date: "14 Oct 2026", author: "Marcus Hale", text: "Schedule a manual review before the next attempt." },
    ],
  },
];

export const LIVE_SESSIONS = [
  { id: "S-2041", trainee: "Omar Haddad", traineeId: "TR-002", instructor: "Dana Whitfield", scenario: "Obstacle Course · Gusty Wind", elapsed: "08:42", status: "Running", alert: "Altitude deviation above 2 m at 06:10" },
  { id: "S-2042", trainee: "Ethan Brooks", traineeId: "TR-009", instructor: "Marcus Hale", scenario: "Waypoint Navigation", elapsed: "12:03", status: "Running", alert: "None" },
  { id: "S-2043", trainee: "Aiko Tanaka", traineeId: "TR-014", instructor: "Dana Whitfield", scenario: "Threat Detection · Low Light", elapsed: "05:27", status: "Telemetry lag", alert: "Telemetry delayed by 1.8 s" },
];

export const LIVE_TELEMETRY = {
  speed: "11.8 m/s",
  altitude: "34.6 m",
  roll: "-2.1°",
  pitch: "1.4°",
  yaw: "178.4°",
  boundary: "Inside",
};

export const LIVE_EVENTS = [
  { time: "06:10", event: "Altitude deviation above 2 m", kind: "Warning" },
  { time: "04:52", event: "Gate 2 passed", kind: "Task" },
  { time: "02:31", event: "Gust onset · 4 m/s", kind: "Scenario" },
];

export const INTERVENTION_LOG = [
  { time: "11 Oct 2026 · 10:14", by: "Dana Whitfield", action: "Session paused for 40 s", reason: "Trainee requested hold" },
  { time: "09 Oct 2026 · 15:02", by: "Marcus Hale", action: "Session interrupted", reason: "Boundary violation (2 consecutive)" },
];

export const SCENARIOS = [
  { name: "Hover & Takeoff", type: "Basics tutorial", difficulty: "Beginner", drone: "Quad 250", objectives: "Hover stability, takeoff, landing", detection: "No" },
  { name: "Waypoint Navigation", type: "Scenario", difficulty: "Beginner", drone: "Quad 250", objectives: "Waypoint accuracy, speed consistency", detection: "No" },
  { name: "Obstacle Course · Gusty Wind", type: "Scenario", difficulty: "Intermediate", drone: "Hex 450", objectives: "Obstacle avoidance, gust recovery", detection: "No" },
  { name: "Threat Detection · Low Light", type: "Scenario", difficulty: "Advanced", drone: "Quad 250", objectives: "Detection time, classification, engagement decision", detection: "Yes" },
  { name: "Night Navigation · Sensor Degraded", type: "Scenario", difficulty: "Advanced", drone: "Hex 450", objectives: "Navigation under sensor noise, rule compliance", detection: "Yes" },
];

export const PENDING_ASSESSMENTS = [
  { id: "AS-311", trainee: "Lukas Berger", traineeId: "TR-004", session: "S-2034", type: "Manual review", due: "17 Oct 2026" },
  { id: "AS-309", trainee: "Omar Haddad", traineeId: "TR-002", session: "S-2029", type: "Skill assessment", due: "18 Oct 2026" },
  { id: "AS-306", trainee: "Priya Nair", traineeId: "TR-003", session: "S-2038", type: "Advanced evaluation", due: "19 Oct 2026" },
];

export const AAR_SUMMARY = {
  session: "S-2029 · Omar Haddad",
  taskCompletion: 85,
  assessmentScore: 78,
  previousScore: 61,
  timeline: [
    { time: "00:45", event: "Takeoff and hover established", kind: "Task" },
    { time: "03:12", event: "Roll oscillation above 8° for 14 s", kind: "Mistake" },
    { time: "05:40", event: "Boundary warning, corrected in 3 s", kind: "Warning" },
    { time: "08:10", event: "Obstacle avoided with 1.6 m clearance", kind: "Task" },
    { time: "09:10", event: "Landing within target zone", kind: "Task" },
  ],
};

export const REPORTS = [
  { id: "AAR-0912", trainee: "Maya Chen", session: "S-2011", generated: "08 Oct 2026", status: "Approved" },
  { id: "AAR-0915", trainee: "Omar Haddad", session: "S-2029", generated: "13 Oct 2026", status: "Draft" },
  { id: "AAR-0916", trainee: "Priya Nair", session: "S-2038", generated: "15 Oct 2026", status: "Approved" },
  { id: "AAR-0918", trainee: "Lukas Berger", session: "S-2034", generated: "14 Oct 2026", status: "Awaiting review" },
];

export const AI_DECISIONS = [
  {
    id: "AI-5102",
    trainee: "Omar Haddad",
    session: "S-2029",
    classification: "Overcorrection on gust onset",
    confidence: 0.78,
    evidence: "Roll exceeded 8° for 14 s between 03:10 and 03:24",
    difficultyBefore: "Beginner",
    difficultyAfter: "Beginner (held)",
    reason: "Altitude error persisted; difficulty kept until hover score passes 70",
    model: "behaviour-clf v1.3",
    improved: "Pending next session",
    override: "None",
  },
  {
    id: "AI-5097",
    trainee: "Priya Nair",
    session: "S-2025",
    classification: "Fast threat detection",
    confidence: 0.93,
    evidence: "Detection within 4.2 s on 6 of 7 targets",
    difficultyBefore: "Intermediate",
    difficultyAfter: "Advanced",
    reason: "Detection and classification above threshold for 3 sessions",
    model: "difficulty-adapt v0.9",
    improved: "Yes, +5 points next session",
    override: "Marcus Hale confirmed promotion",
  },
  {
    id: "AI-5090",
    trainee: "Lukas Berger",
    session: "S-2034",
    classification: "Repeated boundary violation",
    confidence: 0.88,
    evidence: "Three boundary warnings within the first 40 s of takeoff",
    difficultyBefore: "Beginner",
    difficultyAfter: "Beginner (held)",
    reason: "Insufficient stable takeoffs for progression",
    model: "behaviour-clf v1.3",
    improved: "Not yet evaluated",
    override: "Marcus Hale flagged for manual review",
  },
];

export const ROLE_ACCESS = [
  { role: "Super Admin", access: "User management, configuration, access policies and system audit" },
  { role: "Instructor", access: "Assigned trainees, session monitoring, assessments, notes and reports" },
  { role: "Evaluator", access: "Session review, scoring, AAR approval and performance comparisons" },
  { role: "Researcher", access: "Approved, anonymised datasets, metrics and experiment results" },
  { role: "Trainee", access: "Own profile, assigned training, personal results and permitted reports" },
];

export const AUDIT_LOG = [
  { time: "15 Oct 2026 · 09:41", actor: "Marcus Hale", action: "Approved AAR-0916", target: "Priya Nair" },
  { time: "14 Oct 2026 · 16:20", actor: "Dana Whitfield", action: "Added instructor note", target: "Maya Chen" },
  { time: "14 Oct 2026 · 11:03", actor: "System", action: "AI difficulty decision AI-5090 logged", target: "Lukas Berger" },
  { time: "13 Oct 2026 · 08:57", actor: "Super Admin", action: "Changed scenario difficulty", target: "Obstacle Course · Gusty Wind" },
];

export const NOTIFICATIONS = [
  { text: "Live alert: altitude deviation in S-2041", time: "2 min ago" },
  { text: "Telemetry lag on S-2043", time: "7 min ago" },
  { text: "3 assessments due this week", time: "1 h ago" },
];
