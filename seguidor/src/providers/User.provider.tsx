"use client";

import { UserContext } from "@/context/user.context";
import { IApplication } from "@/interfaces/seguimiento.interface";
import { User } from "@/interfaces/user.interfaces";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const rutaApi = "http://localhost:3005"

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true); // Nuevo estado de carga
  const router = useRouter();

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const { data } = await axios.post(`${rutaApi}/user/signin`, { ...credentials });
      const user: User = data;
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
    setUser({...user, applications: [...apps]} as User);
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
        const user: User = data

        localStorage.setItem("user", JSON.stringify(user));
        // router.push("/welcome");
        return true;
      } catch(error) {
        alert("error")
        console.log(error);
        return false;
      }
    };
  
  
    // Recupera el usuario de `localStorage` si está disponible
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLogged(true);
    }
    setLoading(false); // Marcar la carga como completa después de verificar
  }, []);
    
  
    return (
      <UserContext.Provider value={{ user, isLogged, login, register, logout, saveApplication, loading }}>
        {children}
      </UserContext.Provider>
    );
  };
  