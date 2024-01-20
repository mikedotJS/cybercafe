import { Server, Socket } from "socket.io";
import { CyberCafeServer } from "./Server";

/**
 * Represents a room within the CyberCafe server environment.
 * This class provides the functionality to manage users and room state.
 */
export class Room {
  private namespace: ReturnType<Server["of"]>;
  public users: Map<string, Socket>;
  private state: Record<string, unknown>;
  private server: CyberCafeServer<string>;

  /**
   * Constructs a new Room instance.
   * @param namespace The namespace identifier for the room.
   * @param server The instance of the CyberCafeServer that this room belongs to.
   */
  constructor(namespace: string, server: CyberCafeServer<string>) {
    this.state = {};
    this.server = server;
    this.namespace = this.server.io.of(namespace);

    this.users = new Map();

    this.onCreate();

    this.namespace.on("connection", (socket) => {
      this.onMessage(socket);
      this.onJoin();
      socket.emit("stateUpdate", this.state);
    });
  }

  /**
   * Merges the provided state object with the current room state and broadcasts the updated state to all users.
   * @param update A partial state object with properties to merge into the current state.
   */
  updateState(update: Record<string, unknown>): void {
    this.state = { ...this.state, ...update };
    this.namespace.emit("stateUpdate", this.state);
  }

  /**
   * Lifecycle hook that is called immediately after the room is created.
   * This method can be overridden by subclasses to perform custom initialization.
   */
  protected onCreate() {}

  /**
   * Lifecycle hook that is called when a user joins the room.
   * This method can be overridden by subclasses to handle user joining events.
   */
  protected onJoin() {}

  protected onMessage(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    socket: Socket
  ) {}

  /**
   * Adds a user to the room and associates them with a socket connection.
   * @param userId The unique identifier for the user.
   * @param socket The socket instance associated with the user.
   */
  public addUser(userId: string, socket: Socket): void {
    this.users.set(userId, socket);
    socket.join(this.namespace.name);
  }

  /**
   * Removes a user from the room based on their unique identifier.
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
   * Sends an event with associated data to all users in the room.
   * @param event The name of the event to broadcast.
   * @param data The data to be sent with the event.
   */
  public broadcast(event: string, data: unknown): void {
    this.namespace.emit(event, data);
  }
}
