export interface Message {
  id:        string;
  name:      string;
  email:     string;
  phone?:    string;
  subject?:  string;
  message:   string;
  read:      boolean;
  replied:   boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMessageInput {
  name:     string;
  email:    string;
  phone?:   string;
  subject?: string;
  message:  string;
}
