import { UserContextType } from "@/interfaces/user.interfaces";
import { createContext, useContext } from "react";


export const UserContext = createContext<UserContextType>({
  user: null,
  isLogged: false,
  loading: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  saveApplication: async () => {},
  downloadData: async () => {},
  getUsers: async () => [],
});

export const useUserContext = () => useContext(UserContext);
