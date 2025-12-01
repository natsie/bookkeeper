# Bookkeeper

A simple, flexible, and environment-agnostic logging utility for JavaScript and TypeScript.

Bookkeeper is designed to be lightweight yet powerful, allowing you to manage log output across different "interfaces" (writers) like the console or files. It works seamlessly in both Node.js and the Browser.

## Features

- **Multiple Interfaces:** Log to multiple destinations simultaneously (e.g., Console + File).
- **Flexible Templating:** Customize your log format with a rich set of date and time variables.
- **Environment Agnostic:** First-class support for both Node.js and Browser environments.
- **Zero Dependencies:** Lightweight and easy to include in any project.
- **TypeScript Support:** Written in TypeScript with full type definitions included.

## Installation

```bash
npm install github:natsie/bookkeeper
# or
bun add github:natsie/bookkeeper
# or
yarn add bookkeeper@github:natsie/bookkeeper
```

## Quick Start

```typescript
import { Logger } from "bookkeeper";
import { createConsoleWriter } from "bookkeeper/node"; // or "bookkeeper/browser"

// 1. Create a logger instance
const logger = new Logger("my-app");

// 2. Add an interface (where the logs go)
logger.addInterface(
  "console",
  await createConsoleWriter({
    template: "[{{log_type}}] {{processed_data}}",
  }),
);

// 3. Start logging!
logger.info("Hello, World!");
// Output: [info] Hello, World!
```

## Core Concepts

- **Logger:** The central class that manages logging. You can name your logger and attach multiple "interfaces" to it.
- **Interface (Writer):** A function that handles the actual writing of the log. Bookkeeper provides built-in writers for Console and File logging, but you can easily write your own.

## Node.js Usage

### Console Logging

The Node.js console writer uses `util.inspect` to format objects, making them easy to read.

```typescript
import { Logger } from "bookkeeper";
import { createConsoleWriter } from "bookkeeper/node";

const logger = new Logger();

logger.addInterface(
  "main",
  await createConsoleWriter({
    template: "{{HH}}:{{mm}}:{{ss}} {{log_type}} > {{processed_data}}",
    inspectOptions: { colors: true, depth: 2 }, // Options passed to util.inspect
  }),
);

logger.log({ user: "Alice", id: 123 });
```

### File Logging

Bookkeeper supports asynchronous file logging with queue management.

```typescript
import { Logger } from "bookkeeper";
import { createLogFileWriter } from "bookkeeper/node";

const logger = new Logger();

// Note: createLogFileWriter is async as it opens the file handle
const fileWriter = await createLogFileWriter("./app.log", {
  template: "[{{iso_date}}] {{log_type}}: {{processed_data}}",
  clearPreviousLogs: false, // Set to true to truncate file on start
});

logger.addInterface("file", fileWriter);

logger.error("Something went wrong!");

// When shutting down, ensure the writer closes the file handle
// fileWriter.close();
```

## Browser Usage

### Console Logging

The browser console writer formats objects using `JSON.stringify`.

```typescript
import { Logger } from "bookkeeper";
import { createConsoleWriter } from "bookkeeper/browser";

const logger = new Logger();

await logger.addInterface(
  "console",
  await createConsoleWriter({
    formatSpacing: 2, // Indentation for JSON.stringify
  }),
);
```

### File Logging (File System Access API)

In the browser, Bookkeeper uses the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API).

```typescript
import { Logger } from "bookkeeper";
import { createLogFileWriter } from "bookkeeper/browser";

const logger = new Logger();

// Get a file handle (usually via a user gesture like showSaveFilePicker)
const handle = await window.showSaveFilePicker();

const fileWriter = await createLogFileWriter(handle, {
  template: "{{processed_data}}",
});

logger.addInterface("file", fileWriter);
```

## Templating

You can customize the output format of your logs using the `template` option.

**Example:** `"{{YYYY}}-{{MM}}-{{dd}} [{{log_type}}] {{processed_data}}"`

### Available Variables

| Variable              | Description                                  | Example                    |
| :-------------------- | :------------------------------------------- | :------------------------- |
| `{{log_type}}`        | The log method used (log, info, warn, error) | `info`                     |
| `{{processed_data}}`  | The actual log message content               | `Hello World`              |
| `{{timestamp}}`       | Unix timestamp (seconds)                     | `1717171717`               |
| `{{iso_date}}`        | Full ISO 8601 date string                    | `2024-05-31T12:00:00.000Z` |
| `{{date}}`            | Date part of ISO string                      | `2024-05-31`               |
| `{{time}}`            | Time part of ISO string                      | `12:00:00`                 |
| `{{YYYY}}` / `{{YY}}` | Year                                         | `2024` / `24`              |
| `{{MM}}` / `{{M}}`    | Month                                        | `05` / `5`                 |
| `{{dd}}`              | Day                                          | `31`                       |
| `{{HH}}` / `{{H}}`    | Hour (24h)                                   | `14`                       |
| `{{hh}}` / `{{h}}`    | Hour (12h)                                   | `02`                       |
| `{{mm}}` / `{{m}}`    | Minute                                       | `05`                       |
| `{{ss}}` / `{{s}}`    | Second                                       | `09`                       |
| `{{ms}}`              | Milliseconds                                 | `123`                      |
| `{{PP}}` / `{{pp}}`   | AM/PM                                        | `PM` / `pm`                |
| `{{JJ}}` / `{{jj}}`   | Day Name                                     | `Friday` / `Fri`           |

## Custom Interfaces

You can easily create your own interface. An interface is just a function that takes the `logger` instance and the `log` object.

```typescript
import { Logger, Log } from "bookkeeper";

const myCustomWriter = (logger: Logger, log: Log) => {
  // Send to a remote server, database, or custom UI
  console.log("Custom Writer received:", log.data);
};

const logger = new Logger();
logger.addInterface("remote", myCustomWriter);
```

## API

### `Logger`

- **`constructor(name?: string)`**
- **`addInterface(name: string, writer: LogWriter): this`**
- **`removeInterface(name: string): this`**
- **`enableInterface(name: string): this`**
- **`disableInterface(name: string): this`**
- **`log(...data: unknown[])`**
- **`info(...data: unknown[])`**
- **`warn(...data: unknown[])`**
- **`error(...data: unknown[])`**
- **`logCustom(type: string, ...data: unknown[])`**

## License

MIT
