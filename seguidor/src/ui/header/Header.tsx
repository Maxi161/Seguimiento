import MenuDrawer from "../dropdown/DropDown";

const Header = () => {

  return (
    <header className="bg-[rgb(14,14,14)] w-full h-16 relative flex justify-center items-center">
      <div className="absolute right-0 top-0 w-auto h-full flex justify-center items-center">
      <MenuDrawer />
      </div>
    </header>
  )
}

export default Header