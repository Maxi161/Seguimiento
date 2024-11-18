"use client"

import { useUserContext } from "@/context/user.context";
import LoginForm from "@/ui/form/LoginForm";
import RegisterForm from "@/ui/form/RegisterForm";
import Loader from "@/ui/loader/Loader";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";


export default function Auth() {

  const { loading } = useUserContext()

 // Estado para alternar entre el formulario de login y registro
 const [showLogin, setShowLogin] = useState(true);

 // Función para alternar entre login y registro
 const toggleForm = () => {
   setShowLogin((prevShowLogin) => !prevShowLogin);
 };

 if (loading) return <Loader />;

 return (
   <div className="relative w-full z-10 flex flex-col min-h-screen">
     <AnimatePresence mode="wait">
     {showLogin ? (
       <LoginForm key="login" toggleForm={toggleForm} />
     ) : (
       <RegisterForm key="register" toggleForm={toggleForm} />
     )}
     </AnimatePresence>
   </div>
 );
}