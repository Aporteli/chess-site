let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(
  frequency: number,
  duration: number,
  type: OscillatorType,
  gain = 0.08,
  delay = 0,
) {
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  g.gain.setValueAtTime(0.0001, ac.currentTime + delay);
  g.gain.exponentialRampToValueAtTime(gain, ac.currentTime + delay + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + delay + duration);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start(ac.currentTime + delay);
  osc.stop(ac.currentTime + delay + duration + 0.02);
}

export type Sfx =
  | "move"
  | "capture"
  | "castle"
  | "check"
  | "success"
  | "error"
  | "promote";

export function playSfx(kind: Sfx, enabled: boolean) {
  if (!enabled) return;
  switch (kind) {
    case "move":
      tone(620, 0.07, "triangle", 0.05);
      break;
    case "capture":
      tone(180, 0.12, "square", 0.06);
      tone(90, 0.14, "sine", 0.05, 0.02);
      break;
    case "castle":
      tone(520, 0.06, "triangle", 0.04);
      tone(700, 0.07, "triangle", 0.04, 0.07);
      break;
    case "check":
      tone(880, 0.08, "square", 0.045);
      tone(660, 0.1, "square", 0.04, 0.09);
      break;
    case "success":
      tone(523, 0.09, "sine", 0.05);
      tone(659, 0.11, "sine", 0.05, 0.08);
      break;
    case "error":
      tone(196, 0.16, "sawtooth", 0.05);
      tone(155, 0.18, "square", 0.03, 0.04);
      break;
    case "promote":
      tone(523, 0.07, "sine", 0.04);
      tone(784, 0.1, "sine", 0.045, 0.08);
      break;
  }
}

export function sfxForMove(flags: {
  capture: boolean;
  castle: "k" | "q" | null;
  check: boolean;
  mate: boolean;
  promotion: boolean;
}): Sfx {
  if (flags.mate || flags.check) return "check";
  if (flags.promotion) return "promote";
  if (flags.castle) return "castle";
  if (flags.capture) return "capture";
  return "move";
}
