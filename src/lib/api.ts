import axios from "axios";
import type { StartSolanaDrawDto, StartSolanaDrawResp } from "./types";
import {api} from "./http.ts";



export async function startSolanaDraw(payload: StartSolanaDrawDto) {
    const { data } = await api.post<StartSolanaDrawResp>("/draws/solana", payload);
    return data;
}

export async function sendUserEntropy(drawId: string, payloadHex: string) {
    const { data } = await api.post(`/entropy/${encodeURIComponent(drawId)}/user`, { payload_hex: payloadHex });
    return data as { ok: boolean; root_hex: string };
}

export async function addServerJitter(drawId: string, samples = 20000) {
    const { data } = await api.post(`/entropy/${encodeURIComponent(drawId)}/server-jitter?samples=${samples}`);
    return data as { ok: boolean; added_bytes: number; root_hex: string };
}

export async function sampleRangeBySeed(params: {
    seed_hex: string;
    n1: number | string;
    n2: number | string;
    label?: string;
    draw_id?: string;
}) {
    const { data } = await api.post("/range/by-seed", {
        ...params,
        n1: Number(params.n1),
        n2: Number(params.n2),
    });
    return data as {
        value: number;
        lo: number; hi: number; rangeSize: number;
        attempts: number; rejected: number;
        label: string; subseedHex: string; threshold: string; xUsed: string;
    };
}



export type HistoryItem = {
    drawId: string;
    createdAt: number;
    sources: string[];          // ["SOL","ETH","BTC","LOC?"]
    numberU64?: string;
};

export type HistoryListResponse = { items: HistoryItem[] };

export async function getHistory(limit = 50, offset = 0) {
    const { data } = await api.get<HistoryListResponse>("/history", { params: { limit, offset } });
    return data;
}

export type HistoryRecord = {
    drawId: string;
    createdAt: number;
    sources: Record<string, { blocks: any[]; beaconHex?: string }>;
    inputs: string[];
    entropy?: { locRoot?: string; summary?: any };
    compare?: any;
    trace?: any;
    result: { seedHex: string; u64: string };
};

export async function getHistoryById(drawId: string) {
    const { data } = await api.get<HistoryRecord>(`/history/${drawId}`);
    return data;
}
