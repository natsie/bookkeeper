import { inspect, type InspectOptions } from "node:util";
import { open, writeFile, type FileHandle } from "node:fs/promises";
import type { Logger } from "./bookkeeper.ts";
import type {
  ConsoleLogType,
  DataMapper,
  Log,
  LoggerInterfaceOptions,
  LogWriter,
} from "./types/bookkeeper.ts";
import { consoleLogTypes, formatLog } from "./shared.ts";

const _dataMapper = (logger: Logger, inspectOptions: InspectOptions, item: unknown) => {
  if (typeof item === "string") return item;
  return inspect(item, { ...inspectOptions, colors: false });
};

const createConsoleWriter = (
  options: LoggerInterfaceOptions & { inspectOptions?: InspectOptions },
): LogWriter => {
  const template = options.template ?? "{{processed_data}}";
  const inspectOptions = Object.assign({}, options.inspectOptions ?? {}, { colors: true });
  const dataMapper: DataMapper = (logger, item) => _dataMapper(logger, inspectOptions, item);

  options.clearPreviousLogs && console.clear();

  return (_logger, log) => {
    if (consoleLogTypes.has(log.type as ConsoleLogType)) {
      console[log.type as ConsoleLogType](formatLog(_logger, log, dataMapper, template));
    } else console.log(formatLog(_logger, log, dataMapper, template));
  };
};

const createLogFileWriter = async (
  filename: string,
  options: LoggerInterfaceOptions & { inspectOptions?: InspectOptions } = {},
): Promise<LogWriter & { close: () => Promise<void> }> => {
  const handle: FileHandle = await open(filename, "a");
  const logQueue: Log[] = [];

  const _options = {
    template: options.template ?? "{{processed_data}}",
    clearPreviousLogs: options.clearPreviousLogs ?? false,
    inspectOptions: Object.assign({}, options.inspectOptions ?? {}, { colors: false }),
  };
  const dataMapper: DataMapper = (logger, item) =>
    _dataMapper(logger, _options.inspectOptions, item);

  let writeAvailable = true;
  const drainLogQueue = async (logger: Logger) => {
    writeAvailable = false;
    while (logQueue.length > 0) {
      const log = logQueue.shift();
      if (!log) continue;

      await handle
        .write(formatLog(logger, log, dataMapper, _options.template) + "\n")
        .catch((error) => {
          console.error(`An error occurred while writing to the log file.`, { logger, log, error });
          return null;
        });
    }
    writeAvailable = true;
  };

  if (_options.clearPreviousLogs) {
    await writeFile(filename, "").catch((error) => {
      console.error(`An error occurred while clearing the log file.`, { error });
    });
  }

  const writer: LogWriter & { close: () => Promise<void> } = (logger, log) => {
    logQueue.push(log);
    writeAvailable && drainLogQueue(logger);
  };
  writer.close = async () => await handle.close();
  return writer;
};

export { createConsoleWriter, createLogFileWriter };
