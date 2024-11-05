"use client";

import { UserContext } from "@/context/user.context";
import { IApplication } from "@/interfaces/seguimiento.interface";
import { IUser } from "@/interfaces/user.interfaces";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const rutaApi = "https://seguimiento-13h8.onrender.com"

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true); // Nuevo estado de carga
  const router = useRouter();

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const { data } = await axios.post(`${rutaApi}/user/signin`, { ...credentials });
      const user: IUser = data;
      setUser(user);
      setIsLogged(true);
      localStorage.setItem("user", JSON.stringify(user));
      return true;
    } catch (error) {
      console.log(error);
      alert("Error en el login");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsLogged(false);
    localStorage.removeItem("user");
    router.push("/login");
  };

  const saveApplication = async (formData: Partial<IApplication>) => {
  try {
    const data = {...formData, userId: user?.id}
    await axios.post(`${rutaApi}/application`, {
      ...data
    })

    const res = await axios.get(`${rutaApi}/application/${user?.email}`)
    const apps = res.data as IApplication[];
    setUser({...user, applications: [...apps]} as IUser);
    localStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.log(error)
  }

  }

    // Función de registro
    const register = async (newUser: { name: string; email: string; password: string; confirmPassword: string }) => {
      try {
        // Simulación de registro
        const {data} = await axios.post(`${rutaApi}/user/signup`, {...newUser})
        const user: IUser = data

        localStorage.setItem("user", JSON.stringify(user));
        // router.push("/welcome");
        return true;
      } catch(error) {
        alert("error")
        console.log(error);
        return false;
      }
    };
  
    const downloadData = async () => {
      try {
        // Primero, solicita al backend que genere el archivo
        await axios.post(`${rutaApi}/data/add-data/${user?.email}`);
        
        // Luego, solicita el archivo para descargarlo
        const response = await axios.get(`${rutaApi}/data/${user?.email}`, {
          responseType: 'blob', // Asegura que la respuesta sea en formato blob
        });
    
        // Crear una URL temporal con el blob del archivo
        const url = window.URL.createObjectURL(new Blob([response.data]));
    
        // Crear un enlace de descarga en memoria
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${user?.email}_data.xlsx`); // Nombre del archivo descargado
        document.body.appendChild(link);
    
        // Disparar la descarga automáticamente
        link.click();
    
        // Limpiar el enlace y la URL temporal después de la descarga
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.log("Error al descargar el archivo", error);
      }
    };
    

    const getUsers = async () => {
      const res = await axios.get(`${rutaApi}/user`)
      const users = res.data
      return users
    }

    // Recuera el usuario de `localStorage` si está disponible
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLogged(true);
    }
    setLoading(false); // Marcar la carga como completa después de verificar
  }, []);
    
  
    return (
      <UserContext.Provider value={{ user, isLogged, login, register, logout, saveApplication, downloadData, getUsers, loading }}>
        {children}
      </UserContext.Provider>
    );
  };
  