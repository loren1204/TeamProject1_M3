import React, { useState } from "react";
import {
  BookOpen,
  ClipboardList,
  Target,
  Flame,
  ArrowRight,
  Clock,
  CheckCircle2,
  Atom,
  FlaskConical,
  Leaf,
  Lightbulb,
  Activity,
  TrendingUp,
  RotateCcw,
  Check,
  Play,
  FileText,
  ChartNoAxesCombined,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { useDemo } from "./store";
import {
  topics,
  practiceQuestion,
  PracticeQuestion,
  activity,
  helpLevels,
} from "./data";
import { effectiveLevel } from "./agent";
import {
  Badge,
  Button,
  Card,
  Heading,
  SectionTitle,
  Progress,
  Field,
  Empty,
} from "./components";
export function StudentDashboard({
  navigate,
  openTutor,
  startPractice,
}: {
  navigate: (v: string) => void;
  openTutor: (id: string) => void;
  startPractice: (t: string) => void;
}) {
  const { state } = useDemo();
  const a = state.assignments[0];
  const events = state.events;
  return (
    <>
      <Heading
        title="Welcome back, Jordan"
        subtitle="Ready to continue learning? Pick up where you left off."
        kicker="YOUR LEARNING WORKSPACE"
      />
      <div className="metrics">
        <Metric
          icon={BookOpen}
          label="Active Courses"
          value="3"
          detail="A semester of possibilities"
        />
        <Metric
          icon={ClipboardList}
          label="Assignments in Progress"
          value="2"
          detail="One step at a time"
        />
        <Metric
          icon={CheckCircle2}
          label="Practice Sessions Completed"
          value={String(14 + events.length)}
          detail={`${events.length} new in this browser`}
        />
        <Metric
          icon={Target}
          label="Weekly Study Goal"
          value="68%"
          detail="Just a little more progress"
          progress
        />
      </div>
      <div className="dashboard-grid">
        <div>
          <Card className="continue-card">
            <div className="continue-icon">
              <Atom size={27} />
            </div>
            <div className="continue-copy">
              <div className="kicker">PICK UP WHERE YOU LEFT OFF</div>
              <h2>Physics I — Newton’s Laws</h2>
              <p>
                A little clarity. A little confidence. Your next step is here.
              </p>
              <div className="progress-with-label">
                <Progress value={68} />
                <span>68%</span>
              </div>
            </div>
            <Button onClick={() => openTutor("hw2")}>
              Continue Learning
              <ArrowRight size={16} />
            </Button>
          </Card>
          <SectionTitle
            title="On your desk"
            action={
              <button
                className="text-link"
                onClick={() => navigate("Assignments")}
              >
                All assignments
                <ArrowRight size={14} />
              </button>
            }
          />
          <Card className="latest-assignment">
            <div className="assignment-top">
              <span className="course-tag">PHY 2048 · PHYSICS I</span>
              <Badge tone="amber">In progress</Badge>
            </div>
            <h2>{a.title}</h2>
            <p>Problem 3 · Block on an incline</p>
            <div className="assignment-bottom">
              <span>
                <Clock size={14} />
                Due{" "}
                {new Date(a.due + "T12:00:00").toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <Badge tone="blue">
                {helpLevels[effectiveLevel(state.policy, a) - 1]}
              </Badge>
              <button className="text-link" onClick={() => openTutor(a.id)}>
                Open assignment
                <ArrowRight size={15} />
              </button>
            </div>
          </Card>
          <SectionTitle
            title="A good place to focus"
            subtitle="Recommendations based on simulated learning history"
          />
          <div className="recommendations">
            {[
              "Force Components",
              "Free-Body Diagrams",
              "Newton’s Laws",
              "Inclined Planes",
            ].map((x, i) => (
              <Card key={x}>
                <span className={"practice-icon tint-" + i}>
                  {i === 0 ? (
                    <ChartNoAxesCombined size={20} />
                  ) : i === 1 ? (
                    <FileText size={20} />
                  ) : i === 2 ? (
                    <Atom size={20} />
                  ) : (
                    <TrendingUp size={20} />
                  )}
                </span>
                <h3>
                  {x === "Force Components"
                    ? "Understanding Force Components"
                    : x === "Free-Body Diagrams"
                      ? "Drawing Free-Body Diagrams"
                      : x === "Inclined Planes"
                        ? "Inclined Plane Problems"
                        : "Newton’s Second Law"}
                </h3>
                <p>{[12, 10, 15, 15][i]} min · Guided practice</p>
                <button className="text-link" onClick={() => startPractice(x)}>
                  Start Practice
                  <ArrowRight size={14} />
                </button>
              </Card>
            ))}
          </div>
        </div>
        <aside>
          <Card className="study-goal">
            <SectionTitle
              title="Your weekly goal"
              action={<Flame size={19} />}
            />
            <div className="goal-ring">
              <svg viewBox="0 0 140 140" aria-hidden="true">
                <circle
                  cx="70"
                  cy="70"
                  r="58"
                  fill="none"
                  stroke="#edf0f8"
                  strokeWidth="9"
                />
                <circle
                  cx="70"
                  cy="70"
                  r="58"
                  fill="none"
                  stroke="#3359c7"
                  strokeWidth="9"
                  strokeDasharray="248 365"
                  strokeLinecap="round"
                  transform="rotate(-90 70 70)"
                />
              </svg>
              <div>
                <b>68%</b>
                <span>of your weekly goal</span>
              </div>
            </div>
            <p>
              You’re building a habit.
              <br />
              Keep showing up for yourself.
            </p>
            <Badge>3.4 of 5 hours · simulated</Badge>
          </Card>
          <Card className="recent-card">
            <SectionTitle title="Recent activity" />
            <div className="timeline">
              {[
                ...events.map((e) => ({
                  label: e.label,
                  time: "This session",
                })),
                {
                  label: "Practiced force components",
                  time: "Today · 10:42 AM",
                },
                {
                  label: "Reviewed free-body diagrams",
                  time: "Today · 9:15 AM",
                },
                {
                  label: "Completed an inclined-plane exercise",
                  time: "Yesterday",
                },
                {
                  label: "Received feedback on sign conventions",
                  time: "Yesterday",
                },
              ]
                .slice(0, 5)
                .map((e, i) => (
                  <div key={i}>
                    <span className="timeline-dot" />
                    <div>
                      <b>{e.label}</b>
                      <small>{e.time}</small>
                    </div>
                  </div>
                ))}
            </div>
            <Badge>Simulated history + local attempts</Badge>
          </Card>
        </aside>
      </div>
    </>
  );
}
export function Metric({
  icon: Icon,
  label,
  value,
  detail,
  progress = false,
  change,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  detail?: string;
  progress?: boolean;
  change?: string;
}) {
  return (
    <Card className="metric">
      <div>
        <span>{label}</span>
        <Icon size={18} />
      </div>
      <strong>{value}</strong>
      {change ? (
        <p className={"change " + (change.includes("Up") ? "up" : "")}>
          {change} <span>vs. previous period</span>
        </p>
      ) : (
        <p>{detail}</p>
      )}
      {progress && <Progress value={68} />}
    </Card>
  );
}
export function StudentCourses({
  openTutor,
}: {
  openTutor: (id: string) => void;
}) {
  const { state, set } = useDemo();
  return (
    <>
      <Heading
        title="My Courses"
        subtitle="Your courses, materials, and learning conversations in one place."
      />
      <div className="course-list">
        {[
          {
            name: "Physics I",
            code: "PHY 2048",
            icon: Atom,
            color: "blue",
            teacher: "Dr. Chen",
            topic: "Newton’s Laws",
            progress: 68,
          },
          {
            name: "Chemistry II",
            code: "CHM 2046",
            icon: FlaskConical,
            color: "purple",
            teacher: "Dr. Rivera",
            topic: "Chemical equilibrium",
            progress: 42,
          },
          {
            name: "Biology I",
            code: "BSC 1010",
            icon: Leaf,
            color: "green",
            teacher: "Dr. Patel",
            topic: "Cell structure",
            progress: 51,
          },
        ].map((c) => (
          <Card key={c.name}>
            <div className={"course-avatar " + c.color}>
              <c.icon size={26} />
            </div>
            <span className="kicker">{c.code} · FALL 2026</span>
            <h2>{c.name}</h2>
            <p>{c.teacher} · Simulated course</p>
            <div className="course-description">{c.topic}</div>
            <Progress value={c.progress} />
            <div className="course-bottom">
              <span>{c.progress}% explored</span>
              <Button
                variant="outline"
                onClick={() => {
                  set((s) => ({ ...s, course: c.name }));
                  openTutor("hw2");
                }}
              >
                {c.name === "Physics I" ? "Continue course" : "Explore demo"}
                <ArrowRight size={15} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
      {state.course !== "Physics I" && (
        <p className="notice">
          Physics I is the central fully developed demonstration course. Other
          course cards illustrate the semester workspace.
        </p>
      )}
    </>
  );
}
export function StudentAssignments({
  openTutor,
}: {
  openTutor: (id: string) => void;
}) {
  const { state } = useDemo();
  const [filter, setFilter] = useState("All assignments");
  return (
    <>
      <Heading
        title="Assignments"
        subtitle="Bring your questions. Build your own understanding."
        action={
          <select
            aria-label="Filter assignments"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All assignments</option>
            <option>Graded</option>
            <option>Practice</option>
          </select>
        }
      />
      <div className="assignment-list">
        {state.assignments
          .filter((a) => filter === "All assignments" || a.type === filter)
          .map((a) => (
            <Card key={a.id}>
              <div className="assignment-row">
                <div className="assignment-icon">
                  <ClipboardList size={22} />
                </div>
                <div>
                  <span className="kicker">
                    PHYSICS I · {a.type.toUpperCase()}
                  </span>
                  <h2>{a.title}</h2>
                  <p>
                    Due{" "}
                    {new Date(a.due + "T12:00:00").toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    · {a.status}
                  </p>
                </div>
                <div className="assignment-row-end">
                  <Badge tone="blue">
                    {helpLevels[effectiveLevel(state.policy, a) - 1]}
                  </Badge>
                  <Button onClick={() => openTutor(a.id)}>
                    Open workspace
                    <ArrowRight size={15} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </>
  );
}
export function Practice({ initialTopic }: { initialTopic: string }) {
  const { state, set, notify } = useDemo();
  const [topic, setTopic] = useState(initialTopic || topics[0]);
  const [difficulty, setDifficulty] = useState("Beginner");
  const [index, setIndex] = useState(0);
  const [q, setQ] = useState<PracticeQuestion | null>(null);
  const [attempt, setAttempt] = useState("");
  const [hint, setHint] = useState(false);
  const [result, setResult] = useState<null | boolean>(null);
  const [explained, setExplained] = useState(false);
  const [recorded, setRecorded] = useState<number | null>(null);
  const [validation, setValidation] = useState("");
  function generate() {
    setQ(practiceQuestion(topic, difficulty, index));
    setIndex((i) => i + 1);
    setAttempt("");
    setHint(false);
    setResult(null);
    setExplained(false);
    setRecorded(null);
    setValidation("");
  }
  function check() {
    const v = attempt.trim();
    if (!q || !v) {
      setValidation("Write an attempt before checking your answer.");
      return;
    }
    const matches = (v.split(/[=≈]/).pop() || v).match(/[-+]?\d*\.?\d+/);
    if (!matches) {
      setValidation("Include your numerical result so the demo can check it.");
      return;
    }
    setValidation("");
    const correct =
      Math.abs(Number(matches[0]) - q.answer) <
      Math.max(0.06, Math.abs(q.answer) * 0.02);
    setResult(correct);
    const id = recorded || Date.now();
    const event = {
      id,
      label: `Practiced ${topic.toLowerCase()}`,
      topic,
      correct,
      date: new Date().toISOString(),
    };
    set((s) => ({
      ...s,
      events: recorded
        ? s.events.map((e) => (e.id === id ? event : e))
        : [...s.events, event],
    }));
    setRecorded(id);
    notify("Practice progress updated in this browser.");
  }
  return (
    <>
      <Heading
        title="Practice at Your Own Pace"
        subtitle="Build confidence with problems tailored to what you’re learning."
      />
      <div className="practice-layout">
        <Card>
          <SectionTitle
            title="What would you like to work on?"
            subtitle="Choose a concept and a comfortable starting point."
          />
          <div className="topic-grid">
            {topics.map((t) => (
              <button
                key={t}
                className={"topic " + (topic === t ? "selected" : "")}
                onClick={() => setTopic(t)}
              >
                <Atom size={19} />
                {t}
                {topic === t && <Check size={16} />}
              </button>
            ))}
          </div>
          <Field label="Difficulty">
            <div className="segmented">
              {["Beginner", "Intermediate", "Advanced"].map((d) => (
                <button
                  key={d}
                  className={difficulty === d ? "selected" : ""}
                  onClick={() => setDifficulty(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </Field>
          <Button onClick={generate}>
            <Lightbulb size={16} />
            Generate Practice Problem
          </Button>
          <p className="micro muted">
            Curated sample problems · no live model generation
          </p>
        </Card>
        <Card className="practice-progress">
          <Target size={26} />
          <h2>Your practice journey</h2>
          <strong>{14 + state.events.length}</strong>
          <p>Sessions completed</p>
          <Badge tone="green">
            {state.events.filter((e) => e.correct).length} correct local
            attempts
          </Badge>
          <p className="small muted">
            14 simulated baseline sessions, plus your recorded practice
            attempts.
          </p>
        </Card>
      </div>
      {q && (
        <Card className="practice-problem">
          <div className="section-title">
            <h2>Your next challenge</h2>
            <Badge tone="blue">
              {difficulty} · {topic}
            </Badge>
          </div>
          <p className="problem-statement">{q.statement}</p>
          <Field
            label="Your attempt"
            hint={`Include a numerical result and units (${q.unit}). Demo answer checking uses a 2% tolerance.`}
          >
            <textarea
              value={attempt}
              onChange={(e) => setAttempt(e.target.value)}
              placeholder="Sketch your approach, then write your result…"
              rows={4}
            />
          </Field>
          {validation && (
            <p role="alert" className="validation">
              {validation}
            </p>
          )}
          <div className="button-row">
            <Button variant="outline" onClick={() => setHint(!hint)}>
              <Lightbulb size={15} />
              Request Hint
            </Button>
            <Button onClick={check} disabled={!attempt.trim()}>
              Check Answer
              <CheckCircle2 size={15} />
            </Button>
            {result !== null && (
              <Button variant="ghost" onClick={() => setExplained(!explained)}>
                Explanation
                <Chevron />
              </Button>
            )}
          </div>
          {hint && (
            <div className="notice">
              <b>A small nudge</b>
              <p>{q.hint}</p>
            </div>
          )}
          {result !== null && (
            <div
              className={"answer-feedback " + (result ? "correct" : "retry")}
              role="status"
            >
              <b>
                {result
                  ? "Your numerical result is on track."
                  : "Let’s revisit your setup."}
              </b>
              <p>
                {result
                  ? `Check that you included ${q.unit} and can explain each step.`
                  : "Check the governing relationship, the angle or direction, and your units. Try again or open the explanation."}
              </p>
            </div>
          )}
          {explained && (
            <div className="notice">
              <h3>Walk through the reasoning</h3>
              <p>{q.explanation}</p>
            </div>
          )}
        </Card>
      )}
    </>
  );
}
function Chevron() {
  return <ArrowRight size={15} />;
}
export function StudyHistory() {
  const { state } = useDemo();
  const data = activity.map((d, i) => ({
    ...d,
    sessions: d.sessions + (i === 3 ? state.events.length : 0),
  }));
  return (
    <>
      <Heading
        title="Your learning, over time"
        subtitle="Notice the small steps. They add up."
        action={<Badge>Simulated baseline + local attempts</Badge>}
      />
      <div className="metrics">
        <Metric
          icon={CheckCircle2}
          label="Practice sessions"
          value={String(14 + state.events.length)}
          detail="14 baseline + your attempts"
        />
        <Metric
          icon={BookOpen}
          label="Concepts explored"
          value="4"
          detail="Foundations worth building"
        />
        <Metric
          icon={TrendingUp}
          label="Showing improvement"
          value="2 areas"
          detail="Simulated study observations"
        />
        <Metric
          icon={Target}
          label="Recommended for review"
          value="2 concepts"
          detail="Force components · signs"
        />
      </div>
      <Card>
        <SectionTitle
          title="Study activity"
          subtitle="Illustrative sessions this week; current attempts are added to Thursday."
        />
        <div
          className="chart-box"
          role="img"
          aria-label={
            "Sessions by day: " +
            data.map((x) => x.day + " " + x.sessions).join(", ")
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="study-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4068cd" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#4068cd" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#eceef3" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area
                isAnimationActive={!state.compact}
                type="monotone"
                dataKey="sessions"
                stroke="#355dc5"
                strokeWidth={2.5}
                fill="url(#study-fill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <SectionTitle title="Concepts you’re building" />
      <div className="recommendations">
        {topics.slice(0, 4).map((t, i) => (
          <Card key={t}>
            <Atom size={21} />
            <h3>{t}</h3>
            <Badge tone={i < 2 ? "green" : "amber"}>
              {i < 2 ? "Showing improvement" : "Worth another look"}
            </Badge>
            <p>Illustrative learning observation</p>
          </Card>
        ))}
      </div>
      <Card className="history-events">
        <SectionTitle title="Recorded practice attempts" />
        {state.events.length ? (
          state.events
            .slice()
            .reverse()
            .map((e) => (
              <div className="history-row" key={e.id}>
                <Activity size={16} />
                <div>
                  <b>{e.label}</b>
                  <small>{new Date(e.date).toLocaleString()}</small>
                </div>
                <Badge tone={e.correct ? "green" : "amber"}>
                  {e.correct ? "Correct result" : "Review suggested"}
                </Badge>
              </div>
            ))
        ) : (
          <p className="muted">
            No local attempts yet. Complete a practice question to start your
            history.
          </p>
        )}
        <p className="micro muted">
          These are learning activity records, not predictions of academic
          performance.
        </p>
      </Card>
    </>
  );
}
