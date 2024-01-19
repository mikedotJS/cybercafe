import { Socket, io } from "socket.io-client";

/**
 * Represents a client that can connect to different namespaces on the server.
 */
export class Client {
  private serverUrl: string;
  private currentNamespace: string;
  public socket: Socket | null;

  /**
   * Initializes a new instance of the Client class.
   * @param serverUrl The URL of the server to connect to.
   */
  constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
    this.currentNamespace = "";
    this.socket = null;
  }

  /**
   * Connects the client to a specified namespace.
   * @param namespace The namespace to connect to.
   */
  connect(namespace: string): void {
    if (this.currentNamespace !== namespace) {
      this.disconnect();
      this.currentNamespace = namespace;
      this.socket = io(`${this.serverUrl}/${namespace}`);
      this.setupBaseEventListeners();
    }
  }

  /**
   * Sets up base event listeners for the socket connection.
   */
  setupBaseEventListeners(): void {
    this.socket?.on("connect", () => {
      console.log(`Connected to namespace ${this.currentNamespace}`);
    });

    this.socket?.on("disconnect", () => {
      console.log(`Disconnected from namespace ${this.currentNamespace}`);
    });
  }

  /**
   * Disconnects the client from the current namespace.
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentNamespace = "";
    }
  }

  /**
   * Emits an event with associated data to the server.
   * @param event The event type to emit.
   * @param data The data to send with the event.
   */
  emit(event: string, data: unknown): void {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  /**
   * Registers an event handler for a specific event.
   * @param event The event type to listen for.
   * @param handler The function to call when the event occurs.
   */
  on(event: string, handler: (data: unknown) => void): void {
    if (this.socket) {
      this.socket.on(event, handler);
    }
  }

  /**
   * Registers an event handler for state updates.
   * @param handler The function to call when the state update event occurs.
   */
  onStateUpdate(handler: (data: unknown) => void): void {
    this.on("stateUpdate", handler);
  }
}
