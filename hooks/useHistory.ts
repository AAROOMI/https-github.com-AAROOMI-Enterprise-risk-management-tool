import { useState, useCallback } from 'react';

export const useHistory = <T,>(initialState: T) => {
  const [history, setHistory] = useState<{ past: T[], present: T, future: T[] }>({
    past: [],
    present: initialState,
    future: [],
  });

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const undo = useCallback(() => {
    if (!canUndo) return;
    const { past, present, future } = history;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    setHistory({
      past: newPast,
      present: previous,
      future: [present, ...future],
    });
  }, [canUndo, history]);

  const redo = useCallback(() => {
    if (!canRedo) return;
    const { past, present, future } = history;
    const next = future[0];
    const newFuture = future.slice(1);
    setHistory({
      past: [...past, present],
      present: next,
      future: newFuture,
    });
  }, [canRedo, history]);

  const setState = useCallback((newState: T | ((prevState: T) => T)) => {
    const { present } = history;
    const newPresent = typeof newState === 'function' ? (newState as (prevState: T) => T)(present) : newState;

    // Don't add to history if state is the same
    if (JSON.stringify(newPresent) === JSON.stringify(present)) {
        return;
    }

    setHistory({
      past: [...history.past, present],
      present: newPresent,
      future: [], // Clear future on new state
    });
  }, [history]);
  
  const setInitialState = useCallback((initial: T) => {
    setHistory({
        past: [],
        present: initial,
        future: []
    });
  }, []);

  return { state: history.present, setState, setInitialState, undo, redo, canUndo, canRedo };
};
