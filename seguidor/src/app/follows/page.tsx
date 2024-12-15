import { useUserContext } from "@/context/user.context";
import Loader from "@/ui/loader/Loader";
import UsersFollowView from "@/ui/usersFollowView/UsersFollowView"


export default function Follow(){
  const {loading} = useUserContext()

  if (loading) return <Loader />;
  return (
    <div className="min-h-screen min-w-full">
      <UsersFollowView/>
    </div>
  )
}
