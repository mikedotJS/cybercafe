import { Server } from "socket.io";
import { Room } from "./Room";

/**
 * Type alias for a constructor of a Room.
 * @template T The constructor parameters type.
 */
type RoomConstructor<T extends unknown[] = unknown[]> = new (
  ...args: T
) => Room;

/**
 * Type for room registration, holding the room type and its constructor.
 * @template RT The room type.
 * @template T The constructor parameters type.
 */
type RoomRegistration<RT, T extends unknown[] = unknown[]> = {
  type: RT;
  constructor: RoomConstructor<T>;
};

/**
 * Represents a server with the ability to manage different types of rooms.
 * @template RT The room type.
 */
export class CyberCafeServer<RT> {
  public io: Server;
  private rooms: Map<string, Room>;
  private roomConstructors: Map<RT, RoomConstructor>;

  /**
   * Initializes a new instance of the CyberCafeServer class.
   */
  constructor(io: Server) {
    this.io = io;
    this.rooms = new Map();
    this.roomConstructors = new Map();
  }

  /**
   * Defines a new room type and its associated constructor.
   * @param registration The room registration object containing the room type and constructor.
   */
  defineRoomType<T extends unknown[]>(
    registration: RoomRegistration<RT, T>
  ): void {
    this.roomConstructors.set(
      registration.type,
      registration.constructor as RoomConstructor
    );
  }

  /**
   * Creates a new room of the specified type.
   * @param roomType The type of the room to create.
   * @param args The constructor arguments for the room.
   * @returns The newly created room instance.
   * @throws When the room type is unrecognized or the room ID is undefined.
   */
  createRoom<T extends string[]>(roomType: RT, ...args: T): Room {
    const Constructor = this.roomConstructors.get(roomType);
    if (Constructor) {
      const room = new Constructor(...args, this);
      const roomId = args[0];
      if (roomId === undefined) {
        throw new Error("Room ID cannot be undefined");
      }
      this.rooms.set(roomId, room);
      return room;
    } else {
      throw new Error("Unrecognized room type");
    }
  }

  /**
   * Retrieves a room by its ID.
   * @param roomId The ID of the room to retrieve.
   * @returns The room instance if found, otherwise undefined.
   */
  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  /**
   * Removes a room from the server by its ID.
   * @param roomId The ID of the room to remove.
   */
  removeRoom(roomId: string): void {
    this.rooms.delete(roomId);
  }
}
