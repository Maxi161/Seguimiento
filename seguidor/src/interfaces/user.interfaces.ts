import { AxiosError } from "axios";
import { IProcess } from "./process.interfaces";
import { IApplication, IParsedApplication } from "./seguimiento.interface";

export interface IConnection {
  id: string;
  userA: IUser;
  userB: IUser;
  status: "pending" | "accepted" | "bloqued";
  createdAt: Date | string;
}

export interface IMessage {
  id?: string;
  content: string;
  sentAt: Date;
  sender: IUser;
  receiver: IUser;
}

export interface IConversation {
  participants: IUser[] | Partial<IUser[]>;
  messages: IMessage[];
}

export interface IUser {
  name: string;
  email: string;
  id: string;
  role: string;
  receiverMessages: IMessage[];
  sentMessages: IMessage[];
  applications: IParsedApplication[];
  friends: IUser[];
}

export interface UserContextType {
  user: IUser | null;
  isLogged: boolean;
  loading: boolean;
  onProcess: Partial<IProcess>;
  connections: IConnection[];
  conversations: IConversation[];
  login: (credentials: {
    email: string;
    password: string;
  }) => Promise<boolean | AxiosError>;
  register: (newUser: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<boolean>;
  logout: () => void;
  saveApplication: (data: IApplication) => Promise<void>;
  downloadData: (email: string) => Promise<void>;
  getUsers: () => Promise<IUser[]>;
  sendConnection: (userA: string, userB: string) => Promise<void>;
  changeConnection: (
    id: string,
    action: "accept" | "block" | "reject"
  ) => Promise<void>;
  getConnections: (id: string) => Promise<void>;
  sendMessage: (data: Partial<IMessage>) => Promise<void>;
  getPendingConnections: (id: string) => Promise<IConnection[]>;
  getMessagesWith: (userAID: string, userBID: string) => Promise<void>;
  getApplications: (email: string) => Promise<void>;
  updateApp: (app: IParsedApplication) => Promise<void>;
}
