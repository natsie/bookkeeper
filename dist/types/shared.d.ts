import type { Logger } from "./bookkeeper.ts";
import type { ConsoleLogType, DataMapper, Log } from "./types/bookkeeper.ts";
export declare const consoleLogTypes: Set<ConsoleLogType>;
export declare const dayOfWeek: [string, string][];
export declare const formatLog: (logger: Logger, log: Log, dataMapper: DataMapper, template?: string) => string;
//# sourceMappingURL=shared.d.ts.map