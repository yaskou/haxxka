export type Id = {
  id: string;
};

export type Messaging = {
  sender: Id;
  recipient: Id;
  timestamp: number;
  message: {
    mid: string;
    text?: string;
    is_deleted?: boolean;
  };
};

export type Entry = {
  time: number;
  id: string;
  messaging: Messaging[];
};

export type Payload = {
  object: "instagram";
  entry: Entry[];
};
