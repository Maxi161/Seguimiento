import { useUserContext } from "@/context/user.context";
import { IUser } from "@/interfaces/user.interfaces"
import { User } from "@nextui-org/react"



export const UserContacList = ({friends, setOnFriend}: {friends: IUser[]; setOnFriend: (user: Partial<IUser>) => void}) => {

  const { user, getMessagesWith } = useUserContext()

  const handlerClick = (friend: Partial<IUser>) => {
    setOnFriend(friend)
    getMessagesWith(user?.id as string, friend.id as string)
  }

  return (
    <div className="flex flex-col w-full h-auto justify-center items-start">
      {friends.map((friend, index) => {
        return (
          <article key={`${index}-${friend.name}`} 
          className="hover:bg-[rgb(255,255,255,.1)] transition-all w-full justify-center pt-2 pb-1 select-none cursor-pointer rounded-md"
          onClick={() => handlerClick(friend)}
          >
            <User 
            key={`${friend.id}-${index}`} 
            name={friend.name} 
            description={friend.role}
            />
          </article>
      )
      })}
    </div>
  )
}