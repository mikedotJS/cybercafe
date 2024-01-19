import { Server, Socket } from "socket.io";
import { CyberCafeServer } from "./Server";

/**
 * Represents a room in the cybercafe server.
 */
export class Room {
  private io: Server;
  private namespace: ReturnType<Server["of"]>;
  private users: Map<string, Socket>;
  private state: Record<string, unknown>;
  private server: CyberCafeServer<string>;

  /**
   * Initializes a new instance of the Room class.
   * @param namespace The namespace identifier for the room.
   */
  constructor(namespace: string, server: CyberCafeServer<string>) {
    this.io = new Server();
    this.namespace = this.io.of(namespace);
    this.state = {};
    this.server = server;

    this.users = new Map();

    this.onCreate();

    this.namespace.on("connection", (socket) => {
      socket.emit("stateUpdate", this.state);
      this.onJoin();
    });
  }

  /**
   * Updates the room state with the provided state object.
   * @param update A partial state object with properties to update.
   */
  updateState(update: Record<string, unknown>): void {
    this.state = { ...this.state, ...update };
    this.namespace.emit("stateUpdate", this.state);
  }

  /**
   * Registers an event handler for a specific event.
   * @param event The name of the event to listen for.
   * @param handler The function to call when the event is emitted.
   */
  public on(
    event: string,
    handler: (socket: Socket, data: unknown) => void
  ): void {
    this.namespace.on(event, (socket: Socket, ...args: unknown[]) => {
      if (args.length === 1) {
        handler(socket, args[0]);
      } else {
        handler(socket, args);
      }
    });
  }

  /**
   * Called when the room is created. Can be overridden by subclasses.
   */
  protected onCreate() {}

  /**
   * Called when a user joins the room. Can be overridden by subclasses.
   */
  protected onJoin() {}

  /**
   * Adds a user to the room.
   * @param userId The unique identifier for the user.
   * @param socket The socket instance for the user.
   */
  public addUser(userId: string, socket: Socket): void {
    this.users.set(userId, socket);
    socket.join(this.namespace.name);
  }

  /**
   * Removes a user from the room.
   * @param userId The unique identifier for the user to remove.
   */
  public removeUser(userId: string): void {
    const user = this.users.get(userId);
    if (user) {
      user.leave(this.namespace.name);
      this.users.delete(userId);
    }
  }

  /**
   * Broadcasts an event to all users in the room.
   * @param event The name of the event to broadcast.
   * @param data The data to send with the event.
   */
  public broadcast(event: string, data: unknown): void {
    this.namespace.emit(event, data);
  }
}
