import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

type RoomState<TState> = TState;

type StateUpdatedEvent<TState> = {
  roomId: string;
  newState: RoomState<TState>;
};

export class CybercafeClient<TState> {
  private socket: Socket;
  private joinedRoomId: string | null = null;

  constructor(serverUrl: string) {
    this.socket = io(serverUrl);

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.socket.on("connect", () => console.log("Connected to server"));
    this.socket.on("disconnect", () => console.log("Disconnected from server"));

    this.socket.on("stateUpdated", (event: StateUpdatedEvent<TState>) => {
      console.log("State updated for room:", event.roomId);
      console.log("New state:", event.newState);
    });
  }

  leaveRoom(roomId: string): void {
    this.socket.emit("leaveRoom", roomId);
  }

  joinOrCreateRoom(roomType: string): void {
    this.socket.emit("joinOrCreateRoom", roomType);
  }

  sendMessage(message: string): void {
    if (this.joinedRoomId) {
      this.socket.emit("message", { roomId: this.joinedRoomId, message });
    } else {
      console.error("Cannot send message, not joined in any room.");
    }
  }
}
