# Vercel + Supabase account setup

The web application uses its own Supabase email/password authentication. Visitors do not need a ChatGPT account.

## Vercel

Import the GitHub repository using **web** as the root directory. Framework: Vite. Build: `npm run build`. Output: `dist`. Install: `npm ci`.

Set these build environment variables in Production and Preview:

- `VITE_SUPABASE_URL`: your project's API URL.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: the public publishable key. Never use a service-role or secret key in a `VITE_` variable.
- `VITE_ENABLE_DEMO=false`: require account sign-in. Optional true enables a clearly separate sample-data demonstration.

Redeploy after changing a Vite environment variable, since it is embedded at build time.

## Supabase

Apply `supabase/migrations/202611060001_profiles.sql` once to a new project. It creates an owner-only profile table and an automatic sign-up profile trigger. Passwords stay in Supabase Auth, never in application tables.

In Authentication → URL Configuration, set Site URL to the final production Vercel URL and allow these exact redirects:

- `https://YOUR_PRODUCTION_DOMAIN/`
- `https://YOUR_PRODUCTION_DOMAIN/?mode=recovery`

For local development, also allow `http://localhost:5173/` and `http://localhost:5173/?mode=recovery`.

Keep email confirmation enabled. Configure your own SMTP provider when appropriate for sending production confirmation/reset messages. The application handles login failures, confirmation notices, password-reset requests, recovery sessions, password matching, and local-session sign-out.

New sign-ups are students. An administrator may set `app_metadata.role` to `instructor` using Supabase's trusted Admin API or an approved administrative process. Client-editable `user_metadata` never grants instructor access. The profile table does not expose a writable role column.

Course data, teaching settings, analytics and tutoring are still the prototype's local/sample workflows. Account identity is real; workspace state is isolated per authenticated user in this browser. Future shared course data must use authenticated backend checks and appropriate course-level RLS.
