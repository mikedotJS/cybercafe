import { CyberCafeServer } from "../classes/Server";
import { Room } from "../classes/Room";

describe("CyberCafeServer", () => {
  let server: CyberCafeServer<string>;

  beforeEach(() => {
    server = new CyberCafeServer<string>();
  });

  describe("defineRoomType", () => {
    it("should allow defining a new room type", () => {
      const mockConstructor = jest.fn();
      server.defineRoomType({ type: "chat", constructor: mockConstructor });
      expect(server["roomConstructors"].has("chat")).toBeTruthy();
    });
  });

  describe("createRoom", () => {
    it("should create a new room of a defined type", () => {
      const mockConstructor = jest
        .fn()
        .mockImplementation((type: string) => new Room(type, server));
      server.defineRoomType({ type: "chat", constructor: mockConstructor });
      const room = server.createRoom("chat", "room1");
      expect(mockConstructor).toHaveBeenCalled();
      expect(room).toBeInstanceOf(Room);
      expect(server["rooms"].has("room1")).toBeTruthy();
    });

    it("should throw an error for an undefined room type", () => {
      expect(() => {
        server.createRoom("unknown", "room1");
      }).toThrow("Unrecognized room type");
    });

    it("should throw an error if room ID is undefined", () => {
      const mockConstructor = jest
        .fn()
        .mockImplementation((type: string) => new Room(type, server));
      server.defineRoomType({ type: "chat", constructor: mockConstructor });
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        server.createRoom("chat", undefined);
      }).toThrow("Room ID cannot be undefined");
    });
  });

  describe("getRoom", () => {
    it("should retrieve a room by its ID", () => {
      const mockConstructor = jest
        .fn()
        .mockImplementation((type: string) => new Room(type, server));
      server.defineRoomType({ type: "chat", constructor: mockConstructor });
      const room = server.createRoom("chat", "room1");
      expect(server.getRoom("room1")).toBe(room);
    });

    it("should return undefined for a non-existent room ID", () => {
      expect(server.getRoom("nonExistent")).toBeUndefined();
    });
  });

  describe("removeRoom", () => {
    it("should remove a room by its ID", () => {
      const mockConstructor = jest
        .fn()
        .mockImplementation((type: string) => new Room(type, server));
      server.defineRoomType({ type: "chat", constructor: mockConstructor });
      server.createRoom("chat", "room1");
      server.removeRoom("room1");
      expect(server.getRoom("room1")).toBeUndefined();
    });
  });
});
