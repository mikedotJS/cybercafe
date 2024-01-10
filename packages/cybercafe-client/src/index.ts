import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

export class CybercafeClient {
  socket: Socket;
  private joinedRoomId: string | null = null;

  constructor(serverUrl: string) {
    this.socket = io(serverUrl);

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.socket.on("connect", () => console.log("Connected to server"));
    this.socket.on("disconnect", () => console.log("Disconnected from server"));
  }

  leaveRoom(roomId: string): void {
    this.socket.emit("leaveRoom", roomId);
  }

  joinOrCreateRoom(roomType: string): void {
    this.socket.emit("joinOrCreateRoom", roomType);
  }

  joinRoomById(roomId: string): void {
    this.socket.emit("joinRoomById", roomId);
  }

  sendMessage(message: string): void {
    if (this.joinedRoomId) {
      this.socket.emit("message", { roomId: this.joinedRoomId, message });
    } else {
      console.error("Cannot send message, not joined in any room.");
    }
  }

  on(message: string, callback: (args: Record<string, unknown>) => void): void {
    this.socket.on(message, callback);
  }
}
