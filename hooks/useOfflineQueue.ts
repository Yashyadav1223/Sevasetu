"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "sevasetu-local-field-reports";

export function useOfflineQueue() {
  const [queuedCount, setQueuedCount] = useState(0);

  const refresh = useCallback(() => {
    if (typeof window === "undefined") return;
    const queue = JSON.parse(localStorage.getItem(KEY) || "[]") as unknown[];
    setQueuedCount(queue.length);
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("online", refresh);
    return () => window.removeEventListener("online", refresh);
  }, [refresh]);

  const queueReport = useCallback(
    (report: unknown) => {
      const queue = JSON.parse(localStorage.getItem(KEY) || "[]") as unknown[];
      queue.push({ report, createdAt: new Date().toISOString() });
      localStorage.setItem(KEY, JSON.stringify(queue));
      refresh();
    },
    [refresh]
  );

  const clearQueue = useCallback(() => {
    localStorage.removeItem(KEY);
    refresh();
  }, [refresh]);

  return { queuedCount, queueReport, clearQueue, refresh };
}
