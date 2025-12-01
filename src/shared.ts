import type { Logger } from "./bookkeeper.ts";
import type { ConsoleLogType, DataMapper, Log } from "./types/bookkeeper.ts";

export const consoleLogTypes: Set<ConsoleLogType> = new Set(["log", "info", "warn", "error"]);
export const dayOfWeek: [string, string][] = [
  ["Sunday", "Sun"],
  ["Monday", "Mon"],
  ["Tuesday", "Tue"],
  ["Wednesday", "Wed"],
  ["Thursday", "Thu"],
  ["Friday", "Fri"],
  ["Saturday", "Sat"],
];

// from https://github.com/natsie/broadutils
const strSubstitute = (
  inputStr: string,
  substitionMap: Map<string | RegExp, string> | Record<string, string>,
) => {
  const subPairs =
    substitionMap instanceof Map ? [...substitionMap] : Object.entries(substitionMap);
  return subPairs.reduce((acc, [key, value]) => acc.replaceAll(key, value), inputStr);
};

export const formatLog = (
  logger: Logger,
  log: Log,
  dataMapper: DataMapper,
  template: string = "{{processed_data}}",
): string => {
  const logString = log.data.map((item) => dataMapper(logger, item)).join("\n");
  const logDate = new Date(log.timestamp);
  const isoString = logDate.toISOString();
  const [fullDate, fullTime] = isoString.slice(0, -1).split("T") as [string, string];
  return strSubstitute(template, {
    "{{log_type}}": log.type,
    "{{processed_data}}": logString,
    "{{timestamp}}": String(Math.floor(log.timestamp)),
    "{{timestamp_precise}}": String(log.timestamp),
    "{{iso_date}}": isoString,
    "{{date}}": fullDate,
    "{{time}}": fullTime,
    "{{JJ}}": (dayOfWeek[logDate.getDay()] as [string, string])[0].toUpperCase(),
    "{{jj}}": (dayOfWeek[logDate.getDay()] as [string, string])[0],
    "{{J}}": (dayOfWeek[logDate.getDay()] as [string, string])[1].toUpperCase(),
    "{{j}}": (dayOfWeek[logDate.getDay()] as [string, string])[1],
    "{{YYYY}}": logDate.getFullYear().toString(),
    "{{YY}}": logDate.getFullYear().toString().slice(-2),
    "{{MM}}": logDate.getMonth().toString().padStart(2, "0"),
    "{{M}}": logDate.getMonth().toString(),
    "{{dd}}": logDate.getDate().toString().padStart(2, "0"),
    "{{HH}}": logDate.getHours().toString().padStart(2, "0"),
    "{{hh}}": (logDate.getHours() % 12).toString().padStart(2, "0"),
    "{{mm}}": logDate.getMinutes().toString().padStart(2, "0"),
    "{{ss}}": logDate.getSeconds().toString().padStart(2, "0"),
    "{{H}}": logDate.getHours().toString(),
    "{{h}}": (logDate.getHours() % 12).toString(),
    "{{m}}": logDate.getMinutes().toString(),
    "{{s}}": logDate.getSeconds().toString(),
    "{{ms++}}": logDate.getMilliseconds().toString().padStart(3, "0"),
    "{{ms+}}": logDate.getMilliseconds().toString().padStart(2, "0"),
    "{{ms}}": logDate.getMilliseconds().toString(),
    "{{PP}}": logDate.getHours() >= 12 ? "PM" : "AM",
    "{{pp}}": logDate.getHours() >= 12 ? "pm" : "am",
    "{{P}}": logDate.getHours() >= 12 ? "P" : "M",
    "{{p}}": logDate.getHours() >= 12 ? "p" : "m",
  });
};
