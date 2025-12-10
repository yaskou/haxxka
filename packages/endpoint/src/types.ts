export interface Id {
  id: string;
}

export interface Messaging {
  sender: Id;
  recipient: Id;
  timestamp: number;
  message: {
    mid: string;
    text: string;
    is_deleted: boolean;
  };
}

export interface Entry {
  time: number;
  id: string;
  messaging: Messaging[];
}

export interface Payload {
  object: "instagram";
  entry: Entry[];
}
