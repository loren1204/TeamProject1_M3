import React, { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Sparkles,
  Dumbbell,
  History,
  Settings,
  ChevronDown,
  Bell,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  GraduationCap,
  ShieldCheck,
  ChartNoAxesCombined,
  Files,
  Users,
  ArrowLeftRight,
  HelpCircle,
  ArrowUpRight,
  Menu,
  X,
  Play,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { useDemo } from "./store";
import { Badge, Button, Card, Heading, Modal, Toggle } from "./components";
import Tutor from "./Tutor";
import {
  StudentDashboard,
  StudentCourses,
  StudentAssignments,
  Practice,
  StudyHistory,
} from "./Student";
import {
  InstructorDashboard,
  ReasoningProfile,
  AssignmentManager,
  MaterialsManager,
  InstructorCourses,
  Students,
} from "./Instructor";
const studentNav = [
  ["Dashboard", LayoutDashboard],
  ["My Courses", BookOpen],
  ["Assignments", ClipboardList],
  ["AI Tutor", Sparkles],
  ["Practice", Dumbbell],
  ["Study History", History],
  ["Settings", Settings],
] as const;
const instructorNav = [
  ["Overview", LayoutDashboard],
  ["Courses", BookOpen],
  ["Assignments", ClipboardList],
  ["AI Teaching Policies", ShieldCheck],
  ["Learning Analytics", ChartNoAxesCombined],
  ["Course Materials", Files],
  ["Students", Users],
  ["Settings", Settings],
] as const;
export default function App() {
  const { state, set, notify } = useDemo();
  const [view, setView] = useState(
    state.role === "student" ? "Dashboard" : "Overview",
  );
  const [assignment, setAssignment] = useState("hw2");
  const [practiceTopic, setPracticeTopic] = useState("");
  const [profile, setProfile] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [help, setHelp] = useState(false);
  const instructor = state.role === "instructor";
  const nav = instructor ? instructorNav : studentNav;
  function navigate(v: string) {
    setView(v);
    setMobile(false);
    setProfile(false);
    window.scrollTo(0, 0);
  }
  function switchRole(role: "student" | "instructor", tutor = false) {
    set((s) => ({ ...s, role, course: "Physics I" }));
    setProfile(false);
    navigate(
      role === "student" ? (tutor ? "AI Tutor" : "Dashboard") : "Overview",
    );
  }
  function openTutor(id: string) {
    setAssignment(id);
    set((s) => ({ ...s, course: "Physics I" }));
    navigate("AI Tutor");
  }
  function startPractice(t: string) {
    setPracticeTopic(t);
    navigate("Practice");
  }
  return (
    <div
      className={
        "application " +
        (instructor ? "instructor" : "student") +
        (state.compact ? " reduced-motion" : "")
      }
    >
      <a href="#workspace-main" className="skip-link">
        Skip to main content
      </a>
      {mobile && (
        <button
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={() => setMobile(false)}
        />
      )}
      <aside className={"sidebar " + (mobile ? "mobile-open" : "")}>
        <a
          href="#"
          className="brand"
          onClick={(e) => {
            e.preventDefault();
            navigate(instructor ? "Overview" : "Dashboard");
          }}
        >
          <span className="brand-mark">改善</span>
          <strong>
            kaizen<span>✳</span>
          </strong>
        </a>
        <div className="workspace-chip">
          <span
            className={"workspace-icon " + (instructor ? "purple" : "blue")}
          >
            <GraduationCap size={17} />
          </span>
          <div>
            <b>University Workspace</b>
            <span>Powered by Instruct.AI</span>
          </div>
          <ChevronDown size={13} />
        </div>
        <div className="nav-heading">
          {instructor ? "TEACHING WORKSPACE" : "LEARNING WORKSPACE"}
        </div>
        <nav
          aria-label={
            instructor ? "Instructor navigation" : "Student navigation"
          }
        >
          {nav.map(([name, Icon]) => (
            <button
              key={name}
              className={"nav-item " + (view === name ? "active" : "")}
              onClick={() => navigate(name)}
              aria-current={view === name ? "page" : undefined}
            >
              <Icon size={18} />
              <span>{name}</span>
              {name === "AI Tutor" && <Badge>AI</Badge>}
              {name === "Assignments" && (
                <small>{instructor ? "4" : "2"}</small>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-lower">
          <div className="reasoning-note">
            <ShieldCheck size={19} />
            <b>
              {instructor
                ? "Your expertise. Their growth."
                : "Learning, on your terms."}
            </b>
            <p>
              {instructor
                ? "Guide the assistant. Support the thinker."
                : "Guidance that respects how your instructor teaches."}
            </p>
          </div>
          <button className="sidebar-help" onClick={() => setHelp(true)}>
            <HelpCircle size={17} />
            How this demo works
            <ArrowUpRight size={13} />
          </button>
          <div className="sidebar-user">
            <span className={"avatar " + (instructor ? "purple" : "")}>
              {instructor ? "DC" : "JS"}
            </span>
            <div>
              <b>{instructor ? "Dr. Chen" : "Jordan Smith"}</b>
              <span>
                {instructor
                  ? "Instructor · Physics Department"
                  : "Student · Physics I"}
              </span>
            </div>
            <button
              className="icon-button"
              aria-label="Open sidebar profile menu"
              onClick={() => setProfile(!profile)}
            >
              <ChevronDown size={15} />
            </button>
          </div>
        </div>
      </aside>
      <div className="app-main">
        <header className="topbar">
          <div className="header-left">
            <button
              className="icon-button mobile-menu"
              aria-label="Open navigation"
              onClick={() => setMobile(!mobile)}
            >
              <Menu size={20} />
            </button>
            <span className="header-breadcrumb">
              {instructor ? "Instructor" : "Student"} Portal <span>/</span>
              <b>{view}</b>
            </span>
          </div>
          <div className="top-controls">
            <Badge tone={instructor ? "purple" : "blue"}>
              {instructor ? "Instructor" : "Student"} view
            </Badge>
            <span className="semester">Fall 2026</span>
            <button
              className={
                "icon-button notification " + (notifications ? "selected" : "")
              }
              aria-label="Notifications"
              onClick={() => setNotifications(!notifications)}
            >
              <Bell size={18} />
              <i />
            </button>
            <button
              className="profile-button"
              onClick={() => setProfile(!profile)}
              aria-label="Open profile menu"
              aria-expanded={profile}
            >
              <span className={"avatar " + (instructor ? "purple" : "")}>
                {instructor ? "DC" : "JS"}
              </span>
              <ChevronDown size={13} />
            </button>
          </div>
          {notifications && (
            <div className="notification-menu">
              <h3>You’re all caught up.</h3>
              <p>
                {instructor
                  ? "Your Physics I teaching profile is ready for review."
                  : "Homework 2 is available. Your instructor allows guided support."}
              </p>
              <Badge>Simulated notification</Badge>
              <button
                className="text-link"
                onClick={() => setNotifications(false)}
              >
                Dismiss
              </button>
            </div>
          )}
          {profile && (
            <div className="profile-menu">
              <b>{instructor ? "Dr. Chen" : "Jordan Smith"}</b>
              <span>
                {instructor ? "Physics Department" : "Physics I"} · Simulated
                profile
              </span>
              <div className="menu-label">EXPLORE THE DEMO AS</div>
              <button
                className={!instructor ? "selected" : ""}
                onClick={() => switchRole("student")}
              >
                <GraduationCap size={17} />
                Student{!instructor && <CheckCircle2 size={15} />}
              </button>
              <button
                className={instructor ? "selected" : ""}
                onClick={() => switchRole("instructor")}
              >
                <ShieldCheck size={17} />
                Instructor{instructor && <CheckCircle2 size={15} />}
              </button>
              <button onClick={() => navigate("Settings")}>
                <Settings size={16} />
                Workspace settings
              </button>
            </div>
          )}
        </header>
        <div className="demo-strip">
          <span className="demo-dot" />
          Interactive prototype<span className="strip-divider">·</span>Simulated
          profiles, AI responses, and analytics. Settings persist in this
          browser.
          <button
            onClick={() => switchRole(instructor ? "student" : "instructor")}
          >
            <ArrowLeftRight size={12} />
            Switch to {instructor ? "student" : "instructor"}
          </button>
        </div>
        <main
          id="workspace-main"
          className={"workspace " + (view === "AI Tutor" ? "tutor-view" : "")}
        >
          {!instructor ? (
            <>
              {view === "Dashboard" && (
                <StudentDashboard
                  navigate={navigate}
                  openTutor={openTutor}
                  startPractice={startPractice}
                />
              )}{" "}
              {view === "My Courses" && (
                <StudentCourses openTutor={openTutor} />
              )}{" "}
              {view === "Assignments" && (
                <StudentAssignments openTutor={openTutor} />
              )}{" "}
              {view === "AI Tutor" && (
                <Tutor
                  assignmentId={assignment}
                  onPractice={() => startPractice("Inclined Planes")}
                />
              )}{" "}
              {view === "Practice" && (
                <Practice key={practiceTopic} initialTopic={practiceTopic} />
              )}{" "}
              {view === "Study History" && <StudyHistory />}
            </>
          ) : (
            <>
              {view === "Overview" && (
                <InstructorDashboard
                  onStudent={() => switchRole("student")}
                  onPolicy={() => navigate("AI Teaching Policies")}
                />
              )}{" "}
              {view === "Courses" && (
                <InstructorCourses
                  onPolicy={() => navigate("AI Teaching Policies")}
                  onMaterials={() => navigate("Course Materials")}
                />
              )}{" "}
              {view === "Assignments" && <AssignmentManager />}{" "}
              {view === "AI Teaching Policies" && (
                <ReasoningProfile
                  onStudent={() => switchRole("student", true)}
                />
              )}{" "}
              {view === "Learning Analytics" && (
                <InstructorDashboard
                  analyticsOnly
                  onStudent={() => switchRole("student")}
                  onPolicy={() => navigate("AI Teaching Policies")}
                />
              )}{" "}
              {view === "Course Materials" && <MaterialsManager />}{" "}
              {view === "Students" && <Students />}
            </>
          )}
          {view === "Settings" && (
            <WorkspaceSettings
              onReplay={() => {
                const v = document.getElementById(
                  "intro-video",
                ) as HTMLVideoElement;
                const opening = document.getElementById("opening")!;
                opening.hidden = false;
                opening.classList.remove("done");
                v.currentTime = 0;
                v.play().catch(() =>
                  notify(
                    "Use your browser’s media controls to play the introduction.",
                  ),
                );
              }}
            />
          )}
        </main>
        <footer>
          <span>
            <ShieldCheck size={12} />
            Thoughtful guidance. Independent thinking.
          </span>
          <span>改善 · A little better, every day.</span>
        </footer>
      </div>
      {help && (
        <Modal
          title="A learning workspace, together."
          onClose={() => setHelp(false)}
        >
          <Badge tone="blue">INTERACTIVE PROTOTYPE</Badge>
          <p>
            Explore the student portal as Jordan Smith and the instructor portal
            as Dr. Chen. Profiles, history, and analytics are simulated.
          </p>
          <ol className="demo-scenarios">
            <li>
              <b>Learn with guidance.</b> Open Homework 2, request a hint, use a
              sample diagram, and try a practice question.
            </li>
            <li>
              <b>Teach with intention.</b> Switch to Instructor, edit the
              Professor Reasoning Profile, save, and preview the updated student
              experience.
            </li>
            <li>
              <b>Choose trusted context.</b> Add a sample course document,
              approve it, then find it in the tutor’s source references.
            </li>
          </ol>
          <p className="muted small">
            The tutor uses a deterministic policy-aware simulator. No model,
            image analysis, document indexing, real database, or real student
            data is connected.
          </p>
          <Button onClick={() => setHelp(false)}>Explore the workspace</Button>
        </Modal>
      )}
    </div>
  );
}
function WorkspaceSettings({ onReplay }: { onReplay: () => void }) {
  const { state, set, reset } = useDemo();
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      <Heading
        title="Workspace Settings"
        subtitle="Make this learning space work for you."
      />
      <Card className="settings-card">
        <h2>Appearance &amp; accessibility</h2>
        <Toggle
          label="Reduce interface motion"
          description="Minimize chart and scrolling animations. Your device’s reduced-motion preference also applies."
          checked={state.compact}
          onChange={(compact) => set((s) => ({ ...s, compact }))}
        />
        <div className="settings-row">
          <div>
            <b>Opening logo animation</b>
            <p>Play the solid-blue Kaizen introduction again.</p>
          </div>
          <Button variant="outline" onClick={onReplay}>
            <Play size={15} />
            Replay intro
          </Button>
        </div>
        <h2>Demonstration data</h2>
        <p className="muted">
          Policies, assignment settings, material metadata, and practice
          attempts are saved locally in this browser. Uploaded files stay in
          memory and are never sent to a server.
        </p>
        <Button variant="outline" onClick={() => setConfirm(true)}>
          <RotateCcw size={15} />
          Reset demonstration
        </Button>
      </Card>
      {confirm && (
        <Modal
          title="Reset all demo settings?"
          onClose={() => setConfirm(false)}
        >
          <p>
            This removes your local policy changes, uploaded material metadata,
            and practice attempt history. Original sample data will be restored.
          </p>
          <div className="modal-actions">
            <Button variant="outline" onClick={() => setConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                reset();
                setConfirm(false);
                window.location.reload();
              }}
            >
              Reset demo
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
