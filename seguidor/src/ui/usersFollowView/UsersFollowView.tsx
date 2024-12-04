"use client"
import { useUserContext } from "@/context/user.context";
import { User } from "@nextui-org/react";
import FollowView from "../follow/FollowView";
import { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import Header from "../header/Header";
import { IUser } from "@/interfaces/user.interfaces";

const UsersFollowView = () => {
  const { user, getApplications } = useUserContext();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [friendsWithApps, setFriendsWithApps] = useState<IUser[]>([]);

  useEffect(() => {
    const getFriendsApps = async () => {
      if (!user?.friends) return; // Si no hay amigos, no hacemos nada.

      // Filtrar amigos que aún no tienen aplicaciones cargadas
      const friendsToFetch = user.friends.filter(
        (friend) => !friend.applications?.length
      );

      if (friendsToFetch.length === 0) return; // Si ya están cargadas, no hacemos nada.

      try {
        const promises = friendsToFetch.map(async (friend) => {
          await getApplications(friend.email);
          const applications = friend.applications;
          return { ...friend, applications }; // Devuelve el amigo con las apps cargadas
        });

        const updatedFriends = await Promise.all(promises);
        setFriendsWithApps((prev) => [...prev, ...updatedFriends]);
      } catch (error) {
        console.error("Error fetching applications for friends:", error);
      }
    };

    getFriendsApps();
  }, [user?.friends]);

  const handlerClick = async (email: string) => {
    try {
      await getApplications(email);
      const userFriend: IUser | undefined = user?.friends.find((friend) => friend.email !== email)
      setFriendsWithApps((prev) =>
        prev.map((friend) =>
          friend.email === email
            ? { ...friend, applications: userFriend?.applications || [] } // Si applications es undefined, asignamos un arreglo vacío
            : friend
        )
      );      
    } catch (error) {
      console.error(`Error updating applications for ${email}:`, error);
    }
  };

  return (
    <div className="flex flex-col w-full h-auto">
      <Header />
      <div className="relative h-7">
        <IconButton
          className="absolute left-0 rounded-full"
          onClick={() => router.push("/")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="44"
            height="44"
            viewBox="0 0 24 24"
          >
            <path
              fill="#581c87"
              d="M12 2a10 10 0 0 1 .324 19.995L12 22l-.324-.005A10 10 0 0 1 12 2m.707 5.293a1 1 0 0 0-1.414 0l-4 4a1 1 0 0 0-.083.094l-.064.092l-.052.098l-.044.11l-.03.112l-.017.126L7 12l.004.09l.007.058l.025.118l.035.105l.054.113l.043.07l.071.095l.054.058l4 4l.094.083a1 1 0 0 0 1.32-1.497L10.415 13H16l.117-.007A1 1 0 0 0 16 11h-5.586l2.293-2.293l.083-.094a1 1 0 0 0-.083-1.32"
            />
          </svg>
        </IconButton>
      </div>
      {user?.friends.map((student, index) => (
        <section
          key={`${student.id}-s-${index}`}
          className="flex flex-col justify-center items-center mt-7"
        >
          <User name={student.name} description={student.email} />
          <div className="w-10/12">
            <FollowView
              withButtons={false}
              userSeguimiento={student}
              rechargeButton={true}
              handleReload={async () => handlerClick(student.email)}
            />
          </div>
        </section>
      ))}
    </div>
  );
};

export default UsersFollowView;
