"use client"

import { useUserContext } from "@/context/user.context";
import { IFormErrors } from "@/interfaces/form.interfaces";
import { motion } from "framer-motion"
import { useState } from "react";
import InputField from "./FieldForForm";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";


const LoginForm = ({ toggleForm }: { toggleForm: () => void }) => {

  const {login} = useUserContext()
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: "",
  });

  const [errors, setErrors] = useState<IFormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = (): IFormErrors => {
    const newErrors: IFormErrors = {};
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    if (!formData.email) {
      newErrors.email = 'Email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'Contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      try {
        const success = await login({ ...formData });
        if (success && !isAxiosError(success)) {
          router.push("/");
        } else {
          setErrors({});
        }
      } catch (err) {
        setErrors({});
        if(isAxiosError(err)){
          const {error} = err.response?.data
          console.log(error)
          switch(error){
            case "Unauthorized": setErrors((prevErrors) => {
              return {...prevErrors, unauthorized: true}
            })
                                  break
            case "user not found": setErrors((prevErrors) => {
              return {...prevErrors, userNotFound: true}
            })
                                  break
          }
        }
      }
      setFormData({ email: '', password: '' });
    } else {
      setErrors(validationErrors);
    }
  };


    const sectionVariants = {
      hidden: { opacity: 0, y: -100 },
      visible: { opacity: 1, y: 0, transition: {duration: .5}},
      exit: {opacity: 0, y: -100, transition: {duration: .5}}
    }
  

  return (
    <motion.section
    initial="hidden"
    animate="visible"
    exit="exit"
    key="login"
    variants={sectionVariants}
    className="flex flex-col items-center w-full mt-12">
      <h2 className="flex text-2xl">¡Hola de nuevo!</h2>
    <form onSubmit={handleSubmit} className="relative h-auto flex flex-col w-full lg:w-7/12 gap-1 p-3 justify-center">
      <InputField
        name="email"
        label="Email"
        onChange={handleChange}
        type="email"
        value={formData.email}
        error={errors.email}
       />

       <InputField
        name="password"
        label="Contraseña"
        onChange={handleChange}
        type="password"
        value={formData.password}
        error={errors.password}
       />
      <div className="flex justify-center items-center flex-col">
      {errors.unauthorized ? <span className="text-danger-500">El email o la contraseña son incorrectos</span> : null}
      {errors.userNotFound ? <span className="text-danger-500">EL usuario no se ha encontrado</span> : null}
      </div>
      <div className="flex w-full h-full justify-evenly items-center">
        <button type="button" onClick={toggleForm}>No tengo cuenta</button>
        <button type="submit" className="p-2 bg-purple-900 text-white rounded w-3/12">Iniciar sesión</button>
      </div>

    </form>
    </motion.section>
  )
}

export default LoginForm