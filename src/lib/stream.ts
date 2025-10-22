import { type DrawEvent, DrawEventZ } from "./types";

export type Unsubscribe = () => void;

export function subscribeDrawSSE(drawId: string, onEvent: (e: DrawEvent) => void): Unsubscribe {
    const es = new EventSource(`/api/draws/${drawId}/stream`, { withCredentials: false });

    es.onmessage = (ev) => {
        try {
            const parsed = DrawEventZ.parse(JSON.parse(ev.data));
            onEvent(parsed);
        } catch (e) {
            console.warn("Unknown event payload:", ev.data, e);
        }
    };

    es.onerror = () => {
        // простая автореконнект логика
        if (es.readyState === EventSource.CLOSED) {
            setTimeout(() => subscribeDrawSSE(drawId, onEvent), 1500);
        }
    };

    return () => es.close();
}
