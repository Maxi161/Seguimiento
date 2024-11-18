import { useUserContext } from "@/context/user.context"; 
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
import React from "react";

const FollowView = ({ toggleView }: { toggleView: () => void}) => {
  const { user, downloadData } = useUserContext();
  const appsAmount: number = user?.applications.length as number;
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 4;

  const pages = Math.ceil(appsAmount / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return user?.applications.slice(start, end) || [];
  }, [page, user?.applications]);

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

  const downloadHandler = async () => {
    try {
      await downloadData();
    } catch (error) {
      console.log(error);
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
                {columns.map((column) => (
                  <TableCell key={`${column.key}-${index}`}>{getKeyValue(item, column.key)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      <div className="flex justify-center items-center m-5 relative">
        <button 
          type="button" 
          onClick={downloadHandler} 
          className="bg-teal-700 text-white px-4 py-2 rounded absolute bottom-0 left-0"
        >
          Descargar
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
        <button 
          onClick={toggleView} 
          type="button" 
          className="bg-purple-900 text-white px-4 py-2 rounded absolute bottom-0 right-0"
        >
          Subir
        </button>
      </div>
    </>
  );
};

export default FollowView;
