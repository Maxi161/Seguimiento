"use client";

import { useUserContext } from "@/context/user.context";
import { IMessage, IUser } from "@/interfaces/user.interfaces";
import { Input, Button } from "@nextui-org/react";
import Loader from "@/ui/loader/Loader";
import { useEffect, useRef, useState } from "react";
import { UserContacList } from "@/ui/user/UserContacs";

export default function MessagesPage() {
  const { user, loading, sendMessage, conversations } = useUserContext();
  const [friendOn, setFriendOn] = useState<Partial<IUser> | null>(null);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<Partial<IMessage>[]>([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handlerOnChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    const { value }: { value: string } = evt.target;
    setMessage(value);
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

  // Actualizar la conversación al seleccionar un amigo
  useEffect(() => {
    if (friendOn) {
      const selectedConversation = conversations.find((conver) =>
        conver.participants.some((participant) => participant?.id === friendOn.id)
      );
      setConversation(selectedConversation ? selectedConversation.messages : []);
    }
  }, [friendOn, conversations]);

  if (loading) return <Loader />;
  return (
    <div className="w-full min-h-screen flex justify-center">
      <div className="w-9/12 h-full bg-blue-800 flex flex-row min-h-screen">
        <section className="w-1/3 min-h-full bg-[rgb(14,14,14)]">
          <UserContacList
            friends={user?.friends as IUser[]}
            setOnFriend={setFriendOn}
          />
        </section>
        <section className="w-2/3 min-h-full bg-[rgb(30,30,30)] flex flex-col relative">
          {!friendOn ? (
            <div className="w-full h-full flex justify-center items-center">
              <span className="text-3xl text-slate-200">Selecciona un usuario</span>
            </div>
          ) : (
            <div className="h-full flex flex-col p-4">
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
          <div className="absolute left-0 bottom-0 flex flex-row w-full">
            <Input
              type="text"
              value={message}
              onChange={handlerOnChange}
              className="h-7"
              onKeyDown={handleKeyPress}
            />
            <Button onClick={handlerOnSend}>Enviar</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
