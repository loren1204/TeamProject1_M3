# Kaizen / Instruct.AI

A policy-aware learning application built on the CourseGuide AI M3 project. Students receive step-by-step guidance, while instructors define how much help is appropriate for each assignment.

The application is prepared for **Vercel hosting with its own Supabase email/password login**. Visitors use a Kaizen account; no ChatGPT login is part of the application. See [deployment and authentication setup](docs/VERCEL_SUPABASE_SETUP.md).

## Start the application

```sh
cd web
npm ci
npm run dev
```

Use Node 20.19 or newer. The frontend uses React, TypeScript, Lucide icons and Recharts. Set the public Supabase project URL and publishable key in `web/.env.local` using `web/.env.example`. Supabase handles sign-up, email confirmation, password reset, sessions and sign-out.

```sh
cd web
npm test
npm run build
```

The production build is written to `web/dist/`.

## Run the adapted agent

The M3 entry point now accepts a typed, course-and-assignment-aware site request:

```sh
python -m src.m3_agent --site-request docs/site_request.example.json
python -m unittest discover -s tests -p test_site_agent.py -v
```

This mode is intentionally deterministic and credential-free. Its explicit planner handoff resolves the course maximum, assignment assistance cap, graded-work restrictions, diagram requirement and approved reference metadata before selecting a tutoring response. The frontend counterpart is `web/src/agent.ts`.

The original live planner → tutor → MCP workflow remains available:

```sh
python -m src.m3_agent --course physics_101 --question "Help me set up Newton's second law."
```

Live mode requires the original Python dependencies and configured model credentials. Its implementation is preserved in `src/m3_live_agent.py`. [Original M3 setup, evaluation and project documentation](docs/COURSEGUIDE_M3_README.md) is retained along with the original configs, tests, MCP servers and submission materials.

## Connected demonstration workflows

- **Student learning:** Dashboard → Continue Learning → request a hint → choose or upload a diagram → Recheck My Work → similar practice → submit an attempt and review feedback.
- **Instructor control:** switch to Instructor → AI Teaching Policies → change the help level → save → Preview Student Experience. Both the displayed help level and tutoring response strategy change.
- **Course grounding:** Course Materials → add a sample document → confirm → mark approved → switch to Student → tutor → approved references. Only approved names appear.
- **Assignment configuration:** edit assignment metadata, assistance caps, uploads, practice-generation permissions, source display and local analytics settings.

## What is simulated

All profiles, baseline history, analytic datasets and tutoring replies are demonstration data. LocalStorage persists course policies, assignment settings, document metadata and recorded practice events. Files remain in browser memory. Document approval filters reference names; it does not semantically index documents. Work analysis uses predefined feedback independent of uploaded content. No live model or image interpretation is connected to the deployed application.

Instructor access is granted through administrator-owned Supabase app metadata. Optional guest demonstration mode keeps role switching separate from signed-in accounts. A future live backend must authenticate instructors, load authoritative policies server-side, verify assignment ownership, and retrieve only approved content. Never place provider credentials in the frontend.

## Verification

- 11 TypeScript checks cover account isolation, role defaults, password validation, assistance caps, graded-work restrictions, diagram gates, source approval, analogous-practice restrictions and all practice pools.
- 6 Python checks cover the site adapter's policy enforcement and validation.
- TypeScript compilation and the Vite production build pass.
- Browser checks cover role switching, policy synchronization, material approval, assignment edits, file preview, diagram feedback, practice correction and mobile navigation.

## Attribution

Fork of [DanielG0798/TeamProject1_M3](https://github.com/DanielG0798/TeamProject1_M3). The upstream MIT license and original coursework files are preserved. The application is implemented under `web/`; the new agent adapter and its entry point are under `src/`.
