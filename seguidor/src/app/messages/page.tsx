"use client"

import { useUserContext } from "@/context/user.context"
import { IMessage, IUser } from "@/interfaces/user.interfaces";
import { Input, Button } from "@nextui-org/react"
import Loader from "@/ui/loader/Loader";
import { useEffect, useState } from "react";
import { UserContacList } from "@/ui/user/UserContacs";

export default function MessagesPage() {
  const { user, loading, conversations, sendMessage } = useUserContext();
  const [ friendOn, setFriendOn ] = useState<Partial<IUser> | null>(null);
  const [ message, setMessage ] = useState("");
  const [ conversation, setConversation ] = useState<IMessage[]>([])

  const handlerOnChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault()
    const { value }: { value: string} = evt.target;
    setMessage(value)
  }

  const handlerOnSend = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault()

    if(!message || message.trim() === "") return

    sendMessage({
      receiver: friendOn as IUser,
      sender: {name: user?.name, email: user?.email, id: user?.id, role: user?.role} as IUser,
      content: message
    })
  }

  useEffect(() => {

    console.log(friendOn)
    console.log(conversations)

    conversations.map((conver) => {
      conver.participants.map((user) => {
        if(user?.name === friendOn?.name) setConversation(conver.messages)
      })
    })

  }, [friendOn, conversations])
  
  if (loading) return <Loader />;
  return (
    <div className="w-full min-h-screen flex justify-center">
      <div className="w-9/12 h-full bg-blue-800 flex flex-row min-h-screen">
        <section className="w-1/3 min-h-full bg-[rgb(14,14,14)]">
        {/* <UserList users={user?.friends ? user.friends : []} header={false}/> */}
        <UserContacList friends={user?.friends as IUser[]} setOnFriend={setFriendOn} />
        </section>
        <section className="w-2/3 min-h-full bg-[rgb(30,30,30)] flex flex-col relative">
            {!friendOn ? (
            <div className="w-full h-full flex justify-center items-center">
              <span className="text-3xl text-slate-200">Selectiona un usuario</span>
            </div>
            ) : (  
            <div>
              <ul className="flex flex-col w-full h-auto">
              {conversation.map((message, index) => {
                return (
                    <p 
                    key={`${message.id}-${index}`}
                    // className={`${message.receiver ? "content-center" : ""}`}
                    >
                      {message.content}
                    </p>
                  )
                })}
                </ul>
            </div>
            )}
          <div className="absolute left-0 bottom-0 flex flex-row w-full">
            <Input
            type="text"
            value={message}
            onChange={handlerOnChange}
            >
            </Input>
            <Button onClick={handlerOnSend}>
              Enviar
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}