import React, { useState, useMemo } from 'react';
import { IUser } from "@/interfaces/user.interfaces";
import { Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, User } from "@nextui-org/react";
import ButtonConnection from '../button/ButtonConnection';


const UserList = ({ users, header }: { users: IUser[]; header: boolean }) => {
  const [inputValue, setInputValue] = useState("");
  const [checkedStates, setCheckedStates] = useState<Record<string, boolean>>({}); // Usa string como clave

  // Filtrado de usuarios por el nombre
  const usersFiltered = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [users, inputValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { value } = e.target;
    setInputValue(value);
  };

  const handleClick = (userId: string) => {
    console.log("entré")
    console.log(checkedStates)
    setCheckedStates((prev) => ({
      ...prev,
      [userId]: !prev[userId], // Usa el ID del usuario para actualizar su estado
    }));
    console.log("botón funcionando", userId);
  };

  const columns = [
    { key: "users", label: "Usuarios" },
    { key: "role", label: "Rol" },
    { key: "button", label: "" }, // Columna para el botón
  ];

  const renderCell = (user: IUser, columnKey: unknown) => {
    switch (columnKey) {
      case "users":
        return <User name={user.name} description={user.email} />;
      case "role":
        return user.role;
      case "button":
        return (
          <div className="relative">
            <Tooltip content="Conectar" className="bg-inherit">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <ButtonConnection
                  handlerClick={() => handleClick(user.id)} // Pasa el ID del usuario
                  isChecked={checkedStates[user.id] || false} // Utiliza el estado individual del usuario
                />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return null;
    }
  };

  const classNames = useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: ["text-nowrap", "z-[400]"],
    }),
    []
  );

  return (
    <section className="w-8/12 h-auto flex justify-center flex-col items-center m-12">
      <Input value={inputValue} onChange={handleChange} placeholder="Buscar usuarios..." />

      <Table hideHeader={!header} removeWrapper aria-label="Usuarios" classNames={classNames}>
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody emptyContent={"Aún sin usuarios :C"} items={usersFiltered}>
          {(user) => (
            <TableRow key={user.id}>
              {(columnKey) => (
                <TableCell key={columnKey}>
                  {renderCell(user, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
};

export default UserList;