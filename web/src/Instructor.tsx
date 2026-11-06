import React, { useEffect, useRef, useState } from "react";
import {
  Brain,
  TriangleAlert,
  BookOpen,
  MessageCircle,
  ArrowUpRight,
  ArrowRight,
  Users,
  ShieldCheck,
  FileText,
  Upload,
  Search,
  MoreHorizontal,
  Check,
  Eye,
  SlidersHorizontal,
  Download,
  Trash2,
  CheckCircle2,
  LoaderCircle,
  Lightbulb,
  GraduationCap,
  ChevronDown,
  Plus,
  Layers,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useDemo } from "./store";
import {
  Assignment,
  Material,
  defaultPolicy,
  helpLevels,
  misconceptions,
} from "./data";
import { effectiveLevel } from "./agent";
import {
  Badge,
  Button,
  Card,
  Heading,
  SectionTitle,
  Field,
  Toggle,
  Modal,
  Empty,
} from "./components";
import { Metric } from "./Student";
export function InstructorDashboard({
  onStudent,
  onPolicy,
  analyticsOnly = false,
}: {
  onStudent: () => void;
  onPolicy: () => void;
  analyticsOnly?: boolean;
}) {
  const { state } = useDemo();
  const [period, setPeriod] = useState("Last 7 Days");
  const [detail, setDetail] = useState<string | null>(null);
  const [concept, setConcept] = useState("");
  const factors: { [key: string]: number } = {
    "Last 7 Days": 1,
    "Last 30 Days": 2.8,
    "This Semester": 6.2,
  };
  const data = misconceptions.map((x, i) => ({
    ...x,
    count:
      Math.round(x.count * factors[period]) +
      (period === "Last 7 Days" ? 0 : i * 3),
  }));
  const concepts = [
    ["Force Components", 87],
    ["Free-Body Diagrams", 64],
    ["Newton’s Second Law", 52],
    ["Inclined Planes", 49],
  ] as const;
  return (
    <>
      <Heading
        title={analyticsOnly ? "Learning Analytics" : "Course Overview"}
        subtitle="Understand how students are learning and customize how your AI assistant supports them."
        kicker="INSTRUCTOR WORKSPACE"
        action={
          <Button variant="outline" onClick={onStudent}>
            <Eye size={16} />
            View as Student
          </Button>
        }
      />
      <div className="course-toolbar">
        <span className="course-select-label">
          <AtomIcon />
          <select aria-label="Select instructor course" defaultValue="physics">
            <option value="physics">Physics I — Fall Semester</option>
          </select>
          <Badge>PHY 2048</Badge>
        </span>
        <span>
          <Users size={15} />
          218 students<Badge tone="purple">Simulated data</Badge>
        </span>
      </div>
      <div className="metrics">
        <Metric
          icon={Brain}
          label="Top Misconceptions"
          value="5"
          change="↓ Down 12%"
        />
        <Metric
          icon={TriangleAlert}
          label="High-Friction Assignments"
          value="3"
          change="↓ Down 25%"
        />
        <Metric
          icon={BookOpen}
          label="Most Requested Concepts"
          value="8"
          change="↑ Up 18%"
        />
        <Metric
          icon={MessageCircle}
          label="Unresolved Sessions"
          value="12"
          change="↓ Down 40%"
        />
      </div>
      <div className="analytics-main">
        <Card className="misconception-card">
          <SectionTitle
            title="Top Student Misconceptions"
            subtitle="Recurring learning difficulties across your course"
            action={
              <select
                aria-label="Analytics time period"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                {Object.keys(factors).map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            }
          />
          <div
            className="misconception-chart"
            role="img"
            aria-label={data
              .map((d) => `${d.name}: ${d.count} simulated requests`)
              .join("; ")}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 10, right: 24, left: 8, bottom: 0 }}
                barSize={18}
              >
                <CartesianGrid horizontal={false} stroke="#eff0f5" />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#8d91a2" }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={215}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#596079" }}
                />
                <Tooltip
                  cursor={{ fill: "#f5f3fb" }}
                  content={({ active, payload }) =>
                    active && payload?.length ? (
                      <div className="chart-tooltip">
                        <b>{payload[0].payload.name}</b>
                        <p>{payload[0].value} requests</p>
                        <small>{payload[0].payload.description}</small>
                      </div>
                    ) : null
                  }
                />
                <Bar
                  dataKey="count"
                  fill="#8c79cd"
                  radius={[0, 4, 4, 0]}
                  isAnimationActive={!state.compact}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-foot">
            <span className="legend-dot" />
            De-identified sample sessions <span>Counts are illustrative</span>
          </div>
        </Card>
        <Card className="teaching-insight">
          <div className="insight-icon">
            <Lightbulb size={22} />
          </div>
          <Badge tone="purple">TEACHING INSIGHT</Badge>
          <h2>A diagram can change the conversation.</h2>
          <p>
            Force components and missing diagrams appear together in this
            simulated dataset. A short in-class diagram exercise could help
            students connect the two.
          </p>
          <div className="insight-stat">
            <strong>31</strong>
            <span>
              sample requests about
              <br />
              force components this week
            </span>
          </div>
          <Button variant="outline" onClick={onPolicy}>
            Review teaching profile
            <ArrowRight size={15} />
          </Button>
        </Card>
      </div>
      <div className="analytics-tables">
        <Card>
          <SectionTitle
            title="High-Friction Assignments"
            subtitle="Where students are asking for more support"
          />
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Assignment</th>
                  <th>Avg. Help Requests</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {state.assignments
                  .filter((a) => a.type === "Graded")
                  .map((a, i) => (
                    <tr key={a.id}>
                      <td>
                        <button
                          className="table-link"
                          onClick={() => setDetail(a.id)}
                        >
                          {a.title}
                        </button>
                      </td>
                      <td>
                        <b>{[48, 36, 29][i]}</b>
                        <span className="mini-bar">
                          <i style={{ width: [90, 68, 54][i] + "%" }} />
                        </span>
                      </td>
                      <td>
                        <button
                          className="icon-button"
                          aria-label={"View " + a.title + " details"}
                          onClick={() => setDetail(a.id)}
                        >
                          <ArrowUpRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card>
          <SectionTitle
            title="Most Requested Concepts"
            subtitle="The ideas students return to most often"
          />
          <table>
            <thead>
              <tr>
                <th>Concept</th>
                <th>Help Requests</th>
              </tr>
            </thead>
            <tbody>
              {concepts.map(([name, count]) => (
                <tr
                  key={name}
                  className={concept === name ? "selected-row" : ""}
                >
                  <td>
                    <button
                      className="table-link"
                      onClick={() => setConcept(concept === name ? "" : name)}
                    >
                      {name}
                    </button>
                  </td>
                  <td>
                    {Math.round(count * factors[period])}
                    <button
                      className="icon-button"
                      aria-label={"Filter " + name}
                      onClick={() => setConcept(concept === name ? "" : name)}
                    >
                      <ArrowUpRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
      {concept && (
        <Card className="concept-filter">
          <SectionTitle
            title={"Focused insight: " + concept}
            action={
              <button className="text-link" onClick={() => setConcept("")}>
                Clear filter
              </button>
            }
          />
          <p>
            Related assignment: {state.assignments[0].title}. Students most
            often request help connecting the diagram to the symbolic setup.
          </p>
          <Badge tone="purple">
            {Math.round(
              (concepts.find((c) => c[0] === concept)?.[1] || 0) *
                factors[period],
            )}{" "}
            sample requests · {period}
          </Badge>
          <Button variant="ghost" onClick={() => setDetail("hw2")}>
            Inspect assignment
            <ArrowRight size={15} />
          </Button>
        </Card>
      )}
      <p className="page-footnote">
        <ShieldCheck size={13} />
        Aggregated demonstration data. No real student records or academic
        predictions.{" "}
        {state.tutorEvents.length > 0 && (
          <span>
            {" "}
            · {state.tutorEvents.length} local tutor request
            {state.tutorEvents.length === 1 ? "" : "s"} recorded with assignment
            analytics enabled.
          </span>
        )}
      </p>
      {detail && (
        <Modal
          title={
            state.assignments.find((a) => a.id === detail)?.title ||
            "Assignment details"
          }
          onClose={() => setDetail(null)}
        >
          <Badge tone="purple">Simulated assignment insight</Badge>
          <dl className="detail-list">
            <dt>Most common difficulty</dt>
            <dd>
              {detail === "hw2"
                ? "Resolving weight parallel and perpendicular to the incline."
                : detail === "hw4"
                  ? "Choosing the appropriate energy relationship."
                  : "Defining the system and tracking momentum before and after collision."}
            </dd>
            <dt>Commonly requested hints</dt>
            <dd>
              Choosing axes, identifying known variables, and writing a symbolic
              relationship before substitution.
            </dd>
            <dt>Concepts students struggle with</dt>
            <dd>
              {detail === "hw2"
                ? "Force components · Free-body diagrams · Sign conventions"
                : detail === "hw4"
                  ? "Mechanical energy · Nonconservative work · Reference height"
                  : "System boundaries · Inelastic collisions · Vector signs"}
            </dd>
            <dt>Suggested instructional follow-up</dt>
            <dd>
              Use a brief, low-stakes worked setup in class. Ask students to
              explain why each term belongs in their equation before
              calculating.
            </dd>
          </dl>
          <Button
            onClick={() => {
              setDetail(null);
              onPolicy();
            }}
          >
            Adjust teaching guidance
            <ArrowRight size={15} />
          </Button>
        </Modal>
      )}
    </>
  );
}
function AtomIcon() {
  return <GraduationCap size={19} />;
}
export function ReasoningProfile({ onStudent }: { onStudent: () => void }) {
  const { state, set, notify } = useDemo();
  const [draft, setDraft] = useState({ ...state.policy });
  const [dirty, setDirty] = useState(false);
  const [reset, setReset] = useState(false);
  function update(p: Partial<typeof draft>) {
    setDraft((d) => ({ ...d, ...p }));
    setDirty(true);
  }
  function save() {
    set((s) => ({ ...s, policy: { ...draft } }));
    setDirty(false);
    notify("Teaching profile saved. Student tutoring rules are updated.");
  }
  return (
    <>
      <Heading
        title="Professor Reasoning Profile"
        subtitle="Customize how Instruct.AI guides students through your course material and assignments."
        action={
          <Badge tone="purple">
            <ShieldCheck size={13} />
            Physics I
          </Badge>
        }
      />
      <div className="policy-layout">
        <Card className="policy-card">
          <SectionTitle
            title="How you teach. How we guide."
            subtitle="Set the reasoning habits your assistant should reinforce."
          />
          {[
            {
              key: "diagram",
              label: "Require Diagram First",
              description:
                "Students should attempt a free-body diagram before receiving additional problem-solving hints.",
            },
            {
              key: "units",
              label: "Show Units",
              description:
                "Encourage students to include units in calculations and final expressions.",
            },
            {
              key: "symbolic",
              label: "Symbolic Setup Before Substitution",
              description:
                "Guide students to establish the mathematical relationship before substituting numerical values.",
            },
            {
              key: "restrict",
              label: "Restrict Complete Homework Solutions",
              description:
                "Reinforce reasoning instead of producing complete graded homework solutions.",
            },
          ].map((r) => (
            <Toggle
              key={r.key}
              label={r.label}
              description={r.description}
              checked={draft[r.key as "diagram"]}
              onChange={(v) => update({ [r.key]: v })}
            />
          ))}
          <div className="policy-section">
            <Field label="Default assistance level">
              <select
                value={draft.level}
                onChange={(e) => update({ level: +e.target.value })}
              >
                {helpLevels.map((l, i) => (
                  <option key={l} value={i + 1}>
                    Level {i + 1} — {l}
                  </option>
                ))}
              </select>
            </Field>
            <p className="field-description">
              {
                [
                  "The assistant primarily asks guiding questions.",
                  "The assistant offers incremental hints without a complete solution.",
                  "The assistant explains concepts and supports the student’s own setup.",
                  "Full worked examples are limited to approved practice or ungraded review. Graded assignments remain capped at conceptual explanations.",
                ][draft.level - 1]
              }
            </p>
          </div>
          <Field
            label="Instructor custom instructions"
            hint="Teaching preferences are displayed in the demonstrated workflow; freeform text does not override structured assistance limits."
          >
            <textarea
              rows={5}
              value={draft.instructions}
              onChange={(e) => update({ instructions: e.target.value })}
              placeholder="Describe any additional teaching preferences, terminology, notation requirements, or problem-solving expectations."
              maxLength={3000}
            />
          </Field>
          <div className="policy-actions">
            <Button onClick={save} disabled={!dirty}>
              <Check size={16} />
              Save Teaching Profile
            </Button>
            <Button variant="ghost" onClick={() => setReset(true)}>
              Reset to Defaults
            </Button>
            <span>
              {dirty ? "Unsaved changes" : "All changes saved locally"}
            </span>
          </div>
        </Card>
        <aside>
          <Card className="policy-preview">
            <div className="insight-icon">
              <ShieldCheck size={22} />
            </div>
            <h2>A shared learning agreement.</h2>
            <p>
              Your saved profile applies across the student experience.
              Assignment-specific restrictions can further limit the level of
              assistance.
            </p>
            <div className="preview-level">
              <small>SAVED COURSE DEFAULT</small>
              <strong>Level {state.policy.level}</strong>
              <span>{helpLevels[state.policy.level - 1]}</span>
            </div>
            <Button variant="outline full" onClick={onStudent}>
              <Eye size={16} />
              Preview Student Experience
            </Button>
            {dirty && (
              <p className="micro">
                Save changes before previewing to apply them.
              </p>
            )}
          </Card>
          <div className="notice">
            <ShieldCheck size={18} />
            <p>
              Instructor rules take priority over student requests. Level 4 is
              reserved for practice and ungraded review.
            </p>
          </div>
        </aside>
      </div>
      {reset && (
        <Modal
          title="Reset teaching preferences?"
          onClose={() => setReset(false)}
        >
          <p>
            This restores the editable form to its defaults. Use Save Teaching
            Profile to apply them.
          </p>
          <div className="button-row">
            <Button variant="outline" onClick={() => setReset(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setDraft({ ...defaultPolicy });
                setDirty(true);
                setReset(false);
              }}
            >
              Restore defaults
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
export function AssignmentManager() {
  const { state, set, notify } = useDemo();
  const [edit, setEdit] = useState<Assignment | null>(null);
  const [search, setSearch] = useState("");
  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!edit?.title.trim() || !edit.description.trim()) return;
    set((s) => ({
      ...s,
      assignments: s.assignments.map((a) => (a.id === edit.id ? edit : a)),
    }));
    notify("Assignment settings saved. Student workspace updated.");
    setEdit(null);
  }
  return (
    <>
      <Heading
        title="Assignments"
        subtitle="Define the right amount of support for every learning task."
      />
      <div className="toolbar">
        <div className="search">
          <Search size={16} />
          <input
            placeholder="Search assignments..."
            aria-label="Search assignments"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Badge>4 assignments · Physics I</Badge>
      </div>
      <Card className="table-card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Assignment Name</th>
                <th>Course</th>
                <th>Due Date</th>
                <th>Type</th>
                <th>AI Assistance Level</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {state.assignments
                .filter((a) =>
                  a.title.toLowerCase().includes(search.toLowerCase()),
                )
                .map((a) => (
                  <tr key={a.id}>
                    <td>
                      <button
                        className="table-link"
                        onClick={() => setEdit({ ...a })}
                      >
                        {a.title}
                      </button>
                    </td>
                    <td>Physics I</td>
                    <td>
                      {new Date(a.due + "T12:00:00").toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" },
                      )}
                    </td>
                    <td>
                      <Badge>{a.type}</Badge>
                    </td>
                    <td>
                      <Badge tone="purple">
                        {helpLevels[effectiveLevel(state.policy, a) - 1]}
                      </Badge>
                    </td>
                    <td>
                      <Badge
                        tone={a.status === "In progress" ? "amber" : "green"}
                      >
                        {a.status}
                      </Badge>
                    </td>
                    <td>
                      <button
                        className="icon-button"
                        aria-label={"Edit " + a.title}
                        onClick={() => setEdit({ ...a })}
                      >
                        <SlidersHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {!state.assignments.some((a) =>
            a.title.toLowerCase().includes(search.toLowerCase()),
          ) && (
            <p className="empty-inline">No assignments match your search.</p>
          )}
        </div>
      </Card>
      <div className="notice">
        <ShieldCheck size={19} />
        <p>
          Course policies set the maximum assistance level. Assignment settings
          can be more restrictive. Graded assignments never receive complete
          worked solutions in this demonstration.
        </p>
      </div>
      {edit && (
        <Modal title="Assignment Settings" onClose={() => setEdit(null)} wide>
          <form onSubmit={save}>
            <Field label="Assignment Title">
              <input
                required
                value={edit.title}
                onChange={(e) => setEdit({ ...edit, title: e.target.value })}
                maxLength={150}
              />
            </Field>
            <Field label="Assignment Description">
              <textarea
                required
                rows={3}
                value={edit.description}
                onChange={(e) =>
                  setEdit({ ...edit, description: e.target.value })
                }
                maxLength={2500}
              />
            </Field>
            <div className="form-grid">
              <Field label="Assignment Type">
                <select
                  value={edit.type}
                  onChange={(e) =>
                    setEdit({
                      ...edit,
                      type: e.target.value as Assignment["type"],
                    })
                  }
                >
                  <option>Graded</option>
                  <option>Practice</option>
                  <option>Ungraded Review</option>
                </select>
              </Field>
              <Field label="Due Date">
                <input
                  required
                  type="date"
                  value={edit.due}
                  onChange={(e) => setEdit({ ...edit, due: e.target.value })}
                />
              </Field>
            </div>
            <Field label="AI Assistance Level">
              <select
                disabled={edit.inherit}
                value={edit.level}
                onChange={(e) => setEdit({ ...edit, level: +e.target.value })}
              >
                {helpLevels.map((l, i) => (
                  <option key={l} value={i + 1}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
            <label className="checkbox-line">
              <input
                type="checkbox"
                checked={edit.inherit}
                onChange={(e) =>
                  setEdit({ ...edit, inherit: e.target.checked })
                }
              />
              Follow the course default assistance level
            </label>
            <div className="form-checks">
              {[
                { key: "diagram", label: "Allow diagram uploads" },
                {
                  key: "analogous",
                  label: "Allow analogous practice generation",
                },
                {
                  key: "citations",
                  label: "Require citation to course materials",
                },
                { key: "sources", label: "Show source references" },
                {
                  key: "analytics",
                  label: "Record de-identified misconception analytics",
                },
              ].map((r) => (
                <label className="checkbox-line" key={r.key}>
                  <input
                    type="checkbox"
                    checked={edit[r.key as "diagram"]}
                    onChange={(e) =>
                      setEdit({ ...edit, [r.key]: e.target.checked })
                    }
                  />
                  {r.label}
                </label>
              ))}
            </div>
            <p className="micro muted">
              Effective level after saving:{" "}
              {helpLevels[effectiveLevel(state.policy, edit) - 1]}. Settings
              persist in this browser.
            </p>
            <div className="modal-actions">
              <Button
                variant="outline"
                type="button"
                onClick={() => setEdit(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Assignment</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
export function MaterialsManager() {
  const { state, set, notify } = useDemo();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All types");
  const [status, setStatus] = useState("All statuses");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [menu, setMenu] = useState<string | null>(null);
  const [remove, setRemove] = useState<Material | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );
  const visible = state.materials.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) &&
      (type === "All types" || m.type === type) &&
      (status === "All statuses" || m.status === status),
  );
  function choose(list: FileList | File[] | null) {
    if (!list) return;
    const fs = Array.from(list);
    if (
      fs.some(
        (f) =>
          !/\.(pdf|png|jpe?g|txt|docx|pptx)$/i.test(f.name) ||
          f.size > 20 * 1024 * 1024,
      )
    ) {
      setError("Choose PDF, PNG, JPG, TXT, DOCX, or PPTX files under 20 MB.");
      return;
    }
    setFiles(fs);
    setProgress(0);
    setError("");
  }
  function upload() {
    setUploading(true);
    let p = 0;
    timer.current = setInterval(() => {
      p += 25;
      setProgress(p);
      if (p >= 100) {
        clearInterval(timer.current!);
        setUploading(false);
      }
    }, 200);
  }
  function confirm() {
    const added = files.map((f, i) => ({
      id: "upload-" + Date.now() + "-" + i,
      name: f.name,
      type: "Examples",
      status: "Needs Review" as const,
      modified: "Nov 5, 2026",
    }));
    set((s) => ({ ...s, materials: [...s.materials, ...added] }));
    notify(
      "Sample material metadata added. Review and approve it to show it in student references.",
    );
    setUploadOpen(false);
    setFiles([]);
    setProgress(0);
  }
  function approval(m: Material) {
    set((s) => ({
      ...s,
      materials: s.materials.map((x) =>
        x.id === m.id
          ? {
              ...x,
              status: x.status === "Approved" ? "Needs Review" : "Approved",
            }
          : x,
      ),
    }));
    notify(
      m.status === "Approved"
        ? "Approval removed. Material hidden from student references."
        : "Material approved. It now appears in student references.",
    );
    setMenu(null);
  }
  return (
    <>
      <Heading
        title="Approved Course Materials"
        subtitle="Manage the information Instruct.AI is permitted to reference when assisting students."
        action={
          <Button
            onClick={() => {
              setUploadOpen(true);
              setFiles([]);
              setProgress(0);
              setError("");
            }}
          >
            <Upload size={16} />
            Upload Materials
          </Button>
        }
      />
      <div className="material-summary">
        <Badge tone="green">
          <ShieldCheck size={13} />
          {state.materials.filter((x) => x.status === "Approved").length}{" "}
          approved
        </Badge>
        <Badge tone="amber">
          {state.materials.filter((x) => x.status === "Needs Review").length}{" "}
          need review
        </Badge>
        <span>Physics I · Fall 2026</span>
      </div>
      <div className="toolbar">
        <div className="search">
          <Search size={16} />
          <input
            aria-label="Search course materials"
            placeholder="Search course materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="button-row">
          <select
            aria-label="Filter document type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {[
              "All types",
              "Syllabus",
              "Rubric",
              "Lecture",
              "Examples",
              "Practice",
            ].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select
            aria-label="Filter approval status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {["All statuses", "Approved", "Processing", "Needs Review"].map(
              (s) => (
                <option key={s}>{s}</option>
              ),
            )}
          </select>
        </div>
      </div>
      <Card className="table-card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Document</th>
                <th>Type</th>
                <th>Approval Status</th>
                <th>Last Modified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div className="document-name">
                      <span className="document-icon">
                        <FileText size={20} />
                      </span>
                      <b>{m.name}</b>
                    </div>
                  </td>
                  <td>{m.type}</td>
                  <td>
                    <Badge
                      tone={
                        m.status === "Approved"
                          ? "green"
                          : m.status === "Processing"
                            ? "blue"
                            : "amber"
                      }
                    >
                      {m.status === "Approved" && <Check size={12} />}{" "}
                      {m.status}
                    </Badge>
                  </td>
                  <td>{m.modified}</td>
                  <td className="actions-cell">
                    <button
                      className="icon-button"
                      aria-label={"Actions for " + m.name}
                      onClick={() => setMenu(menu === m.id ? null : m.id)}
                    >
                      <MoreHorizontal size={18} />
                    </button>
                    {menu === m.id && (
                      <div className="row-menu">
                        <button onClick={() => approval(m)}>
                          <ShieldCheck size={14} />
                          {m.status === "Approved"
                            ? "Remove approval"
                            : "Mark approved"}
                        </button>
                        <button
                          onClick={() => {
                            setRemove(m);
                            setMenu(null);
                          }}
                        >
                          <Trash2 size={14} />
                          Remove material
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visible.length && (
            <div className="empty-inline">
              <h3>
                {state.materials.length
                  ? "No matching materials"
                  : "No document uploaded"}
              </h3>
              <p>
                {state.materials.length
                  ? "Try another search or filter."
                  : "Upload course materials to begin configuring your AI learning assistant."}
              </p>
            </div>
          )}
        </div>
      </Card>
      <div className="grounding-panel">
        <div className="insight-icon">
          <Layers size={23} />
        </div>
        <div>
          <h2>Grounded in what you teach.</h2>
          <p>
            Instruct.AI uses instructor-approved course materials to guide
            explanations and maintain consistency with course expectations.
          </p>
          <small>
            Prototype: approval controls filter reference names. Files are not
            sent to a server, parsed, or semantically indexed.
          </small>
        </div>
      </div>
      {uploadOpen && (
        <Modal
          title="Upload Course Materials"
          onClose={() => {
            if (!uploading) setUploadOpen(false);
          }}
        >
          <p className="muted">
            Add a sample document, then review and approve it for the student
            reference list.
          </p>
          <input
            ref={fileRef}
            type="file"
            className="sr-only"
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.txt,.docx,.pptx"
            aria-label="Choose course materials"
            onChange={(e) => choose(e.target.files)}
          />
          <div
            className="material-drop"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (!uploading) choose(e.dataTransfer.files);
            }}
          >
            <Upload size={28} />
            <h3>Drag and drop your course files</h3>
            <p>PDF, images, TXT, DOCX, or PPTX · up to 20 MB</p>
            <Button
              variant="outline"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              Browse files
            </Button>
            <button
              className="text-link"
              disabled={uploading}
              onClick={() =>
                choose([
                  new File(
                    ["Demonstration material metadata only."],
                    "Inclined Plane Study Guide.pdf",
                    { type: "application/pdf" },
                  ),
                ])
              }
            >
              Or add a sample document
            </button>
          </div>
          {files.map((f, i) => (
            <div className="upload-file" key={i}>
              <FileText size={17} />
              {f.name}
              <Badge>{Math.round(f.size / 1024) || 1} KB</Badge>
            </div>
          ))}
          {error && (
            <p className="validation" role="alert">
              {error}
            </p>
          )}
          {progress > 0 && (
            <div className="upload-progress">
              <div style={{ width: progress + "%" }} />
              <span>{progress}% · simulated upload</span>
            </div>
          )}
          {progress === 100 && (
            <div className="notice">
              <CheckCircle2 size={17} />
              <p>
                Ready to add {files.length} document
                {files.length > 1 ? "s" : ""}. New materials start as Needs
                Review.
              </p>
            </div>
          )}
          <div className="modal-actions">
            <Button
              variant="outline"
              disabled={uploading}
              onClick={() => setUploadOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={!files.length || uploading}
              onClick={progress === 100 ? confirm : upload}
            >
              {uploading ? (
                <>
                  <LoaderCircle className="spin" size={15} />
                  Preparing…
                </>
              ) : progress === 100 ? (
                "Confirm Materials"
              ) : (
                "Prepare Upload"
              )}
            </Button>
          </div>
        </Modal>
      )}
      {remove && (
        <Modal title="Remove this material?" onClose={() => setRemove(null)}>
          <p>
            {remove.name} will be removed from this demonstration and its
            student references.
          </p>
          <div className="modal-actions">
            <Button variant="outline" onClick={() => setRemove(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                set((s) => ({
                  ...s,
                  materials: s.materials.filter((m) => m.id !== remove.id),
                }));
                setRemove(null);
                notify("Material removed from this browser.");
              }}
            >
              Remove material
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
export function InstructorCourses({
  onPolicy,
  onMaterials,
}: {
  onPolicy: () => void;
  onMaterials: () => void;
}) {
  return (
    <>
      <Heading
        title="Your Courses"
        subtitle="Build a thoughtful learning experience around your course."
      />
      <Card className="instructor-course">
        <span className="course-avatar purple">
          <GraduationCap size={28} />
        </span>
        <div>
          <Badge tone="purple">FALL SEMESTER · SIMULATED</Badge>
          <h2>Physics I</h2>
          <p>PHY 2048 · Dr. Chen — Physics Department</p>
          <div className="course-stats">
            <span>
              <Users size={16} />
              218 students
            </span>
            <span>
              <FileText size={16} />4 assignments
            </span>
            <span>
              <BookOpen size={16} />
              Mechanics &amp; motion
            </span>
          </div>
        </div>
        <div className="button-row">
          <Button onClick={onPolicy}>
            Teaching Profile
            <ArrowRight size={15} />
          </Button>
          <Button variant="outline" onClick={onMaterials}>
            Course Materials
          </Button>
        </div>
      </Card>
    </>
  );
}
export function Students() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");
  const students = [
    ["Jordan Smith", "JS", "14 sessions", "Force components"],
    ["Taylor Morgan", "TM", "11 sessions", "Sign conventions"],
    ["Alex Rivera", "AR", "17 sessions", "Energy conservation"],
    ["Casey Patel", "CP", "9 sessions", "Free-body diagrams"],
    ["Morgan Lee", "ML", "13 sessions", "Momentum"],
  ];
  return (
    <>
      <Heading
        title="Students"
        subtitle="A demonstration roster for Physics I. All profiles are simulated."
        action={<Badge tone="purple">218 enrolled · 5 sample profiles</Badge>}
      />
      <div className="toolbar">
        <div className="search">
          <Search size={16} />
          <input
            aria-label="Search students"
            placeholder="Search sample students..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <Card className="table-card">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Practice Activity</th>
              <th>Recent Concept</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {students
              .filter((x) => x[0].toLowerCase().includes(query.toLowerCase()))
              .map(([name, initial, sessions, concept]) => (
                <tr key={name}>
                  <td>
                    <div className="student-name">
                      <span className="avatar small-avatar">{initial}</span>
                      <button
                        className="table-link"
                        onClick={() => setSelected(name)}
                      >
                        {name}
                      </button>
                    </div>
                  </td>
                  <td>{sessions}</td>
                  <td>{concept}</td>
                  <td>
                    <Badge>Simulated</Badge>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {!students.some((x) =>
          x[0].toLowerCase().includes(query.toLowerCase()),
        ) && (
          <p className="empty-inline">No sample students match your search.</p>
        )}
      </Card>
      {selected && (
        <Modal
          title={selected + " · Sample profile"}
          onClose={() => setSelected("")}
        >
          <Badge tone="purple">Simulated data</Badge>
          <p>
            This profile demonstrates the roster workflow. Learning analytics
            are aggregated at course level; no private tutoring conversations or
            real student records are available.
          </p>
          <dl className="detail-list">
            <dt>Course</dt>
            <dd>Physics I · Fall 2026</dd>
            <dt>Recent concept</dt>
            <dd>{students.find((s) => s[0] === selected)?.[3]}</dd>
            <dt>Practice activity</dt>
            <dd>
              {students.find((s) => s[0] === selected)?.[2]} · illustrative
            </dd>
          </dl>
        </Modal>
      )}
    </>
  );
}
