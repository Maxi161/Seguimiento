"use client";

import { useUserContext } from "@/context/user.context";
import { IMessage, IUser } from "@/interfaces/user.interfaces";
import IconButton from '@mui/material/IconButton';
import Loader from "@/ui/loader/Loader";
import { useEffect, useMemo, useRef, useState } from "react";
import { UserContacList } from "@/ui/user/UserContacs";
import { useRouter } from "next/navigation"
import { Tooltip } from "@nextui-org/react";

export default function MessagesPage() {
  const { user, loading, sendMessage, conversations } = useUserContext();
  const [friendOn, setFriendOn] = useState<Partial<IUser> | null>(null);
  const [message, setMessage] = useState(""); // valor del input
  const [borrador, setBorrador] = useState<{ [key: string]: string }>({}); // Almacenar borradores por id de usuario
  const [conversation, setConversation] = useState<Partial<IMessage>[]>([]);
  const [inputFilterValue, setInputFilterValue] = useState("");
  const router = useRouter();

  // Filtrado de usuarios por el nombre
  const usersFiltered = useMemo(() => {
    return user?.friends.filter((user) =>
      user.name.toLowerCase().includes(inputFilterValue.toLowerCase())
    );
  }, [user?.friends, inputFilterValue]);

  const handleChangeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { value } = e.target;
    setInputFilterValue(value);
  };

  const handlerBack = () => {
    router.push("/");
  };

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handlerOnChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    const { value }: { value: string } = evt.target;
    setMessage(value);

    // Guardar el borrador para el usuario actual
    if (friendOn && friendOn.id) {
      setBorrador((prevBorrador) => ({
        ...prevBorrador,
        [friendOn.id as string]: value,
      }));
    }
  };

  const handlerOnSend = (
    evt?: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (evt) evt.preventDefault();

    if (!message || message.trim() === "") return;

    sendMessage({
      receiver: friendOn as IUser,
      sender: {
        name: user?.name,
        email: user?.email,
        id: user?.id,
        role: user?.role,
      } as IUser,
      content: message,
    });
    setMessage(""); // Limpiar el mensaje después de enviarlo

    // Limpiar el borrador para el usuario actual
    if (friendOn && friendOn.id) {
      setBorrador((prevBorrador) => ({
        ...prevBorrador,
        [friendOn.id as string]: "",
      }));
    }
  };

  const handleKeyPress = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === "Enter") {
      handlerOnSend(evt);
    }
  };

  // Función para hacer scroll al final
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Hacer scroll al final cada vez que la conversación cambie
  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  // Actualizar la conversación al seleccionar un amigo y cargar borrador
  useEffect(() => {
    if (friendOn) {
      const selectedConversation = conversations.find((conver) =>
        conver.participants.some((participant) => participant?.id === friendOn.id)
      );
      setConversation(selectedConversation ? selectedConversation.messages : []);

      // Cargar el borrador guardado si existe
      if (friendOn.id && borrador[friendOn.id]) {
        setMessage(borrador[friendOn.id]);
      } else {
        setMessage(""); // Limpiar si no hay borrador
      }
    }
  }, [friendOn, conversations, borrador]);

  if (loading) return <Loader />;
  
  return (
    <div className="w-full min-h-screen flex justify-center p-5">
      <div className="w-9/12 h-[calc(100vh - 40px)] flex flex-row">
        <section className="w-1/3 min-h-full bg-[rgb(14,14,14)] p-2">
          <div className="flex w-full h-auto mb-2">
            <button 
            type="button" 
            className="flex w-1/5 justify-center items-center"
            onClick={handlerBack}
            >
            <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="28" 
            height="28" 
            viewBox="0 0 24 24">
              <g 
              fill="none" 
              stroke="white" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2">
                <path 
                strokeDasharray="20" 
                strokeDashoffset="20" 
                d="M21 12h-17.5">
                  <animate 
                  fill="freeze" 
                  attributeName="stroke-dashoffset" 
                  dur="0.2s" 
                  values="20;0"/>
                  </path>
                  <path 
                  strokeDasharray="12"
                  strokeDashoffset="12" 
                  d="M3 12l7 7M3 12l7 -7">
                    <animate 
                    fill="freeze" 
                    attributeName="stroke-dashoffset" 
                    begin="0.2s" 
                    dur="0.2s" 
                    values="12;0"/>
                    </path>
                    </g>
            </svg>
            </button>
            <input 
            type="text" 
            placeholder="Buscar"
            onChange={handleChangeFilter}
            className="w-full outline-none rounded-md text-black"
            />
          </div>
          <UserContacList
            friends={usersFiltered as IUser[]}
            setOnFriend={setFriendOn}
          />
        </section>
        <section className="w-2/3 min-h-full bg-[rgb(30,30,30)] flex flex-col relative">
          {!friendOn ? (
            <div className="w-full h-full flex justify-center items-center">
              <span className="text-3xl text-slate-200">Selecciona un usuario</span>
            </div>
          ) : (
            <div className="h-full flex flex-col p-1">
              <ul className="flex flex-col w-full overflow-y-scroll h-[calc(100vh-100px)] gap-3">
                {conversation.map((message, index) => {
                  const isUserMessage = message?.sender?.email === user?.email;
                  return (
                    <li
                      key={`${message.id}-${index}`}
                      className={`relative w-full flex items-center p-1 ${
                        isUserMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      <p
                        className={`max-w-[60%] break-words p-2 rounded-lg text-white ${
                          isUserMessage
                            ? "bg-purple-900 text-right"
                            : "bg-gray-700 text-left"
                        }`}
                        style={{
                          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        {message.content}
                      </p>
                    </li>
                  );
                })}
                <div ref={messagesEndRef} />
              </ul>
            </div>
          )}
          <div className="absolute left-0 bottom-0 flex flex-row w-full justify-center items-center bg-[rgb(0,0,0,.4)] px-2">
            <input
              type="text"
              value={message}
              onChange={handlerOnChange}
              className="w-full h-7 outline-none text-black px-1 rounded-sm"
              onKeyDown={handleKeyPress}
            />
            <Tooltip content="Enviar con un cuervo" className="bg-inherit">
            <IconButton
            onClick={handlerOnSend}
            className="scale-75"
            >
              <svg
              xmlns="http://www.w3.org/2000/svg" 
              width="45"
              height="32" 
              viewBox="0 0 640 512">
                <path 
                fill="#747272"
                d="M544 32h-16.36C513.04 12.68 490.09 0 464 0c-44.18 0-80 35.82-80 80v20.98L12.09 393.57A30.22 30.22 0 0 0 0 417.74c0 22.46 23.64 37.07 43.73 27.03L165.27 384h96.49l44.41 120.1c2.27 6.23 9.15 9.44 15.38 7.17l22.55-8.21c6.23-2.27 9.44-9.15 7.17-15.38L312.94 384H352c1.91 0 3.76-.23 5.66-.29l44.51 120.38c2.27 6.23 9.15 9.44 15.38 7.17l22.55-8.21c6.23-2.27 9.44-9.15 7.17-15.38l-41.24-111.53C485.74 352.8 544 279.26 544 192v-80l96-16c0-35.35-42.98-64-96-64m-80 72c-13.25 0-24-10.75-24-24c0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24"/>
              </svg>
            </IconButton>
            </Tooltip>
          </div>
        </section>
      </div>
    </div>
  );
}
