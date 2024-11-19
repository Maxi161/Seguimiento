"use client";

import { UserContext } from "@/context/user.context";
import { IApplication } from "@/interfaces/seguimiento.interface";
import { IConnection, IConversation, IMessage, IUser } from "@/interfaces/user.interfaces";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const rutaApi = "https://seguimiento-13h8.onrender.com";

// const rutaApi = "http://localhost:3005"

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
  const [webSocketStatus, setWebSocketStatus] = useState(false)
  const router = useRouter();



  const updateConversations = (message: IMessage) => {
    setConversations((prevConversations) => {
      const { sender, receiver } = message;
      // Buscar si ya existe una conversación entre los participantes
      const existingConversation = prevConversations.find((conv) =>
        conv?.participants.some((participant) => participant?.id === sender.id) &&
        conv?.participants.some((participant) => participant?.id === receiver.id)
      );
  
      if (existingConversation) {
        // Si existe, agregar el mensaje a la conversación
        return prevConversations.map((conv) =>
          conv === existingConversation
            ? {
                ...conv,
                messages: [...conv.messages, message]
              }
            : conv
        );
      } else {
        // Si no existe, crear una nueva conversación con los participantes y el mensaje
        return [
          ...prevConversations,
          {
            participants: [sender, receiver],
            messages: [message]
          }
        ];
      }
    });
  };
  
  



  // Función para manejar la conexión de WebSocket
  const initializeWebSocket = (userId: string) => {
    if (userId && !webSocketStatus) {
      setWebSocketStatus(true)
      socket.emit('join-chat', userId);
      console.log("Conexión WebSocket iniciada");
      // Escuchar mensajes entrantes
      socket.on('receive-message', (message: IMessage) => {
        if (message.sender && message.receiver) {
          updateConversations(message);
        } else {
          console.log("El mensaje recibido no tiene un sender o receiver válido", message);
        }
      });

      socket.on("get-conversation-response", (data: IConversation) => {
        data.messages.map((message) => {
          updateConversations(message)
        })
        console.log("convesación actulizada")
      })
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
      if (!data.sender || !data.receiver) {
        console.error("El mensaje necesita un sender y un receiver válido.", data);
        return;
      }
      
      setOnProcess(true);
      // Emite el mensaje usando las propiedades correctas
      socket.emit("send-message", {
        receiver: data.receiver,
        sender: data.sender,
        content: data.content
      });
      setOnProcess(false);
    } catch (err) {
      console.log(err);
      setOnProcess(false);
    }
  };
  
  

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
      getConnections(user?.id as string)
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
    closeWebSocketConnection(user?.id as string)
    localStorage.removeItem("user");
    router.push("/auth");
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
      await axios.post(`${rutaApi}/connections/request`, { userAId, userBId });
      setOnProcess(false);
      getConnections(user?.id as string)
    } catch (err) {
      setOnProcess(false);
      console.error("Error al enviar solicitud de conexión:", err);
    }
  };

  // Change connection status (accept or block)
  const changeConnection = async (id: string, action: "accept" | "reject" | "block") => {
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
      console.log("Error al obtener conexiones:", err);
    }
  };
  

  const getMessagesWith = async (userAID: string, userBID: string ) => {
    socket.emit("get-messages", {userAID, userBID})
  }



  const getPendingConnections = async (id: string) => {
    try {
      setOnProcess(true)
      const res = await axios.get(`${rutaApi}/connections/${id}/pending`)
      const data = res?.data;
      setOnProcess(false)
      return data
    } catch (error) {
      setOnProcess(false)
      console.log("error al obtener las conexiones pendientes: ", error)
    }
  }


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
        getPendingConnections,
        getMessagesWith
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
