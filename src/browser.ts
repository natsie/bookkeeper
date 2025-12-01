import type { Logger } from "./bookkeeper.ts";
import { consoleLogTypes, formatLog } from "./shared.ts";
import type {
  ConsoleLogType,
  DataMapper,
  Log,
  LoggerInterfaceOptions,
  LogWriter,
} from "./types/bookkeeper.ts";

const _dataMapper = (spacing: number, logger: Logger, item: unknown) => {
  if (typeof item === "string") return item;
  return JSON.stringify(item, null, spacing);
};

export const createConsoleWriter = async (
  options: LoggerInterfaceOptions & { formatSpacing?: number },
): Promise<LogWriter> => {
  const template = options.template ?? "{{processed_data}}";
  const spacing = options.formatSpacing ?? 2;
  const dataMapper: DataMapper = (logger, item) => _dataMapper(spacing, logger, item);

  options.clearPreviousLogs && console.clear();

  return (_logger, log) => {
    if (consoleLogTypes.has(log.type as ConsoleLogType)) {
      console[log.type as ConsoleLogType](formatLog(_logger, log, dataMapper, template));
    } else console.log(formatLog(_logger, log, dataMapper, template));
  };
};

export const createLogFileWriter = async (
  fileHandle: FileSystemFileHandle,
  options: LoggerInterfaceOptions & { formatSpacing?: number },
): Promise<LogWriter> => {
  const writer = await fileHandle.createWritable({ keepExistingData: true });
  const template = options.template ?? "{{processed_data}}";
  const spacing = options.formatSpacing ?? 2;

  const logQueue: Log[] = [];
  const dataMapper: DataMapper = (logger, item) => _dataMapper(spacing, logger, item);
  options.clearPreviousLogs && writer.truncate(0);

  let writeAvailable = true;
  const drainLogQueue = async (logger: Logger) => {
    writeAvailable = false;
    while (logQueue.length > 0) {
      const log = logQueue.shift();
      if (!log) continue;

      await writer.write(formatLog(logger, log, dataMapper, template) + "\n").catch((error) => {
        console.error(`An error occurred while writing to the log file.`, { logger, log, error });
        return null;
      });
    }
    writeAvailable = true;
  };

  return (logger, log) => {
    logQueue.push(log);
    writeAvailable && drainLogQueue(logger);
  };
};
