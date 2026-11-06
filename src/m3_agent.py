"""CourseGuide M3 entry point with a site-aware, credential-free demo mode.

The existing SDK/MCP workflow lives in m3_live_agent.py. Import it lazily so
site requests and policy tests can run without installing a model SDK.
"""
from __future__ import annotations
import argparse
import asyncio
import json
from pathlib import Path

async def ask(course_id: str, question: str, model: str | None = None) -> str:
    """Keep the original M3 Python API and sequential live-agent workflow."""
    from src.m3_live_agent import ask as ask_live
    return await ask_live(course_id, question, model)

def main() -> None:
    parser = argparse.ArgumentParser(description="Run CourseGuide M3 or the Instruct.AI site simulator")
    parser.add_argument("--course", default="physics_101", help="Course identifier for the original live agent")
    parser.add_argument("--question", help="Student question for the original live agent")
    parser.add_argument("--model", default=None, help="Model name override for live mode")
    parser.add_argument("--site-request", type=Path, help="JSON assignment context and instructor policy for credential-free demo mode")
    args = parser.parse_args()
    if args.site_request:
        from src.site_agent import ask as ask_site
        try:
            payload = json.loads(args.site_request.read_text(encoding="utf-8"))
            if not isinstance(payload, dict):
                raise ValueError("Site request must be a JSON object")
            print(json.dumps(ask_site(payload), indent=2))
        except (OSError, ValueError, TypeError, KeyError) as exc:
            parser.error(str(exc))
        return
    if not args.question:
        parser.error("provide --question for live mode or --site-request for demo mode")
    print(asyncio.run(ask(args.course, args.question, args.model)))

if __name__ == "__main__":
    main()
