export type Id = {
  id: string;
};

export type Message = {
  mid: string;
  text?: string;
  is_deleted?: boolean;
};

export type Messaging = {
  sender: Id;
  recipient: Id;
  timestamp: number;
  message: Message;
};

export type Payload = {
  object: "instagram";
  entry: {
    time: number;
    id: string;
    messaging: Messaging[];
  }[];
};
