import { Room } from "../classes/Room";
import { CyberCafeServer } from "../classes/Server";
import { Namespace, Server, Socket } from "socket.io";

jest.mock("socket.io", () => {
  const mockOn = jest.fn().mockImplementation(() => {
    return mockOn;
  });
  return {
    Server: jest.fn().mockImplementation(() => {
      return {
        of: jest.fn().mockReturnThis(),
        emit: jest.fn(),
        on: jest.fn(),
      };
    }),
    Socket: jest.fn().mockImplementation(() => {
      return {
        id: "mockSocketId",
        emit: jest.fn(),
        on: jest.fn(),
        join: jest.fn(),
        leave: jest.fn(),
      };
    }),
  };
});

describe("Room", () => {
  let server: CyberCafeServer<string>;
  let room: Room;
  let mockServer: Server;
  let mockSocket: Socket;
  interface MockNamespace {
    emit: jest.Mock;
  }
  let mockNamespace: MockNamespace;

  beforeEach(() => {
    mockServer = new Server() as unknown as Server;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mockSocket = new Socket() as unknown as Socket;
    server = new CyberCafeServer<string>();

    mockNamespace = {
      emit: jest.fn(),
    };

    jest
      .spyOn(mockServer, "of")
      .mockReturnValue(mockNamespace as unknown as Namespace);
    room = new Room("/test", server);

    room["namespace"] = mockNamespace as unknown as Namespace;
  });

  describe("constructor", () => {
    it("should initialize with an empty state", () => {
      expect(room["state"]).toEqual({});
    });

    it("should initialize without users", () => {
      expect(room["users"].size).toBe(0);
    });
  });

  describe("addUser", () => {
    it("should add a user to the room", () => {
      room.addUser("user1", mockSocket);
      expect(room["users"].has("user1")).toBeTruthy();
    });
  });

  describe("removeUser", () => {
    it("should remove a user from the room", () => {
      room.addUser("user1", mockSocket);
      room.removeUser("user1");
      expect(room["users"].has("user1")).toBeFalsy();
    });
  });

  describe("updateState", () => {
    it("should update the room state", () => {
      const initialState = { topic: "initial" };
      const update = { topic: "updated" };
      room["state"] = initialState;
      room.updateState(update);
      expect(room["state"]).toEqual(update);
    });
  });

  describe("broadcast", () => {
    it("should emit an event to all users", () => {
      const emitSpy = jest.spyOn(mockServer.of("/test"), "emit");
      room.broadcast("event", { data: "test" });
      expect(emitSpy).toHaveBeenCalledWith("event", { data: "test" });
    });
  });
});
