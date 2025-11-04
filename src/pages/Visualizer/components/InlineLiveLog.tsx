import { useEffect, useMemo, useRef, useState } from "react";

type InlineLiveLogProps = {
  events: any[];
  visible: boolean;
  activeDrawId?: string | null;
};

export function InlineLiveLog({ events, visible, activeDrawId }: InlineLiveLogProps) {
  const computeLast = useMemo(() => {
    const last = events?.length ? events[events.length - 1] : null;
  if (!last) return "Waiting for events...";
    const t = typeof last?.type === "string" ? last.type : "unknown";
    return t;
  }, [events]);

  const [displayed, setDisplayed] = useState<string>("Waiting for events...");
  const lastChangeAtRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);
  const MIN_SHOW_MS = 400;

  // Reset on new drawId
  useEffect(() => {
    setDisplayed("Waiting for events...");
    lastChangeAtRef.current = 0;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [activeDrawId]);

  // Throttled line update
  useEffect(() => {
    if (!visible) return;
    const now = Date.now();
    const since = now - lastChangeAtRef.current;
    const update = () => {
      setDisplayed(computeLast);
      lastChangeAtRef.current = Date.now();
      timerRef.current = null;
    };
    if (since >= MIN_SHOW_MS || lastChangeAtRef.current === 0) {
      update();
    } else {
      const delay = MIN_SHOW_MS - since;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(update, delay) as unknown as number;
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [computeLast, visible]);

  if (!visible) return null;

  return (
    <div className="mt-2 text-xs md:text-sm font-mono text-muted-foreground">
      {displayed}
    </div>
  );
}

export default InlineLiveLog;


