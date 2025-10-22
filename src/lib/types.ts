import { z } from "zod";

export const SolanaBlockZ = z.object({
    slot: z.number(),
    blockhash: z.string(),
    explorerUrl: z.string().url(),
});

export type SolanaBlock = z.infer<typeof SolanaBlockZ>;

export const DrawEventZ = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("commit"),
        drawId: z.string(),
        blocks: z.number(),
        source: z.literal("SOLANA"),
    }),
    z.object({
        type: z.literal("block.waiting"),
        drawId: z.string(),
        note: z.string(),
    }),
    z.object({
        type: z.literal("block.finalized_all"),
        drawId: z.string(),
        explorers: z.array(SolanaBlockZ),
    }),
    z.object({
        type: z.literal("mix.start"),
        drawId: z.string(),
        inputs: z.array(z.string()),
    }),
    z.object({
        type: z.literal("result"),
        drawId: z.string(),
        seedHex: z.string(),
        number: z.string(),
    }),
]);

export type DrawEvent = z.infer<typeof DrawEventZ>;

export interface StartSolanaDrawDto {
    draw_id: string;
    blocks?: number; // default на беке = 3
    include_local?: boolean;
    include_quantum?: boolean;
}

export interface StartSolanaDrawResp {
    draw_id: string;
    seed_hex: string;
    number_u64: string;
    beacon_hex: string;
    solana: SolanaBlock[];
}
