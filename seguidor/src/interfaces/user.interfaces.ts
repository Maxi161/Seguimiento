import { IApplication } from "./seguimiento.interface";

export interface User {
  name: string;
  email: string;
  id: string;
  role: string;
  applications: IApplication[];
}

export interface UserContextType {
  user: User | null;
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
}
