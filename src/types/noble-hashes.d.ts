declare module '@noble/hashes/blake3' {
  export const blake3: {
    create(opts?: { key?: Uint8Array }): {
      update(data: Uint8Array): void;
      digest(): Uint8Array;
    };
  };
}


