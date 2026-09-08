export const runtime = {
  fillSeq: 0,
  hintPending: false,
  hintFen: null as string | null,
  replyFen: null as string | null,
  repliedFen: null as string | null,
};

export function haltEngine() {
  runtime.hintPending = false;
  runtime.hintFen = null;
  runtime.replyFen = null;
}

export function resetReply(fen?: string) {
  runtime.replyFen = null;
  runtime.repliedFen = fen ?? null;
}
