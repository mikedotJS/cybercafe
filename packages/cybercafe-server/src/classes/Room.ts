import EventEmitter from "events";

interface RoomStateUpdateEvent<TState> {
  roomId: string;
  newState: TState;
}

export class Room<TState = unknown> extends EventEmitter {
  id: string;
  type: string;
  clients: string[];
  state: TState;

  constructor(id: string, type: string, config: any) {
    super();
    this.id = id;
    this.type = type;
    this.clients = [];
    this.state = { ...config };
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
