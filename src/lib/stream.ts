// src/lib/stream.ts
import { DrawEventSchema, type DrawEvent } from "./types";

export function subscribeDrawSSE(
    drawId: string,
    onEvent: (e: DrawEvent) => void
) {
    const es = new EventSource(`/api/draws/${drawId}/stream`);


    es.onmessage = (ev) => {
        let raw: unknown;
        try {
            raw = JSON.parse(ev.data);
        } catch {
            console.warn("Bad JSON from SSE:", ev.data);
            return;
        }

        // игнорируем служебные события, которые не входят в схему
        if (typeof raw === 'object' && raw && (raw as any).type && ((raw as any).type === 'connected' || (raw as any).type === 'ping')) {
            return;
        }

        const parsed = DrawEventSchema.safeParse(raw);
        if (parsed.success) {
            onEvent(parsed.data);
        } else {
            // молча игнорируем нестандартные события
            // опционально: можно пробрасывать как есть
            // onEvent(raw as any);
        }
    };

    es.onerror = (e) => {
        console.error("SSE error", e);
    };

    return () => es.close();
}

export function subscribeCurrentSSE(
    onMessage: (msg: { type: 'current'; drawId: string }) => void
) {
    const es = new EventSource(`/api/stream/current`);
    es.onmessage = (ev) => {
        try {
            const raw = JSON.parse(ev.data);
            console.log('raw', raw);
            if (raw && typeof raw === 'object' && raw.type === 'current' && typeof raw.drawId === 'string') {
                onMessage(raw);
            }
        } catch {
            // ignore
        }
    };
    es.onerror = () => {
        // авто‑переподключение обеспечит EventSource сам
    };
    return () => es.close();
}