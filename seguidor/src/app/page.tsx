"use client";
import { useUserContext } from "@/context/user.context";
import { IUser } from "@/interfaces/user.interfaces";
import FollowView from "@/ui/follow/FollowView";
import Footer from "@/ui/footer/Footer";
import ApplicationForm from "@/ui/form/FormSeguimiento";
import Header from "@/ui/header/Header";
import InfoProject from "@/ui/info/Info.";
import UserList from "@/ui/user/UserList";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [formAppVisible, setFormAppVisible] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [hasFetchedUsers, setHasFetchedUsers] = useState(false); // Estado para asegurarse de que getUsers se ejecute solo una vez
  const router = useRouter();
  const { getUsers, loading, isLogged } = useUserContext();

  const toggleView = () => {
    setFormAppVisible((prevShowLogin) => !prevShowLogin);
  };

  useEffect(() => {
    if (!loading && !isLogged) {
      router.push("/auth");
    }
  }, [isLogged, loading, router]);

  useEffect(() => {
    // Solo ejecutamos la función de getUsers si no se ha hecho antes
    if (!hasFetchedUsers && !loading && isLogged) {
      const saveUsers = async () => {
        const usersList = await getUsers();
        setUsers(usersList);
        setHasFetchedUsers(true); // Marca que ya se cargaron los usuarios
      };

      saveUsers();
    }
  }, [getUsers, isLogged, loading, hasFetchedUsers]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="relative h-full w-full z-10 min-h-screen">
      <Header />
      <main className="flex justify-center items-center flex-col">
        <section className="w-10/12 m-8 relative">
          {formAppVisible ? (
            <ApplicationForm toggleView={toggleView} />
          ) : (
            <FollowView toggleView={toggleView} />
          )}
        </section>
        <section>
          <InfoProject />
        </section>
        <UserList users={users} header={true} />
      </main>
      <Footer />
    </div>
  );
}
