export type Role = "student" | "instructor";
export type Assignment = {
  id: string;
  title: string;
  description: string;
  type: "Graded" | "Practice" | "Ungraded Review";
  due: string;
  level: number;
  inherit: boolean;
  status: string;
  diagram: boolean;
  analogous: boolean;
  citations: boolean;
  sources: boolean;
  analytics: boolean;
};
export type Policy = {
  level: number;
  diagram: boolean;
  units: boolean;
  symbolic: boolean;
  restrict: boolean;
  instructions: string;
};
export type Material = {
  id: string;
  name: string;
  type: string;
  status: "Approved" | "Processing" | "Needs Review";
  modified: string;
};
export type Event = {
  id: number;
  label: string;
  topic: string;
  correct: boolean;
  date: string;
};
export const helpLevels = [
  "Socratic Questions",
  "Guided Hints",
  "Conceptual Explanations",
  "Full Worked Examples",
];
export const defaultPolicy: Policy = {
  level: 2,
  diagram: true,
  units: true,
  symbolic: true,
  restrict: true,
  instructions:
    "Always encourage students to draw a diagram, identify known variables, select the governing equation, solve symbolically, and verify units before giving a numerical answer.",
};
export const assignments: Assignment[] = [
  {
    id: "hw2",
    title: "Homework 2: Newton’s Laws",
    description:
      "A 5.0 kg block rests on a frictionless incline at an angle of 30°. Find the magnitude of its acceleration down the incline.",
    type: "Graded",
    due: "2026-11-12",
    level: 2,
    inherit: true,
    status: "In progress",
    diagram: true,
    analogous: true,
    citations: true,
    sources: true,
    analytics: true,
  },
  {
    id: "hw4",
    title: "Homework 4: Energy",
    description:
      "A 2.0 kg cart starts from rest and rolls down a frictionless track with a vertical drop of 1.5 m. Determine its speed at the bottom.",
    type: "Graded",
    due: "2026-11-19",
    level: 2,
    inherit: true,
    status: "Available",
    diagram: true,
    analogous: true,
    citations: true,
    sources: true,
    analytics: true,
  },
  {
    id: "hw6",
    title: "Homework 6: Momentum",
    description:
      "A 0.50 kg cart moving at 2.0 m/s collides and sticks to a stationary 0.75 kg cart. Determine the common velocity after collision.",
    type: "Graded",
    due: "2026-12-03",
    level: 2,
    inherit: true,
    status: "Available",
    diagram: true,
    analogous: true,
    citations: true,
    sources: true,
    analytics: true,
  },
  {
    id: "quiz",
    title: "Practice Quiz: Force Components",
    description:
      "A 12 N force acts at 40° above the horizontal. Find its horizontal and vertical components.",
    type: "Practice",
    due: "2026-11-10",
    level: 4,
    inherit: false,
    status: "Available",
    diagram: true,
    analogous: true,
    citations: false,
    sources: true,
    analytics: true,
  },
];
export const materials: Material[] = [
  {
    id: "m1",
    name: "Physics I Syllabus.pdf",
    type: "Syllabus",
    status: "Approved",
    modified: "Nov 2, 2026",
  },
  {
    id: "m2",
    name: "Homework 2 Rubric.pdf",
    type: "Rubric",
    status: "Approved",
    modified: "Nov 3, 2026",
  },
  {
    id: "m3",
    name: "Newton’s Laws Lecture Slides.pdf",
    type: "Lecture",
    status: "Approved",
    modified: "Nov 4, 2026",
  },
  {
    id: "m4",
    name: "Free-Body Diagram Examples.pdf",
    type: "Examples",
    status: "Approved",
    modified: "Nov 4, 2026",
  },
  {
    id: "m5",
    name: "Practice Problems.pdf",
    type: "Practice",
    status: "Needs Review",
    modified: "Nov 5, 2026",
  },
];
export const topics = [
  "Newton’s Laws",
  "Force Components",
  "Free-Body Diagrams",
  "Inclined Planes",
  "Work and Energy",
  "Momentum",
];
export const misconceptions = [
  {
    name: "Confusing net force and acceleration",
    count: 42,
    description:
      "Treating acceleration as a force instead of the result of a net force.",
  },
  {
    name: "Incorrect force components",
    count: 31,
    description:
      "Swapping sine and cosine when resolving weight on an incline.",
  },
  {
    name: "Sign convention errors",
    count: 28,
    description: "Changing the positive axis partway through a calculation.",
  },
  {
    name: "Missing free-body diagrams",
    count: 24,
    description: "Starting equations before identifying all external forces.",
  },
  {
    name: "Units and dimensional analysis",
    count: 18,
    description:
      "Omitting units or combining quantities with incompatible dimensions.",
  },
];
export const activity = [
  { day: "Mon", sessions: 2 },
  { day: "Tue", sessions: 3 },
  { day: "Wed", sessions: 1 },
  { day: "Thu", sessions: 4 },
  { day: "Fri", sessions: 2 },
  { day: "Sat", sessions: 1 },
  { day: "Sun", sessions: 1 },
];
export type PracticeQuestion = {
  statement: string;
  answer: number;
  unit: string;
  hint: string;
  explanation: string;
};
export function practiceQuestion(
  topic: string,
  difficulty: string,
  index: number,
): PracticeQuestion {
  const n = index % 2;
  const hard =
    difficulty === "Advanced" ? 2 : difficulty === "Intermediate" ? 1 : 0;
  const mass = 3 + n + hard;
  if (topic === "Momentum")
    return {
      statement: `A ${mass}.0 kg cart travels at ${2 + n}.0 m/s. What is the magnitude of its momentum?`,
      answer: mass * (2 + n),
      unit: "kg·m/s",
      hint: "Momentum is mass multiplied by velocity. Keep track of the units.",
      explanation: `p = mv = ${mass}.0 kg × ${2 + n}.0 m/s = ${mass * (2 + n)} kg·m/s.`,
    };
  if (topic === "Work and Energy")
    return {
      statement: `A constant horizontal force of ${10 + hard * 5} N moves a cart ${2 + n}.0 m in the same direction as the force. How much work does it do?`,
      answer: (10 + hard * 5) * (2 + n),
      unit: "J",
      hint: "Use W = Fd cos θ. What is θ when force and displacement point the same way?",
      explanation: `W = Fd cos 0° = ${10 + hard * 5} × ${2 + n} = ${(10 + hard * 5) * (2 + n)} J.`,
    };
  if (topic === "Free-Body Diagrams")
    return {
      statement: `A ${mass}.0 kg book rests on a horizontal table. There are no other contacts or applied forces. How many external forces belong on its free-body diagram?`,
      answer: 2,
      unit: "forces",
      hint: "Consider the interaction with Earth and the interaction with the table.",
      explanation:
        "Two forces: gravity downward and the normal force upward. Because the book is at rest, their magnitudes are equal.",
    };
  if (topic === "Force Components")
    return {
      statement: `A ${10 + 5 * n} N force acts at 60° above the horizontal. Find its horizontal component.`,
      answer: (10 + 5 * n) * 0.5,
      unit: "N",
      hint: "The horizontal component is adjacent to the angle. Use Fx = F cos θ.",
      explanation: `Fx = F cos 60° = ${10 + 5 * n} × 0.5 = ${(10 + 5 * n) * 0.5} N.`,
    };
  if (topic === "Inclined Planes")
    return {
      statement: `A ${mass}.0 kg block rests on a frictionless ${n ? 20 : 30}° incline. Find the magnitude of its acceleration down the slope. Use g = 9.8 m/s².`,
      answer: 9.8 * Math.sin(((n ? 20 : 30) * Math.PI) / 180),
      unit: "m/s²",
      hint: "Resolve weight parallel to the incline, then apply ΣF∥ = ma. Which factors cancel?",
      explanation: `mg sin θ = ma, so a = g sin θ = 9.8 sin ${n ? 20 : 30}° ≈ ${(9.8 * Math.sin(((n ? 20 : 30) * Math.PI) / 180)).toFixed(2)} m/s².`,
    };
  return {
    statement: `A net horizontal force of ${12 + hard * 6} N acts on a ${mass}.0 kg cart. Find the cart’s acceleration.`,
    answer: (12 + hard * 6) / mass,
    unit: "m/s²",
    hint: "Newton’s second law relates net force, mass, and acceleration. Rearrange it symbolically first.",
    explanation: `ΣF = ma, so a = ΣF/m = ${12 + hard * 6}/${mass} = ${((12 + hard * 6) / mass).toFixed(2)} m/s².`,
  };
}
export const initialMessages = [
  {
    role: "ai",
    text: "Let’s work through this together. Before solving the problem, what forces are acting on the block?",
  },
  { role: "student", text: "I think there’s gravity and a normal force." },
  {
    role: "ai",
    text: "That’s a good start. Since the incline is frictionless, those are the two main forces we need to consider. Can you draw a free-body diagram showing their directions?",
  },
  {
    role: "student",
    text: "I drew one, but I’m not sure how to separate gravity into components.",
  },
  {
    role: "ai",
    text: "Think about the coordinate system along the incline. Which component of gravity acts parallel to the surface?",
  },
];
