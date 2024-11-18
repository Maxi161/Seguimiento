import { useUserContext } from "@/context/user.context";
import { IUser } from "@/interfaces/user.interfaces";
import { User } from "@nextui-org/react";
import { useState } from "react";

export const UserContacList = ({
  friends,
  setOnFriend,
}: {
  friends: IUser[];
  setOnFriend: (user: Partial<IUser>) => void;
}) => {
  const { getMessagesWith, user } = useUserContext();
  
  // Usamos un estado que almacena un objeto con el estado de carga para cada amigo
  const [messagesLoad, setMessagesLoad] = useState<Record<string, boolean>>({});

  const handlerClick = (friend: Partial<IUser>) => {
    setOnFriend(friend);

    // Verificamos si los mensajes ya fueron cargados para este amigo
    if (!messagesLoad[friend.id as string]) {
      // Si no han sido cargados, realizamos la petición
      getMessagesWith(user?.id as string, friend.id as string);
      // Actualizamos el estado para marcar que los mensajes de este amigo están cargados
      setMessagesLoad((prevState) => ({
        ...prevState,
        [friend.id as string]: true,
      }));
    }
  };

  return (
    <div className="flex flex-col w-full h-auto justify-center items-start">
      {friends.map((friend, index) => (
        <article
          key={`${index}-${friend.name}`}
          className="hover:bg-[rgb(255,255,255,.1)] transition-all w-full justify-center pt-2 pb-1 select-none cursor-pointer rounded-md"
          onClick={() => handlerClick(friend)}
        >
          <User key={`${friend.id}-${index}`} name={friend.name} description={friend.role} />
        </article>
      ))}
    </div>
  );
};
