import axios from "axios";
import type { StartSolanaDrawDto, StartSolanaDrawResp } from "./types";

export const api = axios.create({
    baseURL: "/api",
    timeout: 20000,
});

export async function startSolanaDraw(payload: StartSolanaDrawDto) {
    const { data } = await api.post<StartSolanaDrawResp>("/draws/solana", payload);
    return data;
}
