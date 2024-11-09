import { UserContextType } from "@/interfaces/user.interfaces";
import { createContext, useContext } from "react";


export const UserContext = createContext<UserContextType>({
  user: null,
  isLogged: false,
  loading: false,
  onProcess: false,
  connections: [],
  conversations: [],
  login: async () => false,
  register: async () => false,
  logout: () => {},
  saveApplication: async () => {},
  downloadData: async () => {},
  getUsers: async () => [],
  sendConnection: async () => {},
  changeConnection: async () => {},
  getConnections: async () => {},
  sendMessage: async () => {},
});

export const useUserContext = () => useContext(UserContext);
