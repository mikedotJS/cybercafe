import * as http from "http";
import { Server } from "socket.io";
import { Room } from "./classes/Room";
import { v4 as uuidv4 } from "uuid";

type RoomConstructor = new (roomId: string, config: object) => Room;

export class CybercafeServer {
  private io: Server;
  private rooms: { [id: string]: Room } = {};
  private roomTypes: { [type: string]: RoomConstructor } = {};

  constructor(server: http.Server) {
    this.io = new Server(server);

    this.io.on("connection", (socket) => {
      socket.on("leaveRoom", (roomId: string) =>
        this.leaveRoom(roomId, socket.id)
      );

      socket.on("joinOrCreateRoom", (roomType: string) =>
        this.joinOrCreateRoom(roomType, socket.id)
      );
    });
  }

  joinOrCreateRoom(roomType: string, clientId: string): void {
    const existingRoomId = Object.keys(this.rooms).find(
      (roomId) => this.rooms[roomId]?.type === roomType
    );

    if (existingRoomId) {
      this.joinRoom(existingRoomId, clientId);
    } else {
      const newRoomId = this.createRoom(roomType, {});
      this.joinRoom(newRoomId, clientId);
    }
  }

  define(type: string, constructor: RoomConstructor): void {
    this.roomTypes[type] = constructor;
  }

  createRoom(roomType: string, config: object): string {
    const roomId = this.generateRoomId();
    const RoomTypeConstructor = this.roomTypes[roomType];
    if (!RoomTypeConstructor) {
      throw new Error(`Room type ${roomType} is not defined.`);
    }
    const room = new RoomTypeConstructor(roomId, config);

    room.on("stateUpdated", (event) => {
      this.io.to(event.roomId).emit("stateUpdated", event.newState);
    });

    this.rooms[roomId] = room;
    return roomId;
  }

  joinRoom(roomId: string, playerId: string): void {
    const room = this.rooms[roomId];
    if (room) {
      room.addClient(playerId);
      this.io.to(playerId).emit("joinedRoom", room);
    }
  }

  leaveRoom(roomId: string, playerId: string) {
    const room = this.rooms[roomId];
    room?.removeClient(playerId);
  }

  moveClientToRoom(
    clientId: string,
    fromRoomId: string,
    toRoomId: string
  ): void {
    const fromRoom = this.rooms[fromRoomId];
    const toRoom = this.rooms[toRoomId];

    if (!fromRoom) {
      throw new Error(`Room with ID ${fromRoomId} does not exist.`);
    }

    if (!toRoom) {
      throw new Error(`Room with ID ${toRoomId} does not exist.`);
    }

    fromRoom.removeClient(clientId);
    toRoom.addClient(clientId);
  }

  private generateRoomId(): string {
    return "room_" + uuidv4();
  }
}
