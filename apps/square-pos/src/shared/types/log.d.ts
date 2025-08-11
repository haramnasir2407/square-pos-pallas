declare module 'logging-service' {
  interface Logger {
    error(code: Error, message: []): void
    warn(code: string, message: string[]): void
    debug(code: string, message: [metadata?: unknown]): void
  }

  const log: Logger
  export default log
}
