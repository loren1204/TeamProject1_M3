import { Assignment, Policy, Material, helpLevels } from "./data";
export type TutorAction =
  | "message"
  | "question"
  | "hint"
  | "concept"
  | "practice";
export type TutorRequest = {
  message: string;
  action: TutorAction;
  assignment: Assignment;
  policy: Policy;
  materials: Material[];
  hasDiagram: boolean;
  turn: number;
};
export function effectiveLevel(policy: Policy, a: Assignment) {
  const level = a.inherit ? policy.level : Math.min(policy.level, a.level);
  return a.type === "Graded" ? Math.min(3, level) : level;
}
export function respond(r: TutorRequest) {
  const { assignment: a, policy: p } = r;
  const level = effectiveLevel(p, a);
  const q = r.message.toLowerCase();
  const sources = a.sources
    ? r.materials.filter((m) => m.status === "Approved").map((m) => m.name)
    : [];
  const rules = [
    p.diagram ? "Attempt a diagram first" : "",
    p.units ? "Show units" : "",
    p.symbolic ? "Symbolic setup first" : "",
    p.restrict ? "No complete graded solutions" : "",
  ].filter(Boolean);
  let text = "";
  const energy = a.id === "hw4",
    momentum = a.id === "hw6";
  const guiding = energy
    ? "What forms of energy does the cart have at the top and bottom? Which interactions could change its mechanical energy?"
    : momentum
      ? "If you treat both carts as one system, what external horizontal forces act during the collision?"
      : "Imagine rotating your axes so one points down the slope. Which part of the weight points along that axis?";
  if (r.action === "practice" && !a.analogous)
    text =
      "Similar practice generation is disabled for this assignment by your instructor. You can still ask a guiding question about your current approach.";
  else if (r.action === "practice")
    text =
      "Here is an analogous, ungraded practice problem: A 3.0 kg block rests on a frictionless 20° incline. How would you determine its acceleration? Start by identifying the forces and choosing your axes. Open Practice to work through it with answer checking.";
  else if (
    a.type === "Graded" &&
    /answer|solve it|full solution|numerical|ignore|bypass/.test(q)
  )
    text = `This is graded homework, so I’ll help you build your own solution rather than provide a completed answer. ${guiding}`;
  else if (p.diagram && !r.hasDiagram && r.action !== "question")
    text =
      "Before we go further, try a free-body diagram. Show the object, gravity, and each contact force. You can upload your attempt or use the sample diagram to continue this demonstration.";
  else if (level === 1 || r.action === "question")
    text = guiding + " What do you think the next step should be?";
  else if (energy)
    text =
      level === 2
        ? "Write an energy balance before substituting numbers. With no friction, how does the decrease in gravitational potential energy relate to the increase in kinetic energy?"
        : "Mechanical energy is conserved when no nonconservative work is done. Gravitational potential energy depends on vertical height, while kinetic energy depends on speed squared. Write the top and bottom energy expressions, then set them equal.";
  else if (momentum)
    text =
      level === 2
        ? "Track the total momentum before and after the collision. Since the carts stick together, what mass should multiply the final common velocity?"
        : "For an isolated system, total momentum is conserved. A sticking collision is inelastic: momentum is conserved, but kinetic energy need not be. Write one momentum expression for each cart before combining them after the collision.";
  else if (level === 2) {
    if (r.action === "concept")
      text =
        "Newton’s second law connects the net force on an object to its acceleration. On an incline, focus on the forces along the surface. The normal force is perpendicular, so it cannot accelerate the block down the slope. Which part of gravity remains along the slope?";
    else if (/unit/.test(q))
      text =
        "Check the units in your symbolic relationship: a force divided by mass should give N/kg. What does that become when you expand a newton into base SI units?";
    else if (/normal|cos/.test(q))
      text =
        "The normal force is perpendicular to the surface. Along that axis, the block has no acceleration. Which gravitational component balances the normal force?";
    else if (/sin|parallel|component/.test(q))
      text =
        "You’re focusing on the right direction. In the weight-component triangle, the parallel component is opposite the incline angle. Try writing that component in terms of m, g, and θ before inserting values.";
    else
      text = [
        "Start with axes parallel and perpendicular to the incline. The component of weight parallel to the slope is opposite θ in the force triangle. Which trigonometric function connects the opposite side to the hypotenuse?",
        "Now write Newton’s second law along the slope using symbols. Which force contributes along that axis, and which force is perpendicular to it?",
        "Look at the mass on both sides of your symbolic equation. Can you simplify before substituting values? Keep your positive direction down the slope.",
      ][r.turn % 3];
  } else if (level === 3 || a.type === "Graded")
    text =
      "Gravity points vertically down, while the normal force is perpendicular to the incline. Rotating your axes does not change gravity; it changes how you describe it. The component parallel to the slope has magnitude mg sin θ, and the perpendicular component has magnitude mg cos θ. Use the parallel component in Newton’s second law. Try setting up that relationship yourself before substituting numbers.";
  else
    text =
      a.id === "quiz"
        ? "For this approved practice example, resolve the 12 N force using the angle measured from the horizontal: Fx = F cos 40° ≈ 9.19 N and Fy = F sin 40° ≈ 7.71 N. Check: the components reconstruct the original magnitude through the Pythagorean theorem. Now try a 10 N force at 30° yourself."
        : "For this ungraded worked example, start with the free-body diagram. Along the slope, ΣF = mg sin θ = ma, so a = g sin θ. At 30°, a = 9.8 × 0.5 = 4.9 m/s² down the incline. The mass cancels because gravity and inertia both scale with it. Check the units and try the same setup at another angle.";
  if (p.symbolic && level > 1 && r.action === "hint")
    text += " Write the relationship with symbols before substituting numbers.";
  if (a.citations && !r.materials.some((m) => m.status === "Approved"))
    text +=
      " No course materials are approved yet; this is generic simulated guidance.";
  if (p.units && r.action === "hint" && level > 1)
    text += " Keep units alongside your quantities.";
  return {
    text,
    level,
    label: helpLevels[level - 1],
    sources,
    rules,
    simulated: true as const,
  };
}
