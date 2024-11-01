import { useUserContext } from "@/context/user.context";
import FollowComponent from "./FollowComponent";


const FollowView = () => {
  const { user } = useUserContext()




  return (
     <div className="w-auto h-10 flex border-2 border-red-600">
      <h2>tula</h2>
      {user?.applications.map((app) => {
        return (
          <FollowComponent
          key={app.id}
          id={app.id}
          actions={app.actions}
          applicationDate={app.applicationDate}
          applicationLink={app.applicationLink}
          comments={app.comments}
          companyContact={app.companyContact}
          extraInterview={app.extraInterview}
          firstInterview={app.firstInterview}
          industry={app.industry}
          phoneScreen={app.phoneScreen}
          position={app.position}
          recruiterName={app.recruiterName}
          secondInterview={app.secondInterview}
          status={app.status}
          thirdInterview={app.thirdInterview}

          />
        )
      })}
     </div>
  )
}

export default FollowView;