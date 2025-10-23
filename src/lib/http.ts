// src/lib/http.ts
import axios from "axios";

/**
 * Базовый клиент для API.
 * По умолчанию шлёт на /api (через Vite proxy).
 * Можно переопределить через .env: VITE_API_BASE="http://127.0.0.1:8000"
 */
export const api = axios.create({ baseURL: "/api", timeout: 200000 });

// Небольшой helper для скачивания blob'ов
export async function downloadBlob(
    url: string,
    method: "GET" | "POST" = "GET",
    body?: any,
    filename?: string,
) {
    const cfg = { responseType: "blob" as const };
    const res =
        method === "POST"
            ? await api.post(url, body, cfg)
            : await api.get(url, cfg);

    const blob = new Blob([res.data]);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename || "download";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
}
