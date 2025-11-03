import { useState, useEffect, useRef } from "react";

type Step = "idle" | "fetching" | "acquired" | "gathering" | "applying" | "calculating" | "result";

interface UseAnimationSequenceProps {
  events: any[];
  blocksList: any[];
  result: string | number | null;
  activeDrawId: string | null;
}

const STEP_DURATION_DEFAULT = 1000; // 1 секунда по умолчанию
const STEP_DURATION_MAP: Partial<Record<Step, number>> = {
  acquired: 2000, // показываем найденные блоки дольше
};

// Маппинг событий на шаги и их порядок
const orderedSteps: Step[] = ["fetching", "acquired", "gathering", "applying", "calculating", "result"];

export function useAnimationSequence({
  events,
  blocksList,
  result,
  activeDrawId,
}: UseAnimationSequenceProps) {
  const [displayStep, setDisplayStep] = useState<Step>("idle");
  const timeoutRef = useRef<number | null>(null);
  const lastDrawIdRef = useRef<string>("");
  const finalResultRef = useRef<string | number | null>(null);
  const currentIndexRef = useRef<number>(-1);

  // Сброс при новом drawId
  useEffect(() => {
    if (activeDrawId && activeDrawId !== lastDrawIdRef.current) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setDisplayStep("idle");
      lastDrawIdRef.current = activeDrawId;
      finalResultRef.current = null;
      currentIndexRef.current = -1;
    }
  }, [activeDrawId]);

  // Вычисляем максимально достигнутый шаг на основании пришедших событий
  const getMaxStepIndexFromEvents = (): number => {
    const types = new Set(events.map((e) => e.type));
    let idx = -1;
    if (types.has("block.waiting")) idx = Math.max(idx, orderedSteps.indexOf("fetching"));
    if (types.has("block.finalized_all") && blocksList.length > 0) idx = Math.max(idx, orderedSteps.indexOf("acquired"));
    if (types.has("collect.open")) idx = Math.max(idx, orderedSteps.indexOf("gathering"));
    if (types.has("collect.close") || types.has("collect.summary")) idx = Math.max(idx, orderedSteps.indexOf("applying"));
    if (types.has("mix.start") || types.has("mix.trace")) idx = Math.max(idx, orderedSteps.indexOf("calculating"));
    if (types.has("result") && result !== null) {
      idx = Math.max(idx, orderedSteps.indexOf("result"));
      finalResultRef.current = result;
    }
    return idx;
  };

  // Проигрываем шаги последовательно до максимального достигнутого
  useEffect(() => {
    let targetIndex = getMaxStepIndexFromEvents();

    // Если генерация активна, но ещё нет событий — начинаем с fetching
    if (activeDrawId && targetIndex < 0) {
      targetIndex = 0; // fetching
    }
    if (targetIndex <= currentIndexRef.current) return;

    // Если мы на idle и есть хотя бы один шаг — начинаем сразу
    const startFrom = Math.max(currentIndexRef.current + 1, 0);

    const playNext = (i: number) => {
      if (i > targetIndex) return;
      const step = orderedSteps[i];
      setDisplayStep(step);
      currentIndexRef.current = i;
      if (i < targetIndex) {
        const delay = STEP_DURATION_MAP[step] ?? STEP_DURATION_DEFAULT;
        timeoutRef.current = setTimeout(() => playNext(i + 1), delay) as unknown as number;
      }
    };

    // Если первый показ
    if (currentIndexRef.current === -1 && targetIndex >= 0) {
      playNext(0);
    } else {
      // Продолжаем с следующего индекса
      playNext(startFrom);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [events, blocksList, result, activeDrawId]);

  const fixedResult =
    displayStep === "result" && finalResultRef.current !== null ? finalResultRef.current : null;

  return { displayStep, fixedResult };
}
