"use client"

import { useUserContext } from "@/context/user.context"
import UserList from "@/ui/user/UserList";

export default function MessagesPage() {
  const { user } = useUserContext();
  

  return (
    <div className="w-full min-h-screen flex justify-center">
      <div className="w-9/12 h-full bg-blue-800 flex flex-row min-h-screen">
        <section className="w-1/3 min-h-full bg-[rgb(14,14,14)]">
        <UserList users={user?.friends ? user.friends : []} header={false}/>
        </section>
        <section className="w-2/3 min-h-full bg-[rgb(30,30,30)]"></section>
      </div>
    </div>
  )
}