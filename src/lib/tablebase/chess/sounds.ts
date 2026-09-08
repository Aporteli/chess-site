type SfxKind = "move" | "capture" | "check" | "mate" | "castle";

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  ctx ??= new AudioContext();
  return ctx;
}

function tone(freq: number, dur: number, gain = 0.05, type: OscillatorType = "sine") {
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = gain;
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + dur);
}

export function sfxForMove(flags: {
  capture: boolean;
  castle: "k" | "q" | null;
  check: boolean;
  mate: boolean;
  promotion: boolean;
}): SfxKind {
  if (flags.mate) return "mate";
  if (flags.castle) return "castle";
  if (flags.capture || flags.promotion) return "capture";
  if (flags.check) return "check";
  return "move";
}

export function playSfx(kind: SfxKind, enabled: boolean) {
  if (!enabled) return;
  if (kind === "mate") {
    tone(220, 0.18, 0.06, "square");
    window.setTimeout(() => tone(330, 0.28, 0.05, "square"), 90);
    return;
  }
  if (kind === "castle") {
    tone(392, 0.08, 0.04);
    window.setTimeout(() => tone(494, 0.1, 0.04), 70);
    return;
  }
  if (kind === "capture") tone(196, 0.09, 0.05, "triangle");
  else if (kind === "check") tone(660, 0.1, 0.045, "square");
  else tone(520, 0.06, 0.035, "sine");
}

export function playMoveSfx(
  next: { inCheck: () => boolean; isCheckmate: () => boolean },
  move: { captured?: string; flags: string; promotion?: string },
  sound: boolean,
) {
  playSfx(
    sfxForMove({
      capture: move.captured !== undefined,
      castle: move.flags.includes("k")
        ? "k"
        : move.flags.includes("q")
          ? "q"
          : null,
      check: next.inCheck(),
      mate: next.isCheckmate(),
      promotion: move.promotion !== undefined,
    }),
    sound,
  );
}
