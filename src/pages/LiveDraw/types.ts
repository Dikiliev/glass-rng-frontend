import type { SolanaBlock } from "../../lib/types";

export type CommitEvent = { type: "commit"; drawId: string; blocks: number; source: string };
export type BlockWaitingEvent = { type: "block.waiting"; drawId: string; note: string };
export type BlockFinalizedAllEvent = {
    type: "block.finalized_all";
    drawId: string;
    explorers: SolanaBlock[];
    beaconHex?: string;
};
export type MixStartEvent = { type: "mix.start"; drawId: string; inputs: string[] };
export type MixTraceEvent = {
    type: "mix.trace";
    drawId: string;
    beaconHex: string;
    pubComponentHex: string;
    hkdfSaltHex: string;
    seedHex: string;
    chachaFirst16Hex: string;
    u64: string;
    u01: { fraction: { num: string; den: string }; decimal18: string };
};
export type ResultEvent = { type: "result"; drawId: string; seedHex: string; number: string };
export type ErrorEvent = { type: "error"; drawId: string; stage: string; message: string };
export type LocProgressEvent = {
    type: "loc.progress";
    drawId: string;
    source: "USER" | "SRV";
    bytesTotal: number;
    packets: number;
    rootHex: string;
};

export type CollectSummaryEvent = {
    type: "collect.summary";
    drawId: string;
    bytes: number;
    rootHex: string;
    urandomBytes?: number;
    jitterBatches?: number;
    jitterBytes?: number;
    jitterSamplesTotal?: number;
};

export type MixCompareEvent = {
    type: "mix.compare";
    drawId: string;
    pub: {
        seedHex: string;
        chachaFirst16Hex: string;
        u64: string;
        u01: { fraction: { num: string; den: string }; decimal18: string };
    };
    pub_loc: {
        seedHex: string;
        chachaFirst16Hex: string;
        u64: string;
        u01: { fraction: { num: string; den: string }; decimal18: string };
    };
};

export type CollectOpenEvent  = {
    type: "collect.open";
    drawId: string;
    deadlineMs: number;
    bytes: number;
    rootHex?: string | null;
};
export type CollectTickEvent  = {
    type: "collect.tick";
    drawId: string;
    remainingMs: number;
    bytes: number;
};
export type CollectCloseEvent = {
    type: "collect.close";
    drawId: string;
    bytes: number;
    rootHex?: string | null;
};

export type AnyEvent =
    | CommitEvent
    | BlockWaitingEvent
    | BlockFinalizedAllEvent
    | MixStartEvent
    | MixTraceEvent
    | ResultEvent
    | ErrorEvent
    | LocProgressEvent
    | CollectOpenEvent
    | CollectTickEvent
    | CollectCloseEvent
    | CollectSummaryEvent
    | MixCompareEvent;