import React, { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  FileText,
  Lightbulb,
  MessageCircle,
  BookOpen,
  RefreshCw,
  Send,
  Paperclip,
  Upload,
  ChevronDown,
  ChevronRight,
  TriangleAlert,
  Check,
  PanelRightClose,
  PanelRightOpen,
  GraduationCap,
  Link2,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";
import { useDemo } from "./store";
import { initialMessages, helpLevels } from "./data";
import { effectiveLevel, respond, TutorAction } from "./agent";
import { Badge, Button, Card, Diagram, Empty } from "./components";
const feedback = [
  [
    "Missing force components",
    "Try breaking the gravitational force into components parallel and perpendicular to the incline.",
    "Draw a right triangle with mg as the hypotenuse. The parallel component lies opposite the incline angle.",
  ],
  [
    "Check sign convention",
    "Make sure the positive direction of your coordinate system is consistent throughout the problem.",
    "Choose down the incline as positive. Keep that choice when writing forces, acceleration, and your final direction.",
  ],
  [
    "Include units",
    "Remember to include appropriate units in your final expression.",
    "Acceleration has units of m/s². A newton is kg·m/s², so force divided by mass has the correct dimensions.",
  ],
];
export default function Tutor({
  assignmentId,
  onPractice,
}: {
  assignmentId: string;
  onPractice: () => void;
}) {
  const { state, set } = useDemo();
  const a =
    state.assignments.find((x) => x.id === assignmentId) ||
    state.assignments[0];
  const level = effectiveLevel(state.policy, a);
  const [chat, setChat] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [workOpen, setWorkOpen] = useState(true);
  const [workflow, setWorkflow] = useState(false);
  const [sources, setSources] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [sample, setSample] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(true);
  const [busy, setBusy] = useState<number[]>([]);
  const [expanded, setExpanded] = useState<number[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    if (a.id === "hw2") setChat(initialMessages);
    else
      setChat([
        {
          role: "ai",
          text: `Let’s work through ${a.title} together. What do you know so far, and what is the first principle you think applies?`,
        },
      ]);
    setAnalyzed(a.id === "hw2");
    setSample(a.id === "hw2");
  }, [a.id]);
  useEffect(() => {
    bottom.current?.scrollIntoView({
      behavior: state.compact ? "instant" : "smooth",
      block: "nearest",
    });
  }, [chat, thinking]);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  function send(action: TutorAction = "message", message = input) {
    if (thinking) return;
    if (action === "message" && !message.trim()) return;
    const labels = {
      message: message.trim(),
      question: "Ask me a guiding question.",
      hint: "Can I get a small hint?",
      concept: "Help me understand the concept.",
      practice: "Generate a similar practice problem.",
    };
    const result = respond({
      message: labels[action],
      action,
      assignment: a,
      policy: state.policy,
      materials: state.materials,
      hasDiagram: sample || !!file,
      turn: chat.filter((m) => m.role === "ai").length,
    });
    setChat((c) => [...c, { role: "student", text: labels[action] }]);
    setInput("");
    setThinking(true);
    timers.current.push(
      setTimeout(() => {
        setChat((c) => [...c, { role: "ai", text: result.text }]);
        if (a.analytics)
          set((s) => ({
            ...s,
            tutorEvents: [
              ...s.tutorEvents,
              { assignmentId: a.id, level: result.level, at: Date.now() },
            ],
          }));
        setThinking(false);
      }, 650),
    );
  }
  function upload(f?: File) {
    if (!f) return;
    setError("");
    if (!/\.(png|jpe?g|pdf)$/i.test(f.name)) {
      setError(
        "We couldn’t preview this file. Try uploading a supported PNG, JPG, or PDF.",
      );
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("Please choose a file smaller than 10 MB.");
      return;
    }
    setFile(f);
    setSample(false);
    setAnalyzed(false);
    setPreview(f.type.startsWith("image/") ? URL.createObjectURL(f) : "");
    if (f.type === "application/pdf")
      setError(
        "PDF selected. Inline preview is unavailable; sample feedback can still be demonstrated.",
      );
  }
  function recheck() {
    setAnalyzing(true);
    setAnalyzed(false);
    timers.current.push(
      setTimeout(() => {
        setAnalyzing(false);
        setAnalyzed(true);
        setBusy([0, 1, 2]);
      }, 1000),
    );
  }
  if (!state.course)
    return (
      <Empty
        title="Select a course to begin learning."
        body="Choose a course from the course selector above."
      />
    );
  return (
    <div className={"tutor-grid " + (!workOpen ? "closed" : "")}>
      <div className="tutor-main">
        <div className="tutor-heading">
          <div>
            <div className="breadcrumb-inline">
              {state.course}
              <ChevronRight size={13} />
              {a.id === "hw2" ? "Homework 2" : a.title.split(":")[0]}
              <ChevronRight size={13} />
              Problem {a.id === "hw2" ? "3" : "1"}
            </div>
            <h1>Let’s work through it.</h1>
            <div className="status-row">
              <Badge tone="blue">Help Level: {helpLevels[level - 1]}</Badge>
              <span className="rule-tooltip" tabIndex={0}>
                <ShieldCheck size={14} />
                Instructor Rules Active
                <span className="tooltip">
                  This assignment allows {helpLevels[level - 1].toLowerCase()}.
                  Complete graded solutions are restricted. Course and
                  assignment settings both apply.
                </span>
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => setWorkOpen(!workOpen)}
            aria-label={
              workOpen ? "Collapse your work panel" : "Open your work panel"
            }
          >
            {workOpen ? (
              <PanelRightClose size={18} />
            ) : (
              <PanelRightOpen size={18} />
            )}
          </Button>
        </div>
        <Card className="assignment-context">
          <div className="assignment-icon">
            <FileText size={21} />
          </div>
          <div>
            <div className="context-eyebrow">
              {a.type === "Graded" ? "GRADED HOMEWORK" : a.type.toUpperCase()}
              <span>
                Due{" "}
                {new Date(a.due + "T12:00:00").toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <h2>
              {a.id === "hw2" ? "Problem 3: Block on an Incline" : a.title}
            </h2>
            <p>{a.description}</p>
            <div className="context-meta">
              <span>{state.course}</span>
              <i /> <span>{a.title.split(":")[0]}</span>
              <i />
              <span>{helpLevels[level - 1]} allowed</span>
            </div>
          </div>
        </Card>
        <div className="chat-top">
          <span>
            <Sparkles size={15} /> Your learning conversation
          </span>
          <Badge>Simulated AI</Badge>
        </div>
        <div className="conversation" aria-live="polite" role="log">
          {chat.map((m, i) => (
            <div className={"message " + m.role} key={i}>
              <div className="message-avatar">
                {m.role === "ai" ? (
                  <img src="/assets/mascot.png" alt="Instruct.AI" />
                ) : (
                  "JS"
                )}
              </div>
              <div className="message-content">
                <div className="message-name">
                  {m.role === "ai" ? "Instruct.AI" : "You"}
                  <span>{m.role === "ai" ? "Learning companion" : ""}</span>
                </div>
                <p>{m.text}</p>
                {m.role === "ai" && i === chat.length - 1 && a.sources && (
                  <button
                    className="text-link source-link"
                    onClick={() => setSources(!sources)}
                  >
                    <Link2 size={12} />
                    {
                      state.materials.filter((x) => x.status === "Approved")
                        .length
                    }{" "}
                    approved reference
                    {state.materials.filter((x) => x.status === "Approved")
                      .length !== 1
                      ? "s"
                      : ""}
                    <ChevronDown size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="thinking">
              <LoaderCircle className="spin" size={15} />
              Preparing a simulated {helpLevels[level - 1].toLowerCase()}{" "}
              response…
            </div>
          )}
          <div ref={bottom} />
        </div>
        {sources && (
          <div className="source-panel">
            <SectionHeading label="Approved source references" />
            <p>
              Demo reference list only. Uploaded content is not semantically
              indexed.
            </p>
            {state.materials
              .filter((m) => m.status === "Approved")
              .map((m) => (
                <div key={m.id}>
                  <FileText size={14} />
                  {m.name}
                  <Badge tone="green">Approved</Badge>
                </div>
              ))}
            {!state.materials.some((m) => m.status === "Approved") && (
              <p>
                No approved materials yet. Ask your instructor to approve course
                documents.
              </p>
            )}
          </div>
        )}
        <div className="composer-area">
          <div className="tutor-actions">
            <button onClick={() => send("question")} disabled={thinking}>
              <MessageCircle size={14} />
              Guiding Question
            </button>
            <button onClick={() => send("hint")} disabled={thinking}>
              <Lightbulb size={14} />
              Give Me a Hint
            </button>
            <button onClick={() => send("concept")} disabled={thinking}>
              <BookOpen size={14} />
              Explain Concept
            </button>
            <button
              onClick={() => send("practice")}
              disabled={thinking || !a.analogous}
              title={!a.analogous ? "Disabled by instructor" : undefined}
            >
              <RefreshCw size={14} />
              Similar Practice
            </button>
          </div>
          <form
            className="composer"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <textarea
              aria-label="Message to tutor"
              placeholder="Ask a question or tell me what you’re thinking..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={2}
              maxLength={4000}
            />
            <div>
              <button
                className="icon-button"
                type="button"
                disabled={!a.diagram}
                aria-label="Attach diagram"
                onClick={() => {
                  setWorkOpen(true);
                  fileRef.current?.click();
                }}
              >
                <Paperclip size={18} />
              </button>
              <span>Shift + Enter for a new line</span>
              <button
                className="send"
                disabled={!input.trim() || thinking}
                aria-label="Send message"
              >
                <Send size={17} />
              </button>
            </div>
          </form>
          <div className="composer-foot">
            <ShieldCheck size={12} />
            Designed to guide your reasoning, one step at a time.
            <span>Simulated responses</span>
          </div>
        </div>
        <button
          className="workflow-toggle"
          aria-expanded={workflow}
          onClick={() => setWorkflow(!workflow)}
        >
          <Sparkles size={14} />
          How Instruct.AI Helps
          <ChevronDown size={14} />
        </button>
        {workflow && (
          <div className="workflow">
            <p>Demonstrated workflow · no live model or retrieval calls.</p>
            {[
              "Understand assignment context",
              "Check instructor rules",
              "Retrieve approved course content",
              "Identify learning difficulty",
              "Choose tutoring strategy",
              "Guide and reassess",
            ].map((x, i) => (
              <span key={x}>
                <b>{i + 1}</b>
                {x}
              </span>
            ))}
            <p>Current teaching preference: {state.policy.instructions}</p>
          </div>
        )}
      </div>
      {workOpen && (
        <aside className="work-panel">
          <div className="work-heading">
            <h2>Your Work</h2>
            <Badge>Problem {a.id === "hw2" ? "3" : "1"}</Badge>
          </div>
          <p className="muted small">Your thinking deserves a closer look.</p>
          <input
            ref={fileRef}
            className="sr-only"
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={(e) => {
              upload(e.target.files?.[0]);
              e.target.value = "";
            }}
            aria-label="Upload diagram"
          />
          {a.diagram ? (
            <>
              <div
                className="upload-zone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  upload(e.dataTransfer.files[0]);
                }}
              >
                <Upload size={20} />
                <b>Drop your work here</b>
                <span>PNG, JPG or PDF · up to 10 MB</span>
                <button
                  className="text-link"
                  onClick={() => fileRef.current?.click()}
                >
                  Browse files
                </button>
              </div>
              {error && (
                <p className="validation" role="alert">
                  {error}
                </p>
              )}
              <div className="diagram-preview">
                {preview ? (
                  <img
                    src={preview}
                    alt={"Your uploaded work: " + file?.name}
                    onError={() => {
                      setPreview("");
                      setError(
                        "We couldn’t preview this file. Try uploading a supported format.",
                      );
                    }}
                  />
                ) : sample ? (
                  <Diagram />
                ) : file ? (
                  <div className="file-preview">
                    <FileText size={32} />
                    <p>{file.name}</p>
                  </div>
                ) : (
                  <div className="file-preview">
                    <p>No work uploaded yet.</p>
                  </div>
                )}
              </div>
              <div className="file-caption">
                <FileText size={13} />
                <span>
                  {sample
                    ? "incline_diagram_sample.png"
                    : file?.name || "No file selected"}
                </span>
                {(sample || file) && <Check size={13} />}
              </div>
              <button
                className="text-link use-sample"
                onClick={() => {
                  setSample(true);
                  setFile(null);
                  setPreview("");
                  setError("");
                  setAnalyzed(true);
                }}
              >
                Use sample diagram
              </button>
            </>
          ) : (
            <div className="empty-inline">
              Diagram uploads are disabled for this assignment.
            </div>
          )}
          <div className="analysis-heading">
            <h2>Work Analysis</h2>
            <Badge tone="amber">Simulated</Badge>
          </div>
          <p className="muted micro">
            Predefined feedback, independent of the uploaded file.
          </p>
          {analyzing ? (
            <div className="analysis-loading">
              <LoaderCircle className="spin" />
              <p>Reviewing your work…</p>
              <small>Simulating the feedback workflow</small>
            </div>
          ) : analyzed ? (
            <div className="feedback-list">
              {feedback.map(([title, body, more], i) => (
                <div
                  className={"feedback " + (busy.includes(i) ? "revealed" : "")}
                  key={title}
                >
                  <TriangleAlert size={15} />
                  <div>
                    <h3>
                      {i + 1}. {title}
                    </h3>
                    <p>{body}</p>
                    <button
                      className="text-link"
                      aria-expanded={expanded.includes(i)}
                      onClick={() =>
                        setExpanded((e) =>
                          e.includes(i) ? e.filter((n) => n !== i) : [...e, i],
                        )
                      }
                    >
                      Learn {expanded.includes(i) ? "less" : "more"}
                      <ChevronDown size={12} />
                    </button>
                    {expanded.includes(i) && (
                      <p className="more-feedback">{more}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-inline">
              Choose a file or sample, then recheck to see the demonstration
              feedback.
            </div>
          )}
          <Button
            variant="outline full"
            onClick={recheck}
            disabled={analyzing || (!sample && !file)}
          >
            <RefreshCw className={analyzing ? "spin" : ""} size={15} />
            {analyzing ? "Reviewing your work…" : "Recheck My Work"}
          </Button>
          <p className="disclaimer">
            AI feedback is intended to support learning and does not replace
            instructor evaluation.
          </p>
          <div className="work-tip">
            <GraduationCap size={20} />
            <div>
              <b>The goal isn’t just the answer.</b>
              <p>It’s knowing how to get there.</p>
            </div>
          </div>
          <button className="text-link" onClick={onPractice}>
            Open practice workspace
            <ArrowRight size={14} />
          </button>
        </aside>
      )}
    </div>
  );
}
function SectionHeading({ label }: { label: string }) {
  return <h3>{label}</h3>;
}
