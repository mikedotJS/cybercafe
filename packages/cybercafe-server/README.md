# @weirdscience/cybercafe-server

Cybercafe-server is a foundational library for creating and managing virtual rooms within a server environment, utilizing socket.io for real-time communication.

## Features

- Define and manage custom room types.
- Create, retrieve, and remove rooms dynamically.
- Extend room functionality with custom state management and event handling.

## Installation

\`\`\`bash
npm install @weirdscience/cybercafe-server
\`\`\`

## Usage

To get started with cybercafe-server, you need to import the CyberCafeServer and Room classes.

\`\`\`typescript
import { CyberCafeServer, Room } from '@weirdscience/cybercafe-server';
\`\`\`

Create an instance of CyberCafeServer:

\`\`\`typescript
const server = new CyberCafeServer<string>();
\`\`\`

Define a new room type:

\`\`\`typescript
server.defineRoomType({
type: "chat",
constructor: Room // Replace with your custom room class if needed
});
\`\`\`

Create a new room:

\`\`\`typescript
const chatRoom = server.createRoom("chat", "room1");
\`\`\`

Retrieve a room by its ID:

\`\`\`typescript
const room = server.getRoom("room1");
\`\`\`

Remove a room by its ID:

\`\`\`typescript
server.removeRoom("room1");
\`\`\`

## Testing

Run the test suite using the following command:

\`\`\`bash
npm test
\`\`\`

## Building

Build the package with:

\`\`\`bash
npm run build
\`\`\`

## Linting

Lint the codebase with:

\`\`\`bash
npm run lint
\`\`\`

## Changelog

Refer to the CHANGELOG.md for detailed information about changes in each version.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
