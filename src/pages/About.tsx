import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Dot = ({ className = "" }: { className?: string }) => (
  <span className={`inline-block size-2 rounded-full ${className}`} />
);

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full border border-border/70 bg-card/60 px-2.5 py-1 text-xs text-muted-foreground">
    {children}
  </span>
);

const SectionTitle = ({ overline, title, desc }: { overline?: string; title: string; desc?: string }) => (
  <div className="mb-6">
    {overline && (
      <div className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {overline}
      </div>
    )}
    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
    {desc && <p className="mt-1 text-muted-foreground">{desc}</p>}
  </div>
);

const Arrow = ({ className = "" }: { className?: string }) => (
  <svg className={`h-6 w-6 text-muted-foreground/80 ${className}`} viewBox="0 0 24 24" fill="none">
    <path d="M4 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Check = ({ className = "" }: { className?: string }) => (
  <svg className={`h-4 w-4 ${className}`} viewBox="0 0 24 24" fill="none">
    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const About = () => {
  const steps = useMemo(
    () => [
      {
        id: "1",
        title: "Public Entropy (Solana)",
        text:
          "We fetch the latest finalized Solana blocks. Their base58 blockhashes are decoded and concatenated into a single beacon byte-string.",
        pill: "Finalized blocks → beacon",
      },
      {
        id: "2",
        title: "Local Entropy (Optional)",
        text:
          "The server collects local noise (os.urandom + CPU jitter). Packets are Merklized; the Merkle root is hashed into a compact LOC component.",
        pill: "Merkle root of noise",
      },
      {
        id: "3",
        title: "Domain Separation + HKDF",
        text:
          "Inputs (PUB[, LOC]) are mixed with a domain-salted HKDF keyed by drawId. The output is a 32-byte seed. Different labels/domains ⇒ independent seeds.",
        pill: "HKDF(seed, salt=hash(drawId))",
      },
      {
        id: "4",
        title: "ChaCha20 → u64 → [0,1)",
        text:
          "ChaCha20(seed) produces a byte stream; the first 8 bytes (big-endian) form u64. Normalize as u64 / 2^64 ∈ [0,1).",
        pill: "ChaCha20 PRNG",
      },
      {
        id: "5",
        title: "Unbiased Range Mapping",
        text:
          "To map into [min..max], use rejection sampling (not modulo) to avoid bias. We visualize accepted/rejected draws.",
        pill: "Rejection sampling",
      },
    ],
    []
  );

  return (
    <div className="relative min-h-screen pt-24 pb-16">
      {/* Decorative blur blobs */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-64 max-w-5xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-40 -z-10 h-56 w-56 rounded-full bg-blue-500/10 blur-2xl" />
      <div className="pointer-events-none absolute -left-24 top-72 -z-10 h-56 w-56 rounded-full bg-purple-500/10 blur-2xl" />

      <div className="mx-auto px-6 max-w-[1200px]">
        {/* HERO */}
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent">
              About Most Random Number
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg text-muted-foreground">
            Verifiable RNG built on public blockchain entropy. Transparent mixing, step-by-step trace, and full
            reproducibility by <code className="rounded bg-muted px-1 py-0.5">drawId</code>.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <Pill>Verifiable</Pill>
            <Pill>Reproducible</Pill>
            <Pill>Solana finalized blocks</Pill>
            <Pill>ChaCha20 · HKDF</Pill>
          </div>
        </div>

        {/* PIPELINE DIAGRAM */}
        <div className="mx-auto mt-10 max-w-5xl">
          <Card className="bg-card/60 border-border backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Pipeline at a Glance</CardTitle>
              <CardDescription>High-level overview of how a number is produced</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[720px]">
                  <div className="grid grid-cols-12 items-center gap-2">
                    {/* PUB */}
                    <div className="col-span-3">
                      <div className="rounded-lg border border-border bg-muted/30 p-3">
                        <div className="text-sm font-semibold">Public Entropy</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Solana <span className="whitespace-nowrap">finalized blocks</span>
                          <br />
                          <code className="rounded bg-muted px-1">beacon</code>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-1 flex items-center justify-center">
                      <Arrow />
                    </div>

                    {/* + LOC */}
                    <div className="col-span-3">
                      <div className="rounded-lg border border-border bg-muted/20 p-3">
                        <div className="text-sm font-semibold">Local Entropy (Optional)</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          os.urandom + CPU jitter
                          <br />
                          Merkle root → <code className="rounded bg-muted px-1">LOC</code>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-1 flex items-center justify-center">
                      <Arrow />
                    </div>

                    {/* HKDF */}
                    <div className="col-span-4">
                      <div className="rounded-lg border border-border bg-muted/10 p-3">
                        <div className="text-sm font-semibold">HKDF (domain-separated)</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          salt = hash(drawId), info = PUB[, LOC]
                          <br />
                          → <code className="rounded bg-muted px-1">32-byte seed</code>
                        </div>
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="col-span-12 my-3 flex items-center justify-center">
                      <Arrow />
                    </div>

                    {/* ChaCha */}
                    <div className="col-span-4 col-start-2">
                      <div className="rounded-lg border border-border bg-muted/10 p-3">
                        <div className="text-sm font-semibold">ChaCha20(seed)</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          stream → first 8 bytes → <code className="rounded bg-muted px-1">u64</code>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-1 flex items-center justify-center">
                      <Arrow />
                    </div>

                    {/* Normalize */}
                    <div className="col-span-4">
                      <div className="rounded-lg border border-border bg-muted/10 p-3">
                        <div className="text-sm font-semibold">Normalize / Map</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          u = u64 / 2^64 ∈ [0,1)
                          <br />
                          Range [min..max]: <b>rejection sampling</b>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* HOW IT WORKS */}
        <div className="mx-auto mt-10 max-w-5xl">
          <SectionTitle title="How it works" desc="A clear, auditable chain from inputs to result" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {steps.map((s) => (
              <Card key={s.id} className="bg-card/60 border-border backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <span className="inline-flex size-6 items-center justify-center rounded-full border border-border bg-background text-xs font-semibold">
                      {s.id}
                    </span>
                    {s.title}
                  </CardTitle>
                  <CardDescription>
                    <span className="text-xs">{s.pill}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{s.text}</CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* TRUST & VERIFIABILITY */}
        <div className="mx-auto mt-12 max-w-5xl">
          <SectionTitle title="Trust & Verifiability" desc="Why the outcome is fair and can be proven" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="bg-card/60 border-border backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Fairness Guarantees</CardTitle>
                <CardDescription>What we commit to — technically</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Check className="text-emerald-500" />
                  <div>
                    <div className="font-medium">Unpredictability (before finalize)</div>
                    <div className="text-muted-foreground">
                      Finalized Solana blocks are external public entropy; mixing prevents bias from a single party.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="text-emerald-500" />
                  <div>
                    <div className="font-medium">Reproducibility</div>
                    <div className="text-muted-foreground">
                      Given <code>drawId</code>, beacon, HKDF salt and inputs, anyone can recompute the same seed and result.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="text-emerald-500" />
                  <div>
                    <div className="font-medium">Unbiased Range Mapping</div>
                    <div className="text-muted-foreground">
                      We use <b>rejection sampling</b> instead of modulo to avoid bias in bounded ranges.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="text-emerald-500" />
                  <div>
                    <div className="font-medium">Audit Trail</div>
                    <div className="text-muted-foreground">
                      Each draw is stored as JSON with inputs, trace and result — ready for public verification.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/60 border-border backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Reproduce a Draw</CardTitle>
                <CardDescription>Minimal pseudo-code</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="rounded-lg border border-border bg-muted/30 p-4 text-xs leading-relaxed">
{`beacon = concat(base58decode(blockhash_i))
PUB    = H("SOL" || beacon)

# optional:
LOC    = H("LOC" || merkle_root(local_noise_packets))

salt   = domain_hash(drawId)
seed   = HKDF(salt=salt, info=concat(PUB[, LOC]), len=32)

bytes  = ChaCha20(seed).read(16)
u64    = be64(bytes[0..8])
u      = u64 / 2^64          # in [0,1)

# unbiased mapping to [a..b]
size   = b - a + 1
repeat:
  r = next_u64()
  if r < floor(2^64 / size) * size:
    x = a + (r % size)
    return x`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* VISUAL TRACE CARDS */}
        <div className="mx-auto mt-12 max-w-5xl">
          <SectionTitle
            title="Visual Trace"
            desc="Human-readable logs show what was mixed and how the final result emerged"
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="bg-card/60 border-border backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Commit → Finalized Blocks</CardTitle>
                <CardDescription>Public beacons</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Slots, blockhashes, and explorer links are emitted as SSE events. We also display the concatenated beacon.
              </CardContent>
            </Card>

            <Card className="bg-card/60 border-border backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Mixing & Compare</CardTitle>
                <CardDescription>PUB vs. PUB+LOC</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                We derive both variants and show the seeds, first 16 ChaCha bytes, <code>u64</code> and <code>u∈[0,1)</code>.
              </CardContent>
            </Card>

            <Card className="bg-card/60 border-border backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Result & Range</CardTitle>
                <CardDescription>Unbiased sampling</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Range conversion uses rejection sampling. You can export a bitstream ≥ 1M bits for NIST / Dieharder.
              </CardContent>
            </Card>
          </div>
        </div>

        {/* SIGNALS / BADGES */}
        <div className="mx-auto mt-10 max-w-5xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/60 px-3 py-1.5 text-xs">
              <Dot className="bg-emerald-500" /> Live SSE stream
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/60 px-3 py-1.5 text-xs">
              <Dot className="bg-blue-500" /> Public entropy
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/60 px-3 py-1.5 text-xs">
              <Dot className="bg-fuchsia-500" /> Domain separation
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/60 px-3 py-1.5 text-xs">
              <Dot className="bg-amber-500" /> Rejection sampling
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="mx-auto mt-12 max-w-4xl text-center">
          <Card className="bg-card/60 border-border backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-xl md:text-2xl font-semibold">Ready to verify randomness yourself?</h3>
              <p className="mt-1 text-muted-foreground">
                Start a draw, watch the events in real time, then reproduce the result locally.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <Link
                  to="/"
                  className="inline-flex items-center rounded-lg border border-border bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
                >
                  Start a Draw
                </Link>
                <Link
                  to="/history"
                  className="inline-flex items-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-card/80"
                >
                  View History
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
