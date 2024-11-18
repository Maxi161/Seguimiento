import { IUser } from "./user.interfaces";

export interface IMessageConfig {
  id?: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  content: string;
  sender: Partial<IUser>;
  receiver: Partial<IUser>;
  userA: Partial<IUser>;
  userB: Partial<IUser>;
}
