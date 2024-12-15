import { useUserContext } from "@/context/user.context"; 
import { IParsedApplication } from "@/interfaces/seguimiento.interface";
import { IUser } from "@/interfaces/user.interfaces";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Pagination,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import React, { useState } from "react";
import EditableCell from "./EditableCell";

const FollowView = ({ toggleView, withButtons, rechargeButton, handleReload, userSeguimiento}: { 
  toggleView?: () => void;
  withButtons?: boolean; 
  applicationsData?: IParsedApplication[];
  rechargeButton?: boolean;
  handleReload?: () => void;
  userSeguimiento?: Partial<IUser>
}) => {
  const [ downloadStates, setDownloadStates] = React.useState<Record<string, boolean>>({});
  const [ isReloading, setIsReloading ] = useState(false)
  const { user, downloadData, updateApp } = useUserContext();
  const appsAmount = React.useMemo(() => {
    if (Array.isArray(userSeguimiento?.applications)) {
      return userSeguimiento.applications.length;
    }
    return user?.applications?.length || 0;
  }, [userSeguimiento?.applications, user?.applications]);
  
  
  const applications = React.useMemo(() => {
    if (!userSeguimiento?.applications) {
      return user?.applications || [];
    } 
    return userSeguimiento.applications;
  }, [userSeguimiento?.applications, user?.applications]);
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 5;

  const pages = Math.ceil(appsAmount as number / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return applications.slice(start, end) || [];
  }, [page, applications]);

  const handlerSaveEdit = async (newApp: IParsedApplication, oldApp: IParsedApplication) => {
    console.log(newApp)
    console.log(oldApp)
    console.log(JSON.stringify(newApp) === JSON.stringify(oldApp))

    if (JSON.stringify(newApp) !== JSON.stringify(oldApp)) {
      const index = items.findIndex((app) => oldApp.id === app.id)
      if(index) items[index] = newApp
      await updateApp(newApp)
    }
  }

  const columns = [
    { key: "id", label: "ID" },
    { key: "company", label: "Company" },
    { key: "actions", label: "Actions" },
    { key: "position", label: "Position" },
    { key: "applicationDate", label: "Application Date" },
    { key: "applicationLink", label: "Application Link" },
    { key: "comments", label: "Comments" },
    { key: "companyContact", label: "Company Contact" },
    { key: "firstInterview", label: "1st Interview" },
    { key: "secondInterview", label: "2nd Interview" },
    { key: "thirdInterview", label: "3rd Interview" },
    { key: "extraInterview", label: "Extra Interview" },
    { key: "platform", label: "Platform" },
    { key: "phoneScreen", label: "Phone Screen" },
    { key: "industry", label: "Industry" },
    { key: "recruiterName", label: "Recruiter" },
    { key: "status", label: "Status" },
  ];

  const downloadHandler = async (email: string) => {
    setDownloadStates((prev) => ({ ...prev, [email]: true }));
    try {
      await downloadData(email);
    } catch (error) {
      console.error(error);
    } finally {
      setDownloadStates((prev) => ({ ...prev, [email]: false }));
    }
  };

  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: ["text-nowrap", "max-w-[320px]", "truncate"],
    }),
    [],
  );

  return (
    <>
      <motion.div className="overflow-auto border w-full h-auto border-gray-700">
        <Table removeWrapper aria-label="Registro de seguimiento laboral" classNames={classNames}>
          <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
          </TableHeader>
          <TableBody emptyContent="Ningún seguimiento para mostrar">
          {items.map((item, index) => (
  <TableRow key={`${item.id}-${index}`}>
    {columns.map((column) => {
      const isEditable = column.key !== "id"; // Ajusta las columnas editables
      const isDate = ["applicationDate", "firstInterview", "secondInterview", "thirdInterview", "extraInterview", "phoneScreen"].some((keyDate) => keyDate === column.key)
      return (
        <TableCell key={`${column.key}-${index}`}>
          {isEditable ? (
            <EditableCell
              initialValue={getKeyValue(item, column.key)}
              typeCell={isDate ? "date" : "string"}
              onSave={(newValue) => {
                handlerSaveEdit({...item, [column.key]: newValue}, item)
              }}
            />
          ) : (
            getKeyValue(item, column.key)
          )}
        </TableCell>
      );
    })}
  </TableRow>
))}

          </TableBody>
        </Table>
      </motion.div>

      <div className="flex justify-center items-center m-5 relative">
        <button 
          type="button" 
          onClick={() => downloadHandler(userSeguimiento?.email as string)}
          className={`${downloadStates[userSeguimiento?.email as string] ? "bg-teal-950 cursor-not-allowed" : "bg-teal-900"} text-white px-4 py-2 rounded absolute bottom-0 left-0 md:w-2/12 flex justify-center items-center`}
        >
          {downloadStates[userSeguimiento?.email as string] ? 
          <svg
           xmlns="http://www.w3.org/2000/svg" 
           width="25"
           height="25" 
           viewBox="0 0 24 24">
            <path 
            fill="white"
            d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" 
            opacity="0.5"/>
            <path 
            fill="white" 
            d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z">
              <animateTransform 
              attributeName="transform" 
              dur="1s" 
              from="0 12 12" 
              repeatCount="indefinite" 
              to="360 12 12" 
              type="rotate"/>
            </path>
          </svg>
          : "Descargar"}
        </button>
        <Pagination
          isCompact
          showControls
          showShadow
          color="secondary"
          page={page}
          total={pages}
          onChange={(page) => setPage(page)}
        />
        {withButtons ? <button 
          onClick={toggleView} 
          type="button" 
          className="bg-purple-900 text-white px-4 py-2 rounded absolute bottom-0 right-0"
        >
          Subir
        </button> : null}
        {rechargeButton ? (
  <button
    onClick={() => {
      setIsReloading(true);
      handleReload?.(); // Invoca el manejador proporcionado.
      setTimeout(() => setIsReloading(false), 1000); // Simula un estado de recarga.
    }}
    type="button"
    className={`${
      isReloading ? "bg-purple-950 cursor-not-allowed" : "bg-purple-900"
    } text-white px-4 py-2 rounded absolute bottom-0 right-0 flex items-center justify-center`}
    disabled={isReloading}
  >
    {isReloading ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 512 512"
        className="animate-spin"
      >
        <path
          fill="white"
          fillRule="evenodd"
          d="M298.667 213.333v-42.666l79.898-.003c-26.986-38.686-71.82-63.997-122.565-63.997c-82.475 0-149.333 66.858-149.333 149.333S173.525 405.333 256 405.333c76.201 0 139.072-57.074 148.195-130.807l42.342 5.292C434.807 374.618 353.974 448 256 448c-106.039 0-192-85.961-192-192S149.961 64 256 64c60.316 0 114.136 27.813 149.335 71.313L405.333 64H448v149.333z"
        />
      </svg>
    ) : (
      <>
        <span className="mr-2">Recargar</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 512 512"
        >
          <path
            fill="white"
            fillRule="evenodd"
            d="M298.667 213.333v-42.666l79.898-.003c-26.986-38.686-71.82-63.997-122.565-63.997c-82.475 0-149.333 66.858-149.333 149.333S173.525 405.333 256 405.333c76.201 0 139.072-57.074 148.195-130.807l42.342 5.292C434.807 374.618 353.974 448 256 448c-106.039 0-192-85.961-192-192S149.961 64 256 64c60.316 0 114.136 27.813 149.335 71.313L405.333 64H448v149.333z"
          />
        </svg>
      </>
    )}
  </button>
) : null}

      </div>
    </>
  );
};

export default FollowView;
