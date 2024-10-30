"use client";

import { UserContext } from "@/context/user.context";
import { User } from "@/interfaces/user.interfaces";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const rutaApi = "http://localhost:3005"

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLogged, setIsLogged] = useState(false);
    const router = useRouter();
  
    // Función de inicio de sesión
    const login = async (credentials: { email: string; password: string }) => {
      try {
        // Simulación de autenticación
        const {data} = await axios.post(`${rutaApi}/user/signin`, {...credentials})
        const user: User = data;
        setUser(user);
        setIsLogged(true);
        localStorage.setItem("user", JSON.stringify(user));
        return true;
      } catch(error) {
        console.log(error)
        alert("error en el login")
        return false;
      }
    };
  
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
  
    // Función de cierre de sesión
    const logout = () => {
      setUser(null);
      setIsLogged(false);
      localStorage.removeItem("user");
      router.push("/login");
    };
  
    // Recupera el usuario de `localStorage` si está disponible
    useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsLogged(true);
      }
    }, []);
  
    return (
      <UserContext.Provider value={{ user, isLogged, login, register, logout }}>
        {children}
      </UserContext.Provider>
    );
  };
  