import type { LoggerInterfaceOptions, LogWriter } from "./types/bookkeeper.ts";
export declare const createConsoleWriter: (options: LoggerInterfaceOptions & {
    formatSpacing?: number;
}) => Promise<LogWriter>;
export declare const createLogFileWriter: (fileHandle: FileSystemFileHandle, options: LoggerInterfaceOptions & {
    formatSpacing?: number;
}) => Promise<LogWriter>;
//# sourceMappingURL=browser.d.ts.map