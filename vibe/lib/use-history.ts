"use client";

import { useState, useCallback, useEffect } from "react";

interface UseHistoryReturn<T> {
  state: T;
  set: (value: T | ((prev: T) => T)) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const MAX_HISTORY = 30;

export function useHistory<T>(initial: T): UseHistoryReturn<T> {
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState<T>(initial);
  const [future, setFuture] = useState<T[]>([]);

  const set = useCallback((value: T | ((prev: T) => T)) => {
    setPresent((prev) => {
      const next = typeof value === "function" ? (value as (prev: T) => T)(prev) : value;
      if (next === prev) return prev;
      setPast((p) => [...p.slice(-(MAX_HISTORY - 1)), prev]);
      setFuture([]);
      return next;
    });
  }, []);

  const undo = useCallback(() => {
    setPast((p) => {
      if (p.length === 0) return p;
      const previous = p[p.length - 1];
      const newPast = p.slice(0, -1);
      setPresent((curr) => {
        setFuture((f) => [curr, ...f]);
        return previous;
      });
      return newPast;
    });
  }, []);

  const redo = useCallback(() => {
    setFuture((f) => {
      if (f.length === 0) return f;
      const next = f[0];
      const newFuture = f.slice(1);
      setPresent((curr) => {
        setPast((p) => [...p, curr]);
        return next;
      });
      return newFuture;
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (isMod && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        redo();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return { state: present, set, undo, redo, canUndo: past.length > 0, canRedo: future.length > 0 };
}
