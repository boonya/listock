/** biome-ignore-all lint/suspicious/noConsole: It's okay so far util we decide hot to log it properly */

// TODO: Decide on logging strategy
// import pino from 'pino';
// const logger = pino();
export const logger = {
  info: (...args: unknown[]) => console.info('[info]', ...args),
  debug: (...args: unknown[]) => console.debug('[debug]', ...args),
  error: (...args: unknown[]) => console.error('[error]', ...args),
  warn: (...args: unknown[]) => console.warn('[warn]', ...args),
};
