import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  GraduationCap,
  ShieldCheck,
  LoaderCircle,
  CheckCircle2,
  LogOut,
} from "lucide-react";
import { supabase, demoEnabled } from "./supabase";
import {
  accountRole,
  accountStorageKey,
  validateNewPassword,
} from "./auth-config";
import { Provider } from "./store";

type Identity = {
  user: User | null;
  demo: boolean;
  displayName: string;
  canTeach: boolean;
  signOut: () => Promise<void>;
};
const IdentityContext = createContext<Identity>(null!);
export const useIdentity = () => useContext(IdentityContext);
type Mode = "login" | "signup" | "forgot" | "recovery";
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(!!supabase);
  const [demo, setDemo] = useState(false);
  const [recovery, setRecovery] = useState(
    new URLSearchParams(location.search).get("mode") === "recovery",
  );
  const [sessionError, setSessionError] = useState("");
  useEffect(() => {
    if (!supabase) return;
    let active = true;
    const client = supabase;
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
      setUser(session?.user || null);
      if (event !== "INITIAL_SESSION") setLoading(false);
    });
    client.auth
      .getUser()
      .then(({ data, error }) => {
        if (!active) return;
        setUser(data.user || null);
        if (error && error.name !== "AuthSessionMissingError")
          setSessionError(
            "Your session could not be restored. Please sign in again.",
          );
        setLoading(false);
      })
      .catch(() => {
        if (active) {
          setSessionError(
            "We couldn’t connect to account services. Please try again.",
          );
          setLoading(false);
        }
      });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);
  async function signOut() {
    if (supabase && user) {
      const { error } = await supabase.auth.signOut({scope:"local"});
      if (error) throw error;
    }
    setDemo(false);
    setUser(null);
    setRecovery(false);
  }
  if (loading)
    return (
      <div className="session-loading" role="status">
        <LoaderCircle className="spin" size={24} />
        <p>Opening your workspace…</p>
      </div>
    );
  const displayName =
    typeof user?.user_metadata?.display_name === "string"
      ? user.user_metadata.display_name
      : user?.email?.split("@")[0] || "Student";
  if ((user && !recovery) || demo) {
    const role = accountRole(user?.app_metadata);
    return (
      <IdentityContext.Provider
        value={{
          user,
          demo,
          displayName: demo ? "Jordan Smith" : displayName,
          canTeach: demo || role === "instructor",
          signOut,
        }}
      >
        <Provider
          key={accountStorageKey(user?.id || null)}
          storageKey={accountStorageKey(user?.id || null)}
          initialRole={demo ? "student" : role}
          allowInstructor={demo || role === "instructor"}
        >
          {children}
        </Provider>
      </IdentityContext.Provider>
    );
  }
  return (
    <AuthScreen
      initialMode={recovery ? "recovery" : "login"}
      initialError={sessionError}
      onDemo={() => setDemo(true)}
      onPasswordChanged={() => {
        setRecovery(false);
        history.replaceState(null, "", location.pathname);
      }}
    />
  );
}
function AuthScreen({
  initialMode,
  initialError,
  onDemo,
  onPasswordChanged,
}: {
  initialMode: Mode;
  initialError: string;
  onDemo: () => void;
  onPasswordChanged: () => void;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [name, setName] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initialError);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);
  function changeMode(next: Mode) {
    setMode(next);
    setError("");
    setNotice("");
    setPassword("");
    setConfirmation("");
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!supabase) {
      setError("Account access is being prepared. Please try again soon.");
      return;
    }
    setError("");
    setNotice("");
    if (mode === "signup" || mode === "recovery") {
      const validation = validateNewPassword(password, confirmation);
      if (validation) {
        setError(validation);
        return;
      }
    }
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { display_name: name.trim() },
            emailRedirectTo: location.origin + "/",
          },
        });
        if (error) throw error;
        if (!data.session)
          setNotice(
            "Check your email to confirm your account, then return here to sign in.",
          );
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(
          email.trim(),
          { redirectTo: location.origin + "/?mode=recovery" },
        );
        if (error) throw error;
        setNotice(
          "If an account exists for this email, you’ll receive a link to reset your password.",
        );
      } else {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setPassword("");
        setConfirmation("");
        onPasswordChanged();
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(
        /invalid login/i.test(message)
          ? "The email or password is incorrect. Please try again."
          : message,
      );
    } finally {
      setBusy(false);
    }
  }
  const title =
    mode === "signup"
      ? "Make room for your next “aha.”"
      : mode === "forgot"
        ? "Let’s get you back in."
        : mode === "recovery"
          ? "A fresh start."
          : "Welcome back.";
  return (
    <div className="auth-layout">
      <aside className="auth-brand-panel">
        <a className="auth-brand" href="/" aria-label="Kaizen home">
          <span>改善</span>
          <strong>
            kaizen<span>✳</span>
          </strong>
        </a>
        <div className="auth-brand-copy">
          <span className="auth-kicker">YOUR THINKING. YOUR POSSIBILITY.</span>
          <h1>
            A little better.
            <br />
            Every day.
          </h1>
          <p>
            A learning companion that helps you understand the next step—and why
            it matters.
          </p>
          <div className="auth-illustration">
            <div className="auth-orbit" />
            <img
              src="/assets/mascot.png"
              alt="Kaizen, your friendly robot learning companion"
            />
            <span className="auth-note">the “aha!” is yours.</span>
          </div>
        </div>
        <div className="auth-brand-footer">
          <ShieldCheck size={16} />
          <span>Thoughtful guidance. Independent thinking.</span>
        </div>
      </aside>
      <main className="auth-main">
        <div className="auth-top">
          <span>PERSONALIZED LEARNING · INSTRUCTOR-GUIDED AI</span>
        </div>
        <section className="auth-form-panel">
          <div className="auth-mini-logo">
            改善 <b>kaizen</b>
          </div>
          <div className="auth-welcome-icon">
            <GraduationCap size={24} />
          </div>
          <h2>{title}</h2>
          <p className="auth-subtitle">
            {mode === "signup"
              ? "Create your student account and start building understanding."
              : mode === "forgot"
                ? "Enter your email and we’ll send a password reset link."
                : mode === "recovery"
                  ? "Choose a strong new password for your Kaizen account."
                  : "Sign in to your Kaizen learning workspace."}
          </p>
          {mode !== "forgot" && mode !== "recovery" && (
            <div className="auth-tabs">
              <button
                className={mode === "login" ? "active" : ""}
                onClick={() => changeMode("login")}
                disabled={busy}
              >
                Sign in
              </button>
              <button
                className={mode === "signup" ? "active" : ""}
                onClick={() => changeMode("signup")}
                disabled={busy}
              >
                Create account
              </button>
            </div>
          )}
          <form onSubmit={submit} className="auth-form">
            {mode === "signup" && (
              <label>
                Full name
                <input
                  required
                  minLength={2}
                  maxLength={120}
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  disabled={busy}
                />
              </label>
            )}
            {mode !== "recovery" && (
              <label>
                Email address
                <div className="auth-input-icon">
                  <Mail size={17} />
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@university.edu"
                    disabled={busy}
                  />
                </div>
              </label>
            )}
            {mode !== "forgot" && (
              <label>
                {mode === "recovery" ? "New password" : "Password"}
                <div className="auth-input-icon">
                  <LockKeyhole size={17} />
                  <input
                    required
                    type={show ? "text" : "password"}
                    aria-label={mode === "recovery" ? "New password" : "Password"}
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      mode === "login"
                        ? "Enter your password"
                        : "At least 8 characters"
                    }
                    minLength={mode === "login" ? undefined : 8}
                    maxLength={128}
                    disabled={busy}
                  />
                  <button
                    type="button"
                    aria-label={show ? "Hide password" : "Show password"}
                    onClick={() => setShow(!show)}
                    disabled={busy}
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>
            )}
            {(mode === "signup" || mode === "recovery") && (
              <label>
                Confirm password
                <input
                  required
                  type={show ? "text" : "password"}
                  aria-label="Confirm password"
                  autoComplete="new-password"
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  placeholder="Enter your password again"
                  disabled={busy}
                />
              </label>
            )}
            {mode === "login" && (
              <div className="auth-form-options">
                <span>
                  <ShieldCheck size={13} />
                  Secure account access
                </span>
                <button
                  type="button"
                  className="text-link"
                  onClick={() => changeMode("forgot")}
                  disabled={busy}
                >
                  Forgot password?
                </button>
              </div>
            )}
            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}
            {notice && (
              <div className="auth-success" role="status">
                <CheckCircle2 size={18} />
                <span>{notice}</span>
              </div>
            )}
            <button
              className="auth-submit"
              disabled={busy || !supabase}
              type="submit"
            >
              {busy ? (
                <>
                  <LoaderCircle size={17} className="spin" />
                  Please wait…
                </>
              ) : (
                <>
                  {mode === "login"
                    ? "Sign in to Kaizen"
                    : mode === "signup"
                      ? "Create account"
                      : mode === "forgot"
                        ? "Send reset link"
                        : "Update password"}
                  <ArrowRight size={17} />
                </>
              )}
            </button>
            {!supabase && (
              <p className="auth-service-note">
                Account access is being prepared. Please try again soon.
              </p>
            )}
          </form>
          {(mode === "forgot" || mode === "recovery") && (
            <button
              className="auth-back"
              onClick={() => changeMode("login")}
              disabled={busy}
            >
              <ArrowLeft size={14} />
              Back to sign in
            </button>
          )}
          {mode === "signup" && (
            <div className="auth-instructor-note">
              <GraduationCap size={18} />
              <p>
                Teaching a course? Instructor access is assigned by your
                workspace administrator.
              </p>
            </div>
          )}
          {demoEnabled && mode === "login" && (
            <div className="auth-demo">
              <span>Just taking a look?</span>
              <button onClick={onDemo}>
                Explore the demo
                <ArrowRight size={14} />
              </button>
              <small>Sample profiles and data. No account required.</small>
            </div>
          )}
          <div className="auth-bottom-note">
            <LockKeyhole size={12} />
            Your password is handled securely by Supabase Auth.
          </div>
        </section>
        <footer className="auth-footer">
          改善 · Continuous improvement, one step at a time.
        </footer>
      </main>
    </div>
  );
}
