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

        const parsed = DrawEventSchema.safeParse(raw);
        if (parsed.success) {
            onEvent(parsed.data);
        } else {
            console.warn("Unknown event payload:", raw, parsed.error);
            // опционально: можно пробрасывать как есть
            // onEvent(raw as any);
        }
    };

    es.onerror = (e) => {
        console.error("SSE error", e);
    };

    return () => es.close();
}
