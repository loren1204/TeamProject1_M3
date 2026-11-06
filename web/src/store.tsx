import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Role,
  Policy,
  Assignment,
  Material,
  Event,
  defaultPolicy,
  assignments,
  materials,
} from "./data";
export type DemoState = {
  role: Role;
  policy: Policy;
  assignments: Assignment[];
  materials: Material[];
  events: Event[];
  course: string;
  compact: boolean;
  tutorEvents: { assignmentId: string; level: number; at: number }[];
};
const initial: DemoState = {
  role: "student",
  policy: defaultPolicy,
  assignments,
  materials,
  events: [],
  course: "Physics I",
  compact: false,
  tutorEvents: [],
};
const Context = createContext<{
  state: DemoState;
  set: React.Dispatch<React.SetStateAction<DemoState>>;
  notify: (s: string) => void;
  reset: () => void;
}>(null!);
export function Provider({ children }: { children: React.ReactNode }) {
  const [state, set] = useState<DemoState>(() => {
    try {
      const s = JSON.parse(localStorage.getItem("kaizen-app-v2") || "null");
      if (s?.assignments?.length && s?.policy) return { ...initial, ...s };
    } catch {}
    return structuredClone(initial);
  });
  const [toast, notify] = useState("");
  useEffect(() => {
    try {
      localStorage.setItem("kaizen-app-v2", JSON.stringify(state));
    } catch {
      notify(
        "Browser storage is unavailable. Changes will last for this session only.",
      );
    }
  }, [state]);
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => notify(""), 3400);
      return () => clearTimeout(t);
    }
  }, [toast]);
  return (
    <Context.Provider
      value={{
        state,
        set,
        notify,
        reset: () => {
          set(structuredClone(initial));
          notify("Demonstration reset to defaults.");
        },
      }}
    >
      {children}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </Context.Provider>
  );
}
export const useDemo = () => useContext(Context);
