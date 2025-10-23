import { useEffect, useState } from "react";
import { subscribeDrawSSE } from "../../../lib/stream";
import type {
    AnyEvent,
    BlockFinalizedAllEvent,
    MixTraceEvent,
    LocProgressEvent,
    ErrorEvent,
    CollectOpenEvent,
    CollectTickEvent,
    CollectCloseEvent,
    CollectSummaryEvent,
    MixCompareEvent,
} from "../types";

const isBlockFinalized = (e: AnyEvent): e is BlockFinalizedAllEvent =>
    e.type === "block.finalized_all" && Array.isArray((e as any).explorers);
const isMixTrace = (e: AnyEvent): e is MixTraceEvent => e.type === "mix.trace";
const isErrorEv = (e: AnyEvent): e is ErrorEvent => e.type === "error";
const isLocProgress = (e: AnyEvent): e is LocProgressEvent => e.type === "loc.progress";
const isCollectOpen  = (e: AnyEvent): e is CollectOpenEvent => e.type === "collect.open";
const isCollectTick  = (e: AnyEvent): e is CollectTickEvent => e.type === "collect.tick";
const isCollectClose = (e: AnyEvent): e is CollectCloseEvent => e.type === "collect.close";
const isCollectSummary = (e: AnyEvent): e is CollectSummaryEvent => e.type === "collect.summary";
const isMixCompare = (e: AnyEvent): e is MixCompareEvent => e.type === "mix.compare";

export function useDrawSSE(drawId: string) {
    const [events, setEvents] = useState<AnyEvent[]>([]);
    const [statusNote, setStatusNote] = useState<string | null>(null);

    const [inputs, setInputs] = useState<string[]>([]);
    const [blocksList, setBlocksList] = useState<any[]>([]);
    const [beaconHex, setBeaconHex] = useState<string | null>(null);
    const [seedHex, setSeedHex] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [trace, setTrace] = useState<MixTraceEvent | null>(null);

    // локальный шум — текущий прогресс
    const [locBytes, setLocBytes] = useState(0);
    const [locPackets, setLocPackets] = useState(0);
    const [locRoot, setLocRoot] = useState<string | null>(null);

    // окно сбора
    const [collectOpen, setCollectOpen] = useState(false);
    const [collectRemainMs, setCollectRemainMs] = useState<number | null>(null);

    // сводка шума
    const [locSummary, setLocSummary] = useState<CollectSummaryEvent | null>(null);

    // сравнение результатов (PUB vs PUB+LOC)
    const [compare, setCompare] = useState<MixCompareEvent | null>(null);

    useEffect(() => {
        if (!drawId) return;
        const unsub = subscribeDrawSSE(drawId, (e: AnyEvent) => {
            setEvents(prev => [...prev, e]);

            if (e.type === "block.waiting") setStatusNote(e.note);

            if (isBlockFinalized(e)) {
                setBlocksList(e.explorers as any[]);
                if ((e as any).beaconHex) setBeaconHex((e as any).beaconHex);
                setStatusNote(null);
            }

            if (e.type === "mix.start") setInputs((e as any).inputs ?? []);
            if (isMixTrace(e)) { setTrace(e); setSeedHex(e.seedHex); }
            if (e.type === "result") { setSeedHex((e as any).seedHex); setResult((e as any).number); }
            if (isErrorEv(e)) { console.error("RNG error:", e.stage, e.message); }

            if (isLocProgress(e)) {
                setLocBytes(e.bytesTotal);
                setLocPackets(e.packets);
                setLocRoot(e.rootHex);
            }

            if (isCollectOpen(e))  { setCollectOpen(true);  setCollectRemainMs(e.deadlineMs ?? null); }
            if (isCollectTick(e))  { setCollectRemainMs(e.remainingMs ?? null); }
            if (isCollectClose(e)) { setCollectOpen(false); setCollectRemainMs(null); }

            if (isCollectSummary(e)) setLocSummary(e);
            if (isMixCompare(e)) setCompare(e);
        });
        return () => unsub();
    }, [drawId]);

    return {
        events,
        statusNote,
        inputs,
        blocksList,
        beaconHex,
        seedHex,
        result,
        trace,
        locBytes,
        locPackets,
        locRoot,
        collectOpen,
        collectRemainMs,
        locSummary,
        compare,
    };
}
