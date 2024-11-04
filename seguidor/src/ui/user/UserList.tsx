import { IUser } from "@/interfaces/user.interfaces";
import { Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, User } from "@nextui-org/react";
import { useMemo, useState } from "react";

const UserList = ({users}: {users: IUser[]}) => {

  const [inputValue, setInputValue] = useState("")

  const usersFiltered = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [users, inputValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const {value} = e.target;
    setInputValue(value)
  }

  const columns = [
    {key: "users", label: "Usuarios"},
    {key: "role", label: "Rol"}

  ]
  
  const renderCell = (user: IUser, columnKey: unknown) => {
    switch (columnKey) {
      case "users":
        return <User name={user.name} description={user.email} />;
      case "role":
        return user.role;
      default:
        return null;
    }
  };
  

  const classNames = useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: ["text-nowrap"],
    }),
    [],
  );

  return (
    <section className="w-8/12 h-auto flex justify-center items-center m-12">
      <Input value={inputValue} onChange={handleChange}/>
    
      <Table removeWrapper aria-label="Usuarios" classNames={classNames}>
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody emptyContent={"Aún sin usuarios :C"} items={usersFiltered}>
          {(user) => (
            <TableRow key={user.id}>
              {(columnKey) => <TableCell>{renderCell(user, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
}
export default UserList;
