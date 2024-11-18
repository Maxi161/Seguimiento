import { ScaleLoader } from "react-spinners";


const Loader = () => {
  return (
    <div className="relative w-full z-10 flex flex-col justify-center items-center min-h-screen">
      <ScaleLoader
      color="#ffff"
      />
    </div>
  )
}

export default Loader;