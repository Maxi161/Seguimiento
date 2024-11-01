"use client"
import { useUserContext } from "@/context/user.context";
import FollowView from "@/ui/follow/FollowView";
import Header from "@/ui/header/Header";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const Home = () => {
  
  const router = useRouter()
    const {user, loading, isLogged} = useUserContext()

  useEffect(() => {
    if (!loading && !isLogged) {
      router.push("/auth");
    }
  }, [isLogged, loading, router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="relative h-full w-full z-10 flex flex-col min-h-screen">
      <Header />
      <main>
        <h1 className="text-5xl">¡Hola {user?.name}!</h1>
        <FollowView />
      </main>
    </div>
  );
}
export default Home