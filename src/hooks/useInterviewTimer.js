import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Live interview countdown timer with auto-submit support.
 * @param {number} limitMinutes - Maximum interview duration in minutes (0 = no limit)
 * @param {Function} onTimeUp - Callback triggered when time runs out
 */
const useInterviewTimer = (limitMinutes = 30, onTimeUp = null) => {
  const [elapsed, setElapsed] = useState(0); // seconds
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  const start = useCallback(() => {
    if (running) return;
    startTimeRef.current = Date.now() - elapsed * 1000;
    setRunning(true);
  }, [running, elapsed]);

  const pause = useCallback(() => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const reset = useCallback(() => {
    setRunning(false);
    setElapsed(0);
    setFinished(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      const newElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsed(newElapsed);

      if (limitMinutes > 0 && newElapsed >= limitMinutes * 60) {
        setFinished(true);
        setRunning(false);
        clearInterval(intervalRef.current);
        if (onTimeUp) onTimeUp();
      }
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running, limitMinutes, onTimeUp]);

  const remaining = limitMinutes > 0 ? Math.max(0, limitMinutes * 60 - elapsed) : null;
  const elapsedMinutes = Math.floor(elapsed / 60);

  const format = (secs) => {
    if (secs === null) return null;
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const percentUsed = limitMinutes > 0 ? Math.min(100, (elapsed / (limitMinutes * 60)) * 100) : 0;
  const isWarning = remaining !== null && remaining <= 300; // last 5 minutes
  const isCritical = remaining !== null && remaining <= 60; // last 1 minute

  return {
    elapsed,
    elapsedMinutes,
    remaining,
    running,
    finished,
    start,
    pause,
    reset,
    formattedElapsed: format(elapsed),
    formattedRemaining: format(remaining),
    percentUsed,
    isWarning,
    isCritical,
  };
};

export default useInterviewTimer;
