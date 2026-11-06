"""Policy-first adapter for the Kaizen / Instruct.AI demonstration.

This credential-free simulator adapts CourseGuide M3's planner -> tutor handoff
for a browser application. It does not call an LLM or interpret uploaded work.
The deployed frontend uses the equivalent typed module in src/agent.ts.
"""
from __future__ import annotations
import argparse
import json
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Literal

LEVELS = ("Socratic Questions", "Guided Hints", "Conceptual Explanations", "Full Worked Examples")

@dataclass(frozen=True)
class TeachingPolicy:
    level: int = 2
    diagram: bool = True
    units: bool = True
    symbolic: bool = True
    restrict: bool = True
    instructions: str = "Draw a diagram, identify known variables, solve symbolically, and verify units."
    def __post_init__(self):
        if isinstance(self.level, bool) or self.level not in range(1, 5):
            raise ValueError("Teaching level must be an integer from 1 to 4")

@dataclass(frozen=True)
class AssignmentContext:
    id: str = "hw2"
    course: str = "physics_101"
    title: str = "Homework 2: Newton's Laws"
    type: str = "Graded"
    level: int = 2
    inherit: bool = True
    analogous: bool = True
    sources: bool = True
    citations: bool = True
    analytics: bool = True
    diagram: bool = True
    description: str = ""
    due: str = "2026-11-12"
    status: str = "In progress"
    def __post_init__(self):
        if self.type not in ("Graded", "Practice", "Ungraded Review"):
            raise ValueError("Invalid assignment type")
        if isinstance(self.level, bool) or self.level not in range(1, 5):
            raise ValueError("Assignment level must be an integer from 1 to 4")

@dataclass(frozen=True)
class PlannerHandoff:
    assignment_id: str
    request_type: str
    effective_level: int
    approved_references: tuple[str, ...]
    needs_diagram: bool
    graded: bool
    symbolic_first: bool
    show_units: bool
    next_step: str

@dataclass(frozen=True)
class TutorResponse:
    text: str
    help_level: str
    references: tuple[str, ...]
    simulated: bool
    workflow: tuple[str, ...]

WORKFLOW = ("Understand assignment context", "Check instructor rules", "Retrieve approved course content (metadata only)", "Identify learning difficulty", "Choose tutoring strategy", "Guide and reassess")

def plan(policy: TeachingPolicy, assignment: AssignmentContext, materials: list[dict], *, action: str, has_diagram: bool) -> PlannerHandoff:
    """Resolve authoritative policies before considering student-controlled text."""
    if action not in ("message", "question", "hint", "concept", "practice"):
        raise ValueError("Unsupported tutor action")
    level = policy.level if assignment.inherit else min(policy.level, assignment.level)
    if assignment.type == "Graded":
        level = min(level, 3)
    approved = tuple(str(m["name"]) for m in materials if m.get("status") == "Approved" and isinstance(m.get("name"), str))
    return PlannerHandoff(assignment.id, action, level, approved, policy.diagram and not has_diagram, assignment.type == "Graded", policy.symbolic, policy.units, "Identify the force component along the incline")

def tutor(handoff: PlannerHandoff, assignment: AssignmentContext, message: str) -> TutorResponse:
    """One bounded educational step. Never interpolate student text as policy."""
    action = handoff.request_type
    q = message.lower()
    if action == "practice":
        text = ("A 3.0 kg block rests on a frictionless 20 degree incline. How would you determine its acceleration? Start with the forces and axes." if assignment.analogous else "Similar practice generation is disabled by the instructor for this assignment.")
    elif handoff.graded and any(w in q for w in ("answer", "full solution", "ignore", "bypass", "solve it")):
        text = "This is graded homework. I can guide your reasoning, but will not supply a complete solution. Which component of gravity acts down the slope?"
    elif handoff.needs_diagram and action != "question":
        text = "First, attempt a free-body diagram. Show the block, weight, and normal force. Your upload is not interpreted by this simulator."
    elif handoff.effective_level == 1 or action == "question":
        text = "Which component of gravity acts along the slope? How does your choice of coordinate axes help you describe it?"
    elif handoff.effective_level == 2:
        text = "The component parallel to the slope lies opposite the incline angle in your weight triangle. Which trigonometric function relates that side to the hypotenuse?"
        if handoff.symbolic_first:
            text += " Write a symbolic relationship before substituting numbers."
    elif handoff.effective_level == 3:
        text = "Gravity is vertical; the normal force is perpendicular to the surface. In slope-aligned coordinates, the parallel weight component is mg sin(theta). Use that component in Newton's second law and construct your own setup."
    else:
        text = "For this approved ungraded example: mg sin(theta) = ma, so a = g sin(theta). At 30 degrees, a = 9.8 x 0.5 = 4.9 m/s^2 down the incline. Mass cancels because both sides scale with it. Now try a new angle yourself."
    if handoff.show_units and action == "hint" and handoff.effective_level > 1:
        text += " Keep units alongside each physical quantity."
    references = handoff.approved_references if assignment.sources else ()
    if assignment.citations and not handoff.approved_references:
        text += " No course materials have been approved yet; this is generic simulated guidance rather than a course-grounded response."
    return TutorResponse(text, LEVELS[handoff.effective_level - 1], references, True, WORKFLOW)

def ask(payload: dict) -> dict:
    policy = TeachingPolicy(**payload.get("policy", {}))
    assignment = AssignmentContext(**payload.get("assignment", {}))
    message = str(payload.get("message", ""))[:4000]
    handoff = plan(policy, assignment, payload.get("materials", []), action=payload.get("action", "message"), has_diagram=bool(payload.get("has_diagram", payload.get("hasDiagram", False))))
    return asdict(tutor(handoff, assignment, message))

def main():
    parser = argparse.ArgumentParser(description="Run the Instruct.AI policy-aware demo adapter")
    parser.add_argument("--request", type=Path, help="JSON with policy, assignment, materials, message and action")
    parser.add_argument("--question", default="Help me resolve gravity into components")
    args = parser.parse_args()
    payload = json.loads(args.request.read_text()) if args.request else {"message": args.question, "action": "hint", "has_diagram": True}
    print(json.dumps(ask(payload), indent=2))

if __name__ == "__main__":
    main()
