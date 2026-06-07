/* Minimal structured logger — timestamped, level-tagged, no external deps. */

type Level = 'info' | 'warn' | 'error' | 'debug';

function emit(level: Level, msg: string, meta?: unknown): void {
  const ts = new Date().toISOString();
  const tag = level.toUpperCase().padEnd(5);
  if (meta !== undefined) {
    // eslint-disable-next-line no-console
    console[level === 'debug' ? 'log' : level](`[${ts}] ${tag} ${msg}`, meta);
  } else {
    // eslint-disable-next-line no-console
    console[level === 'debug' ? 'log' : level](`[${ts}] ${tag} ${msg}`);
  }
}

export const logger = {
  info: (msg: string, meta?: unknown) => emit('info', msg, meta),
  warn: (msg: string, meta?: unknown) => emit('warn', msg, meta),
  error: (msg: string, meta?: unknown) => emit('error', msg, meta),
  debug: (msg: string, meta?: unknown) => {
    if (process.env.NODE_ENV !== 'production') emit('debug', msg, meta);
  },
};
