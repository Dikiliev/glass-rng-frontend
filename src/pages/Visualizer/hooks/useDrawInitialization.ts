import { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { startSolanaDraw } from "@/lib/api";
import { subscribeCurrentSSE } from "@/lib/stream";

export function useDrawInitialization() {
  const { drawId: drawIdParam } = useParams<{ drawId?: string }>();
  const qs = new URLSearchParams(useLocation().search);
  const mode = qs.get("mode");
  const blocksCount = parseInt(qs.get("blocks") || "3", 10);
  const drawId = drawIdParam || `draw-${Date.now()}`;

  const [currentId, setCurrentId] = useState<string | null>(null);
  const startedRef = useRef(false);

  // Подписка на SSE
  useEffect(() => {
    const unsub = subscribeCurrentSSE((msg) => {
      if (msg?.drawId) setCurrentId(msg.drawId);
    });
    return () => unsub();
  }, []);

  const activeDrawId = currentId || (drawIdParam ? drawIdParam : mode ? drawId : null);

  // Запуск генерации
  useEffect(() => {
    if (!activeDrawId || startedRef.current || !mode) return;
    startedRef.current = true;

    if (mode === "solana-blocks") {
      startSolanaDraw({
        draw_id: activeDrawId,
        blocks: blocksCount,
        collect_ms: 8000,
        srv_jitter: true,
        srv_jitter_samples: 12000,
        srv_urandom_bytes: 1024,
      }).catch(console.error);
    }
  }, [activeDrawId, mode, blocksCount]);

  return { activeDrawId, blocksCount };
}

