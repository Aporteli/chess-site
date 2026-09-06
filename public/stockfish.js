'use strict';

/**
 * public/stockfish.js
 * Single-thread UCI worker (no pthreads, no SharedArrayBuffer).
 *
 * Required sibling (same folder):
 *   public/stockfish.wasm   ← official Stockfish *single-thread* WASM
 *
 * Do not point this at stockfish.wasm.js (that build is threaded).
 */

const WASM_URL = new URL('stockfish.wasm', self.location).href;

/** @type {((cmd: string) => void) | null} */
let sendToEngine = null;
const pending = [];

function emit(text) {
  if (text == null || text === '') return;
  String(text)
    .split(/\r?\n/)
    .forEach((line) => {
      const t = line.trim();
      if (t) self.postMessage(t);
    });
}

function command(line) {
  if (!sendToEngine) {
    pending.push(line);
    return;
  }
  sendToEngine(line);
}

function flush() {
  while (pending.length && sendToEngine) {
    sendToEngine(pending.shift());
  }
}

function decodeCString(memory, ptr) {
  const bytes = new Uint8Array(memory.buffer, ptr);
  let n = 0;
  while (bytes[n] !== 0) n++;
  return new TextDecoder().decode(bytes.subarray(0, n));
}

async function boot() {
  const memory = new WebAssembly.Memory({
    initial: 256,
    maximum: 2048,
    shared: false,
  });

  const stdout = { buf: '' };

  function writeStdout(ptr, len) {
    const bytes = new Uint8Array(memory.buffer, ptr, len);
    stdout.buf += new TextDecoder().decode(bytes);
    const parts = stdout.buf.split('\n');
    stdout.buf = parts.pop() || '';
    parts.forEach((p) => emit(p));
  }

  const stdin = { lines: /** @type {string[]} */ ([]), leftover: '' };

  const imports = {
    env: { memory },
    wasi_snapshot_preview1: {
      fd_write(fd, iov, iovcnt, pOut) {
        if (fd !== 1 && fd !== 2) return 8;
        const view = new DataView(memory.buffer);
        let written = 0;
        for (let i = 0; i < iovcnt; i++) {
          const ptr = view.getUint32(iov + i * 8, true);
          const len = view.getUint32(iov + i * 8 + 4, true);
          writeStdout(ptr, len);
          written += len;
        }
        view.setUint32(pOut, written, true);
        return 0;
      },
      fd_read(fd, iov, iovcnt, pOut) {
        if (fd !== 0) return 8;
        const view = new DataView(memory.buffer);
        let line = stdin.leftover;
        if (!line && stdin.lines.length) line = stdin.lines.shift() + '\n';
        const bytes = new TextEncoder().encode(line);
        let consumed = 0;
        for (let i = 0; i < iovcnt && consumed < bytes.length; i++) {
          const ptr = view.getUint32(iov + i * 8, true);
          const len = view.getUint32(iov + i * 8 + 4, true);
          const n = Math.min(len, bytes.length - consumed);
          new Uint8Array(memory.buffer, ptr, n).set(bytes.subarray(consumed, consumed + n));
          consumed += n;
        }
        stdin.leftover = new TextDecoder().decode(bytes.subarray(consumed));
        view.setUint32(pOut, consumed, true);
        return 0;
      },
      proc_exit() {},
      clock_time_get() { return 0; },
      random_get() { return 0; },
      fd_close() { return 0; },
      fd_seek() { return 0; },
      environ_sizes_get(pc, pb) {
        const view = new DataView(memory.buffer);
        view.setUint32(pc, 0, true);
        view.setUint32(pb, 0, true);
        return 0;
      },
      environ_get() { return 0; },
      args_sizes_get(pc, pb) {
        const view = new DataView(memory.buffer);
        view.setUint32(pc, 0, true);
        view.setUint32(pb, 0, true);
        return 0;
      },
      args_get() { return 0; },
    },
  };

  const res = await fetch(WASM_URL, { credentials: 'same-origin' });
  if (!res.ok) {
    emit('info string failed to fetch stockfish.wasm');
    return;
  }

  const { instance } = await WebAssembly.instantiateStreaming(res, imports);
  const exp = instance.exports;

  // Official single-thread builds usually expose one of these.
  if (typeof exp.uci === 'function') {
    sendToEngine = (line) => {
      const out = exp.uci(line);
      if (typeof out === 'string') emit(out);
    };
  } else if (typeof exp._uci_command === 'function') {
    sendToEngine = (line) => exp._uci_command(line);
  } else if (typeof exp.ccall === 'function') {
    sendToEngine = (line) => exp.ccall('uci_command', null, ['string'], [line]);
  } else if (typeof exp._main === 'function') {
    sendToEngine = (line) => stdin.lines.push(line);
    exp._main();
  } else {
    emit('info string stockfish.wasm is not a single-thread UCI build');
    return;
  }

  flush();
}

self.onmessage = (event) => {
  const raw = event.data;
  const line =
    typeof raw === 'string' ? raw : typeof raw?.data === 'string' ? raw.data : '';
  if (!line) return;
  command(line);
};

boot().catch((err) => {
  emit('info string ' + (err && err.message ? err.message : String(err)));
});