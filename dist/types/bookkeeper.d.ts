import type { LogWriter } from "./types/bookkeeper.ts";
declare class Logger {
    name: string;
    interfaces: Map<string, {
        active: boolean;
        writer: LogWriter;
    }>;
    constructor(name?: string);
    addInterface(name: string, writer: LogWriter): Logger;
    removeInterface(name: string): Logger;
    enableInterface(name: string): Logger;
    disableInterface(name: string): Logger;
    handleLog(type: string, data: unknown[]): null;
    log(...data: unknown[]): void;
    info(...data: unknown[]): void;
    warn(...data: unknown[]): void;
    error(...data: unknown[]): void;
    logCustom(type: string, ...data: unknown[]): void;
}
export { Logger };
//# sourceMappingURL=bookkeeper.d.ts.map