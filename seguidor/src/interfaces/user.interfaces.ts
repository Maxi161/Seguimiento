import { IApplication, IParsedApplication } from "./seguimiento.interface";

export interface IUser {
  name: string;
  email: string;
  id: string;
  role: string;
  applications: IParsedApplication[];
}

export interface UserContextType {
  user: IUser | null;
  isLogged: boolean;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  register: (newUser: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<boolean>;
  logout: () => void;
  saveApplication: (data: IApplication) => Promise<void>;
  downloadData: () => Promise<void>;
  getUsers: () => Promise<IUser[]>;
}
