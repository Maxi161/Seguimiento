"use client"

import LoginForm from "@/ui/form/LoginForm";
import RegisterForm from "@/ui/form/RegisterForm";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";


export default function Auth() {
 // Estado para alternar entre el formulario de login y registro
 const [showLogin, setShowLogin] = useState(true);

 // Función para alternar entre login y registro
 const toggleForm = () => {
   setShowLogin((prevShowLogin) => !prevShowLogin);
 };

 return (
   <div className="relative h-full w-full z-10 flex flex-col min-h-screen">
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