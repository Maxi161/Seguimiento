"use client";

import { UserContext } from "@/context/user.context";
import { IProcess } from "@/interfaces/process.interfaces";
import { IApplication, IParsedApplication } from "@/interfaces/seguimiento.interface";
import { IConnection, IConversation, IMessage, IUser } from "@/interfaces/user.interfaces";
import axios, { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// const rutaApi0 = "https://seguimiento-13h8.onrender.com";

const rutaApi = "http://localhost:3005";

// const rutaApi = "https://seguimiento-4rct.onrender.com";

const socket = io(`${rutaApi}/message`, {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000, // 1 segundo
  transports: ['polling', 'websocket']

});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState("")
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true);  // Indicando carga de datos inicial
  const [onProcess, setOnProcess] = useState<IProcess>({
    sendMessage: false,
    login: false,
    register: false,
    saveApp: false,
    getApps: false,
    downloadApp: false,
    changeConn: false,
    sendConn: false,
    getUsers: false,
    getPendingConn: false,
    getConn: false
  });  // Indicando procesos en curso
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
    if(!onProcess.sendMessage){
      try {
        if (!data.sender || !data.receiver) {
          console.error("El mensaje necesita un sender y un receiver válido.", data);
          return;
        }
        
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            sendMessage: true
          }
        });
        // Emite el mensaje usando las propiedades correctas
        socket.emit("send-message", {
          receiver: data.receiver,
          sender: data.sender,
          content: data.content
        });
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            sendMessage: false
          }
        });
      } catch (err) {
        console.log(err);
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            sendMessage: false
          }
        });
      }
    }
  };
  
  

  // Login logic
  const login = async (credentials: { email: string; password: string }) => {
    if (!onProcess.login) {
      try {
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            login: true
          }
        });
        const { data } = await axios.post(`${rutaApi}/user/signin`, { ...credentials });
        const user: IUser = data.userData;
        setToken(data.token ?? "")
        user.friends = await mapConnectionsToFriends(user);
        setUser(user);
        setIsLogged(true);
        saveUserToLocalStorage(user);
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            login: false
          }
        });
        getConnections(user?.id as string)
        return true;
      } catch (error) {
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            login: false
          }
        });
        if(isAxiosError(error)) throw error
        return false
      }
    }
    return false
  };

  // Logout logic
  const logout = () => {
    router.push("/auth");
    setUser(null);
    setIsLogged(false);
    closeWebSocketConnection(user?.id as string)
    localStorage.removeItem("user");
    setConversations([])
    setConnections([])
  };

  // Save application data
  const saveApplication = async (formData: Partial<IApplication>) => {
    if (!onProcess.saveApp) {
      try {
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            saveApp: true
          }
        });
        const data = { ...formData, userId: user?.id };
        const response = await axios.post(
          `${rutaApi}/application`,
          data, // Aquí van los datos del cuerpo
          {
            headers: {
              Authorization: `Bearer ${token}`, // Incluye el token aquí
            },
          }
        );
        
        const apps = response.data as IApplication[]
        const updatedUser = { ...user, applications: [...apps] } as IUser;
        setUser(updatedUser);
        saveUserToLocalStorage(updatedUser);
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            saveApp: false
          }
        });
      } catch (error) {
        console.error(error);
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            saveApp: false
          }
        });
      }
    }
  };

  const getApplications = async (email: string) => {
    if (!onProcess.getApps) {
      try {
        // Marcar que estamos procesando la solicitud
        setOnProcess((prevProcess) => ({
          ...prevProcess,
          getApps: true,
        }));
        const res = await axios.get(`${rutaApi}/application/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });        
        const data: IParsedApplication[] = res.data || []; // Asignamos un arreglo vacío en caso de que no haya datos.
  
        const student: IUser | undefined = user?.friends.find((user) => user.email === email);
        if (!student) {
          console.log(`Usuario con el email ${email} no se ha encontrado`);
          return;
        }
        
        // Aseguramos que applications sea un arreglo, aunque sea vacío
        student.applications = data.length ? data : [];
  
        console.log("Se acaba de realizar una petición para el usuario ", email);
  
        // Desmarcar el estado de procesamiento
        setOnProcess((prevProcess) => ({
          ...prevProcess,
          getApps: false,
        }));
      } catch (err) {
        console.log(err);
        console.log(token)
        // Desmarcar el estado de procesamiento en caso de error
        setOnProcess((prevProcess) => ({
          ...prevProcess,
          getApps: false,
        }));
      }
    }
  };
  
  const updateApp = async (app: IParsedApplication) => {
    try {
      const res = await axios.put(`${rutaApi}/application`, {
        ...app,
        headers: {
          ["authorization"]: token
        }
      })
      const { data } = res;
      const appIndex = user?.applications.findIndex(application => application.id === app.id);

      if(!appIndex) throw new Error(`App ${app.id} was not found`)
      if(!user) throw new Error("user not found")

      const newApps = [...user.applications]
      newApps[appIndex] = {...data}

      setUser((prevData) => {
        return {
          ...prevData,
          applications: [...newApps]
        } as IUser
      })
    } catch (error) {
      console.log(error)
    }
  }

  // Register new user logic
  const register = async (newUser: { name: string; email: string; password: string; confirmPassword: string }) => {
    if(!onProcess.register){
      try {
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            register: true
          }
        });
        const { data } = await axios.post(`${rutaApi}/user/signup`, { ...newUser });
        const user: IUser = data;
        saveUserToLocalStorage(user);
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            register: false
          }
        });
        return true;
      } catch (error) {
        console.error(error);
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            register: false
          }
        });
        alert("Error al registrar usuario");
        return false;
      }
    }
    return false
  };

  // Download user data
  const downloadData = async (userEmail: string) => {
    if(!onProcess.downloadApp){
      try {
        const email = userEmail ?? user?.email;
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            downloadApp: true
          }
        });
        if(!email){

        }
        await axios.post(`${rutaApi}/data/add-data/${email}`);
        const response = await axios.get(`${rutaApi}/data/${email}`, {
          responseType: "blob",
        });
  
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${email}_data.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            downloadApp: false
          }
        });
      } catch (error) {
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            downloadApp: false
          }
        });
        console.error("Error al descargar el archivo", error);
      }
    }
  };

  // Send connection request
  const sendConnection = async (userAId: string, userBId: string) => {
    if(!onProcess.sendConn){
      try {
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            sendConn: true
          }
        });
        await axios.post(`${rutaApi}/connections/request`, { userAId, userBId });
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            sendConn: false
          }
        });
        getConnections(user?.id as string)
      } catch (err) {
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            sendConn: false
          }
        });
        console.error("Error al enviar solicitud de conexión:", err);
      }
    }
  };

  // Change connection status (accept or block)
  const changeConnection = async (id: string, action: "accept" | "reject" | "block") => {
    if(!onProcess.changeConn){
      try {
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            changeConn: true
          }
        });
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
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            changeConn: false
          }
        });
      } catch (err) {
        console.error("Error al cambiar conexión:", err);
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            changeConn: false
          }
        });
      }
    }
  };

  const getUsers = async () => {
    if(!onProcess.getUsers){
      try {
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            getUsers: true
          }
        });
        const res = await axios.get(`${rutaApi}/user`);
        const users = res.data;
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            getUsers: false
          }
        });
        return users;
      } catch (error) {
        console.log(error)
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            getUsers: false
          }
        });
      }
    }
  };

  const getConnections = async (id: string) => {
    if(!onProcess.getConn){
      try {
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            getConn: true
          }
        })
        const res = await axios.get(`${rutaApi}/connections/${id}`);
        const conns: IConnection[] = res.data;
        setConnections(conns);
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            getConn: false
          }
        })
      } catch (err) {
        console.log("Error al obtener conexiones:", err);
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            getConn: false
          }
        })
      }
    }
  };
  

  const getMessagesWith = async (userAID: string, userBID: string ) => {
    socket.emit("get-messages", {userAID, userBID})
  }



  const getPendingConnections = async (id: string) => {
    if(!onProcess.getPendingConn){
      try {
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            getPendingConn: true
          }
        });
        const res = await axios.get(`${rutaApi}/connections/${id}/pending`)
        const data = res?.data;
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            getPendingConn: false
          }
        });
        return data
      } catch (error) {
        setOnProcess((prevProcess) => {
          return {
            ...prevProcess,
            getPendingConn: false
          }
        });
        console.log("error al obtener las conexiones pendientes: ", error)
      }
    }
  }


  useEffect(() => {
    const storedUser = loadUserFromLocalStorage();
    if (storedUser) {
      setUser(storedUser);
      setIsLogged(true);
      initializeWebSocket(storedUser.id);
      console.log("Usuario cargado y WebSocket inicializado.");
    }
  
    setLoading(false);
  
    return () => {
      if (storedUser) {
        console.log("Se ejecutó el cleanup.");
        logout();
      }
    };
  }, []);

  useEffect(() => {
    if (user) {
      saveUserToLocalStorage(user);
      console.log("Usuario actualizado y almacenado en localStorage.");
    }
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
        getMessagesWith,
        getApplications,
        updateApp,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};


// Load SVG
{/* <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="white" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" opacity="0.5"/><path fill="white" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"><animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite" to="360 12 12" type="rotate"/></path></svg> */}
