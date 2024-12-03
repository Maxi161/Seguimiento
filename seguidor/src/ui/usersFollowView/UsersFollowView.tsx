"use client"
import { useUserContext } from "@/context/user.context"
import { User } from "@nextui-org/react"
import FollowView from "../follow/FollowView"
import { useEffect } from "react"


const UsersFollowView = () => {

  const { user, getApplications } = useUserContext()

  useEffect(() => {
    const getApplicationsAsync = async () => {
      user?.friends.map( async (friend) => {
        await getApplications(friend.email)
      })
    }
    getApplicationsAsync()
  }, [user?.friends])

  const handlerClick = async (email: string) => {
    await getApplications(email)
  }

  return (
    <div className="flex flex-col w-full h-auto">
      {user?.friends.map((student, index) => {
        return (
          <section key={`${student.id}-s-${index}`} className="flex flex-col justify-center items-center mt-7">
            <User name={student.name} description={student.email}/>
            <div className="w-10/12">
            <FollowView 
            withButtons={false} 
            applicationsData={student.applications} 
            rechargeButton={true}
            handleReload={() => handlerClick(student.email)}/>
            </div>
          </section>
        )
      })}
    </div>
  )
}

export default UsersFollowView