"use client"
import React, { useState, useMemo } from 'react';
import { IUser } from "@/interfaces/user.interfaces";
import { Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, User } from "@nextui-org/react";
import ButtonConnection from '../button/ButtonConnection';
import { useUserContext } from '@/context/user.context';

const UserList = ({ users, header }: { users: IUser[]; header: boolean }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, sendConnection } = useUserContext();
  const [inputValue, setInputValue] = useState("");

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
          <Tooltip content="Conectar" className="bg-inherit">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <ButtonConnection userId={user.id} /> {/* Renderizando el botón */}
            </span>
          </Tooltip>
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
