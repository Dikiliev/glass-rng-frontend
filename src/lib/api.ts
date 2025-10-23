import axios from "axios";
import type { StartSolanaDrawDto, StartSolanaDrawResp } from "./types";

export const api = axios.create({ baseURL: "/api", timeout: 200000 });

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
