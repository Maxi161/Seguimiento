"use client";
import { useUserContext } from "@/context/user.context";
import { IUser } from "@/interfaces/user.interfaces";
import FollowView from "@/ui/follow/FollowView";
import Footer from "@/ui/footer/Footer";
import ApplicationForm from "@/ui/form/FormSeguimiento";
import Header from "@/ui/header/Header";
import InfoProject from "@/ui/info/Info.";
import Loader from "@/ui/loader/Loader";
import UserList from "@/ui/user/UserList";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [formAppVisible, setFormAppVisible] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const router = useRouter();
  const { getUsers, loading, isLogged, onProcess } = useUserContext();

  const toggleView = () => {
    setFormAppVisible((prevShowLogin) => !prevShowLogin);
  };

  useEffect(() => {
    if (!loading && !isLogged) {
      router.push("/auth");
    }
  }, [isLogged, loading, router]);

  useEffect(() => {
    // Verifica si ya se está cargando o si los usuarios ya están disponibles
    if (!loading && isLogged && users.length === 0 && !onProcess.getUsers) {
      const saveUsers = async () => {
        const usersList = await getUsers();
        setUsers(usersList);
      };
      saveUsers();
    }
  
    if (!loading && !isLogged) {
      router.push("/auth");
    }
  }, [getUsers, isLogged, loading, users.length, router, onProcess.getUsers]);

  if (loading) return <Loader />;

  return (
    <div className="relative h-full w-full z-10 min-h-screen">
      <Header />
      <main className="flex justify-center items-center flex-col">
        <section className="w-10/12 m-8 relative">
          {formAppVisible ? (
            <ApplicationForm toggleView={toggleView} />
          ) : (
            <FollowView toggleView={toggleView} withButtons={true}/>
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
