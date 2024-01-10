import EventEmitter from "events";

export interface RoomStateUpdateEvent<TState> {
  roomId: string;
  newState: TState;
}

export class Room<TState = unknown> extends EventEmitter {
  id: string;
  type: string;
  clients: string[];
  state: TState;
  config: Record<string, unknown>;

  constructor(id: string, type: string, config: Record<string, unknown>) {
    super();
    this.id = id;
    this.type = type;
    this.clients = [];
    this.state = {} as TState;
    this.config = { ...config };
  }

  addClient(clientId: string) {
    this.clients.push(clientId);
  }

  removeClient(clientId: string) {
    this.clients = this.clients.filter((cid) => cid !== clientId);
  }

  updateState(updateFn: (currentState: TState) => TState): void {
    this.state = updateFn(this.state);

    this.emit("stateUpdated", {
      roomId: this.id,
      newState: this.state,
    } as RoomStateUpdateEvent<TState>);
  }
}
