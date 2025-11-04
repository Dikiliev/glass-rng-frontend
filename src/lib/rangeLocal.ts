import { blake3 } from "@noble/hashes/blake3";

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  if (clean.length % 2 !== 0) throw new Error("hex length must be even");
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function deriveSubseed(seed: Uint8Array, label: string): Uint8Array {
  // BLAKE3 keyed hash with seed as key; update with b"SUB|"+label
  const key = seed;
  const ctx = blake3.create({ key });
  ctx.update(new TextEncoder().encode("SUB|" + label));
  return ctx.digest(); // 32 bytes
}

function u64StreamFromSubseed(subseed: Uint8Array): () => bigint {
  let counter = 0n;
  return () => {
    const key = subseed;
    const ctx = blake3.create({ key });
    const counterLe = new Uint8Array(8);
    const dv = new DataView(counterLe.buffer);
    dv.setBigUint64(0, counter, true);
    ctx.update(counterLe);
    const block = ctx.digest(); // 32 bytes
    // first 8 bytes as big-endian u64
    const dv2 = new DataView(block.buffer, block.byteOffset, block.byteLength);
    const x = dv2.getBigUint64(0, false);
    counter += 1n;
    return x;
  };
}

export function sampleRangeBySeedLocal(params: {
  seedHex: string;
  n1: number | string;
  n2: number | string;
  label?: string;
}): { value: number; attempts: number; rejected: number } {
  const seed = hexToBytes(String(params.seedHex));
  if (seed.length !== 32) throw new Error("seed must be 32 bytes");
  const lo = Math.min(Number(params.n1), Number(params.n2));
  const hi = Math.max(Number(params.n1), Number(params.n2));
  const R = BigInt(hi - lo + 1);
  const TWO64 = 1n << 64n;
  if (R <= 0n || R > TWO64) throw new Error("invalid range");

  const label = params.label ?? "RANGE/v1";
  const subseed = deriveSubseed(seed, label);
  const nextU64 = u64StreamFromSubseed(subseed);
  const t = (TWO64 / R) * R;

  let attempts = 0;
  let rejected = 0;
  while (true) {
    attempts += 1;
    const x = nextU64();
    if (x < t) {
      const value = lo + Number(x % R);
      return { value, attempts, rejected };
    }
    rejected += 1;
  }
}


