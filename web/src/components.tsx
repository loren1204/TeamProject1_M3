import React, { useEffect, useRef, useId } from "react";
import { X, ArrowUpRight, Info, ChevronDown } from "lucide-react";
export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={"card " + className}>{children}</section>;
}
export function Button({
  children,
  variant = "",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }) {
  return (
    <button className={`btn ${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
export function Badge({
  children,
  tone = "",
}: {
  children: React.ReactNode;
  tone?: string;
}) {
  return <span className={"badge " + tone}>{children}</span>;
}
export function Heading({
  title,
  subtitle,
  action,
  kicker,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  kicker?: string;
}) {
  return (
    <div className="page-heading">
      <div>
        {kicker && <div className="kicker">{kicker}</div>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
export function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="section-title">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
export function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current!;
    d.showModal();
    return () => d.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className={wide ? "modal wide" : "modal"}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-head">
        <h2>{title}</h2>
        <button
          className="icon-button"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function Empty({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="empty">
      <Info />
      <h2>{title}</h2>
      <p>{body}</p>
      {action}
    </Card>
  );
}
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  const id = useId();
  const control =
    React.isValidElement(children) &&
    typeof children.type === "string" &&
    ["input", "textarea", "select"].includes(children.type);
  return (
    <div className="field">
      {control ? <label htmlFor={id}>{label}</label> : <span>{label}</span>}
      {control
        ? React.cloneElement(children as React.ReactElement<{ id: string }>, {
            id,
          })
        : children}
      {hint && <small>{hint}</small>}
    </div>
  );
}
export function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="toggle-row">
      <span>
        <b>{label}</b>
        <small>{description}</small>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        role="switch"
      />
      <span className={"switch " + (checked ? "on" : "")} aria-hidden="true" />
    </label>
  );
}
export function Progress({ value }: { value: number }) {
  return (
    <div
      className="progress"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span style={{ width: value + "%" }} />
    </div>
  );
}
export function Diagram() {
  return (
    <svg
      className="diagram"
      viewBox="0 0 310 225"
      role="img"
      aria-label="Sample free-body diagram: a 5 kilogram block on a 30 degree incline; a normal force points perpendicular out of the plane, and gravity points vertically downward. Components are intentionally missing for demonstration."
    >
      <defs>
        <pattern
          id="paper"
          width="16"
          height="16"
          patternUnits="userSpaceOnUse"
        >
          <path d="M16 0H0V16" fill="none" stroke="#d9e5f0" strokeWidth=".5" />
        </pattern>
        <marker
          id="arrowBlue"
          markerWidth="7"
          markerHeight="7"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0 0L6 3L0 6" fill="#2454be" />
        </marker>
        <marker
          id="arrowRed"
          markerWidth="7"
          markerHeight="7"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0 0L6 3L0 6" fill="#bd675d" />
        </marker>
      </defs>
      <rect width="310" height="225" fill="#fcfcf9" />
      <rect width="310" height="225" fill="url(#paper)" />
      <path
        d="M35 180H280L280 41Z"
        fill="#edf0f3"
        stroke="#687185"
        strokeWidth="1.8"
      />
      <g transform="translate(167 104) rotate(-30)">
        <rect
          x="-22"
          y="-30"
          width="44"
          height="30"
          rx="3"
          fill="#fff8dc"
          stroke="#5c6375"
          strokeWidth="1.7"
        />
      </g>
      <path
        d="M163 89L130 31"
        stroke="#2454be"
        strokeWidth="2"
        markerEnd="url(#arrowBlue)"
      />
      <text
        x="111"
        y="28"
        fill="#2454be"
        fontSize="14"
        fontFamily="Georgia,serif"
        fontStyle="italic"
      >
        N
      </text>
      <path
        d="M163 89V159"
        stroke="#bd675d"
        strokeWidth="2"
        markerEnd="url(#arrowRed)"
      />
      <text
        x="173"
        y="155"
        fill="#ad554f"
        fontSize="14"
        fontFamily="Georgia,serif"
        fontStyle="italic"
      >
        mg
      </text>
      <path d="M77 180A42 42 0 0 0 71 159" fill="none" stroke="#7c8494" />
      <text x="84" y="170" fontSize="13" fill="#4b566d">
        30°
      </text>
      <text x="191" y="69" fontSize="12" fill="#4b566d">
        m = 5.0 kg
      </text>
      <text x="16" y="210" fontSize="9" fill="#8a93a3">
        SAMPLE STUDENT DIAGRAM · NOT ANALYZED BY A MODEL
      </text>
    </svg>
  );
}
export const jumpIcon = <ArrowUpRight size={16} />;
