// Собираем микрозадержки между событиями и превращаем их в "сырые" байты (LSB дельт)
export function makeHumanPulseCollector() {
    let last = performance.now();
    const buf: number[] = [];
    const onEvent = () => {
        const now = performance.now();
        const dtUs = Math.floor((now - last) * 1000); // микросекунды
        buf.push(dtUs & 0xff);
        last = now;
    };
    const onMove = (e: MouseEvent) => onEvent();
    const onKey = (e: KeyboardEvent) => onEvent();

    return {
        start() {
            last = performance.now();
            window.addEventListener("mousemove", onMove);
            window.addEventListener("keydown", onKey);
        },
        stop() {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("keydown", onKey);
        },
        clear() { buf.length = 0; },
        // Возвращаем hex сырых байтов (они потом побайтно попадут в transcript)
        payloadHex(): string {
            return buf.map(b => b.toString(16).padStart(2, "0")).join("");
        },
        length() { return buf.length; }
    };
}
