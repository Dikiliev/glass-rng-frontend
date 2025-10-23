// src/lib/types.ts
import { z } from "zod";

/** ── базовые типы ─────────────────────────────────────────────────────────── */
export const SolanaBlockSchema = z.object({
    slot: z.number(),
    blockhash: z.string(),
    explorerUrl: z.string(),
});
export type SolanaBlock = z.infer<typeof SolanaBlockSchema>;

/** ── события ──────────────────────────────────────────────────────────────── */
const CommitEventSchema = z.object({
    type: z.literal("commit"),
    drawId: z.string(),
    blocks: z.number(),
    source: z.string(),
});

const BlockWaitingEventSchema = z.object({
    type: z.literal("block.waiting"),
    drawId: z.string(),
    note: z.string(),
});

const BlockFinalizedAllEventSchema = z.object({
    type: z.literal("block.finalized_all"),
    drawId: z.string(),
    explorers: z.array(SolanaBlockSchema),
    beaconHex: z.string().optional(),
});

const MixStartEventSchema = z.object({
    type: z.literal("mix.start"),
    drawId: z.string(),
    inputs: z.array(z.string()),
});

const MixTraceEventSchema = z.object({
    type: z.literal("mix.trace"),
    drawId: z.string(),
    beaconHex: z.string(),
    pubComponentHex: z.string(),
    hkdfSaltHex: z.string(),
    seedHex: z.string(),
    chachaFirst16Hex: z.string(),
    u64: z.string(),
    u01: z.object({
        fraction: z.object({ num: z.string(), den: z.string() }),
        decimal18: z.string(),
    }),
});

const ResultEventSchema = z.object({
    type: z.literal("result"),
    drawId: z.string(),
    seedHex: z.string(),
    number: z.string(),
});

const ErrorEventSchema = z.object({
    type: z.literal("error"),
    drawId: z.string(),
    stage: z.string(),
    message: z.string(),
});

const LocProgressEventSchema = z.object({
    type: z.literal("loc.progress"),
    drawId: z.string(),
    source: z.union([z.literal("USER"), z.literal("SRV")]),
    bytesTotal: z.number(),
    packets: z.number(),
    rootHex: z.string(),
});

const CollectOpenEventSchema = z.object({
    type: z.literal("collect.open"),
    drawId: z.string(),
    deadlineMs: z.number(),
    bytes: z.number(),
    rootHex: z.string().nullable().optional(),
});

const CollectTickEventSchema = z.object({
    type: z.literal("collect.tick"),
    drawId: z.string(),
    remainingMs: z.number(),
    bytes: z.number(),
});

const CollectCloseEventSchema = z.object({
    type: z.literal("collect.close"),
    drawId: z.string(),
    bytes: z.number(),
    rootHex: z.string().nullable().optional(),
});

const CollectSummaryEventSchema = z.object({
    type: z.literal("collect.summary"),
    drawId: z.string(),
    bytes: z.number(),
    rootHex: z.string(),
    urandomBytes: z.number().optional(),
    jitterBatches: z.number().optional(),
    jitterBytes: z.number().optional(),
    jitterSamplesTotal: z.number().optional(),
});

const MixSideSchema = z.object({
    seedHex: z.string(),
    chachaFirst16Hex: z.string(),
    u64: z.string(),
    u01: z.object({
        fraction: z.object({ num: z.string(), den: z.string() }),
        decimal18: z.string(),
    }),
});

const MixCompareEventSchema = z.object({
    type: z.literal("mix.compare"),
    drawId: z.string(),
    pub: MixSideSchema,
    pub_loc: MixSideSchema,
});

/** ── union ────────────────────────────────────────────────────────────────── */
export const DrawEventSchema = z.discriminatedUnion("type", [
    CommitEventSchema,
    BlockWaitingEventSchema,
    BlockFinalizedAllEventSchema,
    MixStartEventSchema,
    MixTraceEventSchema,
    ResultEventSchema,
    ErrorEventSchema,
    LocProgressEventSchema,
    CollectOpenEventSchema,
    CollectTickEventSchema,
    CollectCloseEventSchema,
    CollectSummaryEventSchema,
    MixCompareEventSchema,
]);

export type CommitEvent             = z.infer<typeof CommitEventSchema>;
export type BlockWaitingEvent       = z.infer<typeof BlockWaitingEventSchema>;
export type BlockFinalizedAllEvent  = z.infer<typeof BlockFinalizedAllEventSchema>;
export type MixStartEvent           = z.infer<typeof MixStartEventSchema>;
export type MixTraceEvent           = z.infer<typeof MixTraceEventSchema>;
export type ResultEvent             = z.infer<typeof ResultEventSchema>;
export type ErrorEvent              = z.infer<typeof ErrorEventSchema>;
export type LocProgressEvent        = z.infer<typeof LocProgressEventSchema>;
export type CollectOpenEvent        = z.infer<typeof CollectOpenEventSchema>;
export type CollectTickEvent        = z.infer<typeof CollectTickEventSchema>;
export type CollectCloseEvent       = z.infer<typeof CollectCloseEventSchema>;
export type CollectSummaryEvent     = z.infer<typeof CollectSummaryEventSchema>;
export type MixCompareEvent         = z.infer<typeof MixCompareEventSchema>;

export type DrawEvent = z.infer<typeof DrawEventSchema>;
