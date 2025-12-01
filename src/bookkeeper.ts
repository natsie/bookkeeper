import type { Log, LogWriter } from "./types/bookkeeper.ts";

const nonNullable = <T>(value: T): NonNullable<T> => {
  if (value == null) throw new TypeError("The provided value is null or undefined");
  return value;
};

const randomLoggerName = (): string => `bookkeeper-${1e5 + ~~(Math.random() * (1e6 - 1e5))}`;

class Logger {
  name: string;
  interfaces: Map<string, { active: boolean; writer: LogWriter }>;
  constructor(name: string = randomLoggerName()) {
    this.name = name;
    this.interfaces = new Map();
  }

  addInterface(name: string, writer: LogWriter): Logger {
    this.interfaces.set(name, { active: true, writer });
    return this;
  }
  removeInterface(name: string): Logger {
    this.interfaces.delete(name);
    return this;
  }
  enableInterface(name: string): Logger {
    const _interface = nonNullable(this.interfaces.get(name));
    _interface.active = true;
    return this;
  }
  disableInterface(name: string): Logger {
    const _interface = nonNullable(this.interfaces.get(name));
    _interface.active = false;
    return this;
  }
  handleLog(type: string, data: unknown[]): null {
    const log: Log = {
      type,
      data,
      timestamp: performance.timeOrigin + performance.now(),
    };
    for (const [name, _interface] of this.interfaces) {
      try {
        _interface.active && _interface.writer(this, log);
      } catch (error) {
        console.error(`The writer for interface ${name} failed to handle a log.`, error);
      }
    }
    return null;
  }

  log(...data: unknown[]) {
    this.handleLog("log", data);
  }
  info(...data: unknown[]) {
    this.handleLog("info", data);
  }
  warn(...data: unknown[]) {
    this.handleLog("warn", data);
  }
  error(...data: unknown[]) {
    this.handleLog("error", data);
  }
  logCustom(type: string, ...data: unknown[]) {
    this.handleLog(type, data);
  }
}

export { Logger };
