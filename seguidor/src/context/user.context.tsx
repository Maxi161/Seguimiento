import { UserContextType } from "@/interfaces/user.interfaces";
import { createContext, useContext } from "react";


export const UserContext = createContext<UserContextType>({
  user: null,
  isLogged: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

export const useUserContext = () => useContext(UserContext);
