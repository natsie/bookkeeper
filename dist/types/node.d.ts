import { type InspectOptions } from "node:util";
import type { LoggerInterfaceOptions, LogWriter } from "./types/bookkeeper.ts";
declare const createConsoleWriter: (options: LoggerInterfaceOptions & {
    inspectOptions?: InspectOptions;
}) => LogWriter;
declare const createLogFileWriter: (filename: string, options?: LoggerInterfaceOptions & {
    inspectOptions?: InspectOptions;
}) => Promise<LogWriter & {
    close: () => Promise<void>;
}>;
export { createConsoleWriter, createLogFileWriter };
//# sourceMappingURL=node.d.ts.map