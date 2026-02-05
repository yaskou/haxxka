import { handleMessaging } from "./handleMessaging";
import type { Message, Messaging } from "./types";

const mockDB = {} as any;
const createTestPayload = (option: Omit<Message, "mid">) =>
  ({
    recipient: {
      id: "1234",
    },
    sender: {
      id: "5678",
    },
    timestamp: 123456,
    message: {
      mid: "1234",
      ...option,
    },
  }) satisfies Messaging;

const {
  createInbox,
  createMessage,
  createUser,
  deleteInbox,
  deleteMessage,
  readUser,
} = vi.hoisted(() => ({
  createInbox: vi.fn(),
  createMessage: vi.fn(),
  createUser: vi.fn(),
  deleteInbox: vi.fn(),
  deleteMessage: vi.fn(),
  readUser: vi.fn(() => true),
}));
vi.mock("db", () => ({
  createInbox,
  createMessage,
  createUser,
  deleteInbox,
  deleteMessage,
  readUser,
}));

describe("Handle messaging", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it("should happen nothing", async () => {
    const payload = createTestPayload({});

    await handleMessaging(mockDB, payload, {
      MY_IG_ID: "1234",
    });

    expect(createInbox).not.toHaveBeenCalled();
    expect(createMessage).not.toHaveBeenCalled();
    expect(createUser).not.toHaveBeenCalled();
    expect(deleteInbox).not.toHaveBeenCalled();
    expect(deleteMessage).not.toHaveBeenCalled();
    expect(readUser).not.toHaveBeenCalled();
  });

  it("should create a user", async () => {
    const payload = createTestPayload({
      text: "sample",
    });

    vi.mocked(readUser).mockReturnValue(false);

    await handleMessaging(mockDB, payload, {
      MY_IG_ID: "1234",
    });

    expect(readUser).toHaveBeenCalledOnce();
    expect(createUser).toHaveBeenCalledOnce();
  });

  it("should skip creating a user", async () => {
    const payload = createTestPayload({
      text: "sample",
    });

    await handleMessaging(mockDB, payload, {
      MY_IG_ID: "1234",
    });

    expect(readUser).toHaveBeenCalledOnce();
    expect(createUser).not.toHaveBeenCalled();
  });

  it("should delete a messaging", async () => {
    const payload = createTestPayload({
      is_deleted: true,
    });

    await handleMessaging(mockDB, payload, {
      MY_IG_ID: "1234",
    });

    expect(createInbox).not.toHaveBeenCalled();
    expect(createMessage).not.toHaveBeenCalled();
    expect(deleteInbox).toHaveBeenCalledOnce();
    expect(deleteMessage).toHaveBeenCalledOnce();
  });

  it("should create a inbox", async () => {
    const payload = createTestPayload({
      text: "sample",
    });

    await handleMessaging(mockDB, payload, {
      MY_IG_ID: "1234",
    });

    expect(createInbox).toHaveBeenCalledOnce();
    expect(createMessage).not.toHaveBeenCalled();
    expect(deleteInbox).not.toHaveBeenCalled();
    expect(deleteMessage).not.toHaveBeenCalled();
  });

  it("should create a message", async () => {
    const payload = createTestPayload({
      text: "sample",
    });

    await handleMessaging(mockDB, payload, {
      MY_IG_ID: "5678",
    });

    expect(createInbox).not.toHaveBeenCalled();
    expect(createMessage).toHaveBeenCalledOnce();
    expect(deleteInbox).not.toHaveBeenCalled();
    expect(deleteMessage).not.toHaveBeenCalled();
  });
});
