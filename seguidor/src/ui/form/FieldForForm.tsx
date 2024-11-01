"use client"
import {motion, Variants} from "framer-motion"

interface InputFieldProps {
    label: string;
    type: string;
    name: string;
    value: string | Date;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    classInput?: string;
    classContainer?: string;
    variants?: Variants;
  }

  const InputField = ({ label, type, name, value, onChange, error, classInput, classContainer, variants}: InputFieldProps) => {
    return (
      <motion.div 
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      className={`mb-4 ${classContainer}`}>
      <label htmlFor={name}>{label}:</label>
      <input
        
        className={`w-full bg-gray-900 focus:outline-none ${classInput}`}
        type={type}
        id={name}
        name={name}
        value={value instanceof Date ? value.toISOString().split('T')[0] : value}
        onChange={onChange}
      />
      {error && <p className="text-red-700">{error}</p>}
    </motion.div>
  )
  };

  export default InputField