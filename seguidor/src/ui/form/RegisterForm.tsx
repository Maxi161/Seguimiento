/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { IFormErrors } from "@/helpers/form.dtos";
import { motion } from "framer-motion";
import { useState } from "react";

import { useUserContext } from "@/context/user.context";
import InputField from "./FieldForForm";

const RegisterForm = ({ toggleForm }: { toggleForm: () => void} ) => {

  const {user, register} = useUserContext()

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
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

    if (!formData.name) {
      newErrors.name = 'Nombre es requerido';
    }

    if (!formData.password) {
      newErrors.password = 'Contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmar contraseña es requerido';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      try {
        console.log(user);
        register({...formData})
        alert("pichula")
        console.log(user);
      } catch (error) {
        console.log(error);
      }
      setFormData({ email: '', name: '', password: '', confirmPassword: '' });
      setErrors({});
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
      variants={sectionVariants}
      className="flex flex-col items-center w-full mt-12" id="Registro">
        <h2 className="flex text-2xl">¡Bienvenido!</h2>
        <form onSubmit={handleSubmit} className="relative h-auto flex flex-col w-full lg:w-7/12 gap-1 p-3 justify-center">
        <InputField
            label="Nombre"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <InputField
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
          <InputField
            label="Confirmar Contraseña"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />
          <div className="flex w-full h-full justify-evenly items-center">
          <button type="button" onClick={toggleForm}>Ya tengo cuenta</button>
          <button type="submit" className="p-2 bg-purple-900 text-white rounded w-3/12">Registrarse</button>
          </div>
        </form>
      </motion.section>
    
  );
};

export default RegisterForm;
