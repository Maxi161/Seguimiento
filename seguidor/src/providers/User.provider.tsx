"use client";

import { UserContext } from "@/context/user.context";
import { IApplication } from "@/interfaces/seguimiento.interface";
import { IConnection, IConversation, IMessage, IUser } from "@/interfaces/user.interfaces";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// const rutaApi = "https://seguimiento-13h8.onrender.com";
const rutaApi = "http://localhost:3005"
const socket = io(`${rutaApi}/message`, {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000, // 1 segundo
  transports: ['polling', 'websocket']

});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true);  // Indicando carga de datos inicial
  const [onProcess, setOnProcess] = useState(false);  // Indicando procesos en curso
  const [connections, setConnections] = useState<IConnection[]>([]);
  const [conversations, setConversations] = useState<IConversation[]>([])
  const router = useRouter();



  const updateConversations = (message: IMessage) => {
    setConversations((prevConversations) => {
      // Buscar si ya existe una conversación entre los participantes
      const existingConversation = prevConversations.find(
        (conv) =>
          (conv?.participants[0]?.id === message.sender.id && conv?.participants[1]?.id === message.receiver.id) ||
          (conv?.participants[0]?.id === message.receiver.id && conv?.participants[1]?.id === message.sender.id)
      );
  
      if (existingConversation) {
        // Si existe, agregar el mensaje a la conversación
        return prevConversations.map((conv) =>
          conv === existingConversation
            ? {
                ...conv,
                messages: [...conv.messages, message] // Aquí usas el mensaje completo
              }
            : conv
        );
      } else {
        // Si no existe, crear una nueva conversación con los participantes y el mensaje
        return [
          ...prevConversations,
          {
            participants: [message.sender, message.receiver],
            messages: [message] // Aquí usas el mensaje completo
          }
        ];
      }
    });
  };
  



  // Función para manejar la conexión de WebSocket
  const initializeWebSocket = (userId: string) => {
    if (userId) {
      socket.emit('join-chat', userId);
      console.log("Conexión WebSocket iniciada");

      // Escuchar mensajes entrantes
      socket.on('receive-message', (message: { sender: IUser; content: string, receiver: IUser, id: string, sentAt: Date }) => {
        console.log('Nuevo mensaje:', message);
        updateConversations(message);
      });
    }
  };

  const closeWebSocketConnection = (userId: string) => {
    if (userId) {
      socket.emit('leave-chat', userId);
      console.log("Conexión WebSocket cerrada");
    }
  };

  const mapConnectionsToFriends = async (user: IUser): Promise<IUser[]> => {
    const res = await axios.get(`${rutaApi}/connections/${user.id}`);
    const userConnections: IConnection[] = res.data;
    const friendsAccepted = userConnections.filter(
      (conn: IConnection) => conn.status === "accepted"
    );
    return friendsAccepted.map((conn) =>
      conn.userA.id !== user.id ? conn.userA : conn.userB
    );
  };

  const saveUserToLocalStorage = (user: IUser) => {
    localStorage.setItem("user", JSON.stringify(user));
  };

  const loadUserFromLocalStorage = (): IUser | null => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  };


  const sendMessage = async (data: Partial<IMessage>) => {
    try {
      setOnProcess(true)
      socket.emit("send-message", {receiver: data.receiver, sender: data.sender, content: data.content})
      setOnProcess(false)
    } catch (err) {
      console.log(err)
    }
  }
  

  // Login logic
  const login = async (credentials: { email: string; password: string }) => {
    try {
      setOnProcess(true);
      const { data } = await axios.post(`${rutaApi}/user/signin`, { ...credentials });
      const user: IUser = data;
      user.friends = await mapConnectionsToFriends(user);
      setUser(user);
      setIsLogged(true);
      saveUserToLocalStorage(user);
      setOnProcess(false);
      return true;
    } catch (error) {
      console.error(error);
      setOnProcess(false);
      alert("Error en el login");
      return false;
    }
  };

  // Logout logic
  const logout = () => {
    setUser(null);
    setIsLogged(false);
    localStorage.removeItem("user");
    router.push("/login");
  };

  // Save application data
  const saveApplication = async (formData: Partial<IApplication>) => {
    try {
      setOnProcess(true);
      const data = { ...formData, userId: user?.id };
      await axios.post(`${rutaApi}/application`, { ...data });

      const res = await axios.get(`${rutaApi}/application/${user?.email}`);
      const apps = res.data as IApplication[];
      const updatedUser = { ...user, applications: [...apps] } as IUser;
      setUser(updatedUser);
      saveUserToLocalStorage(updatedUser);
      setOnProcess(false);
    } catch (error) {
      console.error(error);
      setOnProcess(false);
    }
  };

  // Register new user logic
  const register = async (newUser: { name: string; email: string; password: string; confirmPassword: string }) => {
    try {
      setOnProcess(true);
      const { data } = await axios.post(`${rutaApi}/user/signup`, { ...newUser });
      const user: IUser = data;
      saveUserToLocalStorage(user);
      setOnProcess(false);
      return true;
    } catch (error) {
      console.error(error);
      setOnProcess(false);
      alert("Error al registrar usuario");
      return false;
    }
  };

  // Download user data
  const downloadData = async () => {
    try {
      setOnProcess(true);
      await axios.post(`${rutaApi}/data/add-data/${user?.email}`);
      const response = await axios.get(`${rutaApi}/data/${user?.email}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${user?.email}_data.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setOnProcess(false);
    } catch (error) {
      setOnProcess(false);
      console.error("Error al descargar el archivo", error);
    }
  };

  // Send connection request
  const sendConnection = async (userAId: string, userBId: string) => {
    try {
      setOnProcess(true);
      const res = await axios.post(`${rutaApi}/connections/request`, { userAId, userBId });
      console.log("Solicitud enviada con éxito:", res.data);
      setOnProcess(false);
    } catch (err) {
      setOnProcess(false);
      console.error("Error al enviar solicitud de conexión:", err);
    }
  };

  // Change connection status (accept or block)
  const changeConnection = async (id: string, action: "accept" | "block") => {
    try {
      setOnProcess(true);
      const res = await axios.patch(`${rutaApi}/connections/${id}/${action}`);
      const conn: IConnection = res.data;
      const userForConn = conn.userA.id !== user?.id ? conn.userA : conn.userB;

      if (action === "accept" && user) {
        const updatedUser = {
          ...user,
          friends: [...(user.friends || []), userForConn],
        };
        setUser(updatedUser);
        saveUserToLocalStorage(updatedUser);
      }
      setOnProcess(false);
    } catch (err) {
      console.error("Error al cambiar conexión:", err);
      setOnProcess(false);
    }
  };

  const getUsers = async () => {
    setOnProcess(true);
    const res = await axios.get(`${rutaApi}/user`);
    const users = res.data;
    setOnProcess(false);
    return users;
  };

  const getConnections = async (id: string) => {
    try {
      const res = await axios.get(`${rutaApi}/connections/${id}`);
      const conns: IConnection[] = res.data;
      setConnections(conns);
    } catch (err) {
      console.error("Error al obtener conexiones:", err);
    }
  };

  useEffect(() => {
    const storedUser = loadUserFromLocalStorage();
    if (storedUser) {
      setUser(storedUser);
      setIsLogged(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      initializeWebSocket(user.id);

      return () => {
        closeWebSocketConnection(user.id);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        isLogged,
        loading,
        onProcess,
        connections,
        conversations,
        login,
        register,
        logout,
        saveApplication,
        downloadData,
        getUsers,
        sendConnection,
        changeConnection,
        getConnections,
        sendMessage,
        
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
