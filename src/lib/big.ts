export const TWO64 = 1n << 64n;

export function u64ToDecimalString(xU64: bigint, digits = 18): string {
    // 0.(x * 10^digits / 2^64) с доп. нулями слева
    const num = xU64 * (10n ** BigInt(digits));
    const q = num / TWO64;
    const s = q.toString();
    return "0." + s.padStart(digits, "0");
}

export function modNUnbiasedPreview(xU64: bigint, N: bigint): { value: bigint, biased: boolean } {
    // Для демонстрации (одно число): если x >= t, отметим как biased=true
    const t = TWO64 - (TWO64 % N);
    if (xU64 >= t) {
        return { value: xU64 % N, biased: true };
    } else {
        return { value: xU64 % N, biased: false };
    }
}
