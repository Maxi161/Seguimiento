"use client";
import { motion, Variants } from "framer-motion";
import { useState } from "react";

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

const InputField = ({
  label,
  type,
  name,
  value,
  onChange,
  error,
  classInput,
  classContainer,
  variants,
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  // Determina el tipo de input dinámicamente
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      className={`mb-4 relative ${classContainer}`}
    >
      <label htmlFor={name}>{label}:</label>
      <div className="relative">
        <input
          className={`w-full bg-gray-900 focus:outline-none ${classInput}`}
          type={inputType}
          id={name}
          name={name}
          value={value instanceof Date ? value.toISOString().split("T")[0] : value}
          onChange={onChange}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
            aria-label="Toggle password visibility"
          >
            {showPassword ? 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <mask id="lineMdWatchOffLoop0">
              <g fill="none" stroke="#008cff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                <circle cx="12" cy="12" r="0" fill="#008cff" stroke="none">
                  <animate attributeName="r" dur="6s" keyTimes="0;0.03;0.97;1" repeatCount="indefinite" values="0;3;3;0" />
                </circle>
                <path d="M4 12c1.38 -0.77 4.42 -1.3 8 -1.3c3.58 0 6.62 0.53 8 1.3c-1.38 0.77 -4.42 1.3 -8 1.3c-3.58 0 -6.62 -0.53 -8 -1.3Z">
                  <animate attributeName="d" dur="6s" keyTimes="0;0.03;0.97;1" repeatCount="indefinite" values="M4 12c1.38 -0.77 4.42 -1.3 8 -1.3c3.58 0 6.62 0.53 8 1.3c-1.38 0.77 -4.42 1.3 -8 1.3c-3.58 0 -6.62 -0.53 -8 -1.3Z;M2 12c1.72 -3.83 5.53 -6.5 10 -6.5c4.47 0 8.28 2.67 10 6.5c-1.72 3.83 -5.53 6.5 -10 6.5c-4.47 0 -8.28 -2.67 -10 -6.5Z;M2 12c1.72 -3.83 5.53 -6.5 10 -6.5c4.47 0 8.28 2.67 10 6.5c-1.72 3.83 -5.53 6.5 -10 6.5c-4.47 0 -8.28 -2.67 -10 -6.5Z;M4 12c1.38 -0.77 4.42 -1.3 8 -1.3c3.58 0 6.62 0.53 8 1.3c-1.38 0.77 -4.42 1.3 -8 1.3c-3.58 0 -6.62 -0.53 -8 -1.3Z" />
                </path>
                <path stroke="#000" strokeDasharray="28" strokeDashoffset="28" d="M0 11h24" transform="rotate(45 12 12)">
                  <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.4s" values="28;0" />
                </path>
                <path strokeDasharray="28" strokeDashoffset="28" d="M-1 13h24" transform="rotate(45 12 12)">
                  <animate attributeName="d" dur="6s" repeatCount="indefinite" values="M-1 13h24;M1 13h24;M-1 13h24" />
                  <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.4s" values="28;0" />
                </path>
              </g>
            </mask>
            <rect width="24" height="24" fill="#008cff" mask="url(#lineMdWatchOffLoop0)" />
          </svg>
           : 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="0" fill="#008cff">
              <animate attributeName="r" dur="6s" keyTimes="0;0.03;0.97;1" repeatCount="indefinite" values="0;3;3;0" />
            </circle>
            <path fill="none" stroke="#008cff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12c1.38 -0.77 4.42 -1.3 8 -1.3c3.58 0 6.62 0.53 8 1.3c-1.38 0.77 -4.42 1.3 -8 1.3c-3.58 0 -6.62 -0.53 -8 -1.3Z">
              <animate attributeName="d" dur="6s" keyTimes="0;0.03;0.97;1" repeatCount="indefinite" values="M4 12c1.38 -0.77 4.42 -1.3 8 -1.3c3.58 0 6.62 0.53 8 1.3c-1.38 0.77 -4.42 1.3 -8 1.3c-3.58 0 -6.62 -0.53 -8 -1.3Z;M2 12c1.72 -3.83 5.53 -6.5 10 -6.5c4.47 0 8.28 2.67 10 6.5c-1.72 3.83 -5.53 6.5 -10 6.5c-4.47 0 -8.28 -2.67 -10 -6.5Z;M2 12c1.72 -3.83 5.53 -6.5 10 -6.5c4.47 0 8.28 2.67 10 6.5c-1.72 3.83 -5.53 6.5 -10 6.5c-4.47 0 -8.28 -2.67 -10 -6.5Z;M4 12c1.38 -0.77 4.42 -1.3 8 -1.3c3.58 0 6.62 0.53 8 1.3c-1.38 0.77 -4.42 1.3 -8 1.3c-3.58 0 -6.62 -0.53 -8 -1.3Z" />
            </path>
          </svg>
            }
          </button>
        )}
      </div>
      {error && <p className="text-red-700">{error}</p>}
    </motion.div>
  );
};

export default InputField;
