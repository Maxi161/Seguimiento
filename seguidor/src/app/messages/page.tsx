"use client"

import { useUserContext } from "@/context/user.context"
import { IMessage, IUser } from "@/interfaces/user.interfaces";
import { Input, Button } from "@nextui-org/react"
import Loader from "@/ui/loader/Loader";
import UserList from "@/ui/user/UserList";
import { useState } from "react";

export default function MessagesPage() {
  const { user, loading, messageOperation } = useUserContext();
  const [ friendOn, setFriendOn ] = useState<Partial<IUser>>({});
  const [ message, setMessage] = useState("");
  const [ conversation, setConversation ] = useState<IMessage[]>([])

  const handlerOnChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault()
    const { value }: { value: string} = evt.target;
    setMessage(value)
  }

  const handerOnSend = (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault()
    messageOperation({
      content: message,
      receiver: friendOn,
      method: "POST",
      sender: user,
      
    })
  }

  if (loading) return <Loader />;

  return (
    <div className="w-full min-h-screen flex justify-center">
      <div className="w-9/12 h-full bg-blue-800 flex flex-row min-h-screen">
        <section className="w-1/3 min-h-full bg-[rgb(14,14,14)]">
        <UserList users={user?.friends ? user.friends : []} header={false}/>
        </section>
        <section className="w-2/3 min-h-full bg-[rgb(30,30,30)] flex flex-col relative">
          <div>
            <ul>

            </ul>
          </div>
          <div className="absolute left-0 bottom-0 flex flex-row w-full">
            <Input
            type="text"
            value={message}
            onChange={handlerOnChange}
            >
            </Input>
            <Button>
              Enviar
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}