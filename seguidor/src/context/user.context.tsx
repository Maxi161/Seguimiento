"use client"

import { UserContextType } from "@/interfaces/user.interfaces";
import { createContext, useContext } from "react";


export const UserContext = createContext<UserContextType>({
  user: null,
  isLogged: false,
  loading: false,
  onProcess: {},
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
  getPendingConnections: async () => [],
  getMessagesWith: async () => {},
  getApplications: async () => {},
  updateApp: async () => {}
});

export const useUserContext = () => useContext(UserContext);
