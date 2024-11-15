"use client";

import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { useUserContext } from '@/context/user.context';

interface ButtonConnectionProps {
  userId: string;
}

const ButtonConnection: React.FC<ButtonConnectionProps> = ({ userId }) => {
  const { user, sendConnection} = useUserContext()
  

  // Estado interno para manejar si está marcado o no
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    console.log(`Botón del usuario: ${userId}`)
  })
  // Función para manejar el clic
  const handleClick = () => {
    setIsChecked(true); // Alternar el estado entre true y false
    const sendConn = async () => {
      await sendConnection(user?.id as string, userId)
    }
    sendConn();

  };

  return (
    <IconButton className="z-[8000]" onClick={handleClick}>
      {isChecked ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path
            fill="#ffffff"
            fillRule="evenodd"
            d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18m-.232-5.36l5-6l-1.536-1.28l-4.3 5.159l-2.225-2.226l-1.414 1.414l3 3l.774.774z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="#ffffff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 12h14M12 5v14"
          />
        </svg>
      )}
    </IconButton>
  );
};

export default ButtonConnection;
