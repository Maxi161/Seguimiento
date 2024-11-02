"use client"
import { useUserContext } from "@/context/user.context";
import FollowView from "@/ui/follow/FollowView";
import ApplicationForm from "@/ui/form/FormSeguimiento";
import Header from "@/ui/header/Header";
import InfoProject from "@/ui/info/Info.";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const Home = () => {
  
  const [formAppVisible, setFormAppVisible] = useState(false);
  const router = useRouter()
  const {user, loading, isLogged} = useUserContext()
  console.log(user);

  const toggleView = () => {
    setFormAppVisible((prevShowLogin) => !prevShowLogin);
  };

  useEffect(() => {
    if (!loading && !isLogged) {
      router.push("/auth");
    }
  }, [isLogged, loading, router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="relative h-full w-full z-10 min-h-screen">
      <Header />
      <main className="flex justify-center items-center flex-col">
        <section className="w-10/12 m-8 relative">
        {formAppVisible ? <ApplicationForm toggleView={toggleView}/> : <FollowView toggleView={toggleView} />}
        </section>
        <section>
          <InfoProject />
        </section>
      </main>
    </div>
  );
}
export default Home