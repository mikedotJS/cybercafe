# @weirdscience/cybercafe-client

Cybercafe-client is a library designed to connect and interact with the cybercafe-server, providing a seamless experience for managing virtual room interactions in real-time.

## Features

- Connect to and interact with different room namespaces.
- Send and receive real-time events.
- Manage connection state and handle disconnections gracefully.

## Installation

```bash
npm install @weirdscience/cybercafe-client
```

## Usage

To get started with cybercafe-client, you need to import the CybercafeClient class.

```typescript
import { CybercafeClient } from "@weirdscience/cybercafe-client";
```

Create an instance of CybercafeClient:

```typescript
const client = new CybercafeClient("http://localhost:3000");
```

Connect to a room namespace:

```typescript
client.connect("chat");
```

Listen for events:

```typescript
client.on("message", (data) => {
  console.log("Received message:", data);
});
```

Send an event:

```typescript
client.emit("message", { text: "Hello, world!" });
```

Disconnect from the server:

```typescript
client.disconnect();
```

## Building

Build the package with:

```bash
npm run build
```

## Linting

Lint the codebase with:

```bash
npm run lint
```

## Changelog

Refer to the CHANGELOG.md for detailed information about changes in each version.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
