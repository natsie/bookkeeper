import type { Logger } from "../bookkeeper.ts";

export type LogWriter = (logger: Logger, log: Log) => void;
export type ConsoleLogType = "log" | "info" | "warn" | "error";
export type DataMapper = (logger: Logger, item: unknown) => string;

export interface Log {
  type: string;
  data: unknown[];
  timestamp: number;
}

export interface LoggerInterfaceOptions {
  template?: string;
  clearPreviousLogs?: boolean;
}
