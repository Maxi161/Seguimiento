import { useUserContext } from "@/context/user.context"; 
import { IParsedApplication } from "@/interfaces/seguimiento.interface";
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

const FollowView = ({ toggleView, withButtons, rechargeButton, applicationsData, handleReload}: { 
  toggleView?: () => void;
  withButtons?: boolean; 
  applicationsData?: IParsedApplication[];
  rechargeButton?: boolean;
  handleReload?: () => void;
}) => {
  const { user, downloadData, onProcess } = useUserContext();
  const appsAmount = React.useMemo(() => {
    if (Array.isArray(applicationsData)) {
      return applicationsData.length;
    }
    return user?.applications?.length || 0;
  }, [applicationsData, user?.applications]);
  
  
  const applications = React.useMemo(() => {
    if (!applicationsData) {
      return user?.applications || [];
    } 
    return applicationsData;
  }, [applicationsData, user?.applications]);
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 5;

  const pages = Math.ceil(appsAmount as number / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return applications.slice(start, end) || [];
  }, [page, applications]);


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
          className="bg-teal-700 text-white px-4 py-2 rounded absolute bottom-0 left-0 md:w-2/12 flex justify-center items-center"
        >
          {onProcess.downloadApp ? 
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
        {rechargeButton ? <button 
          onClick={handleReload} 
          type="button" 
          className="bg-purple-900 text-white px-4 py-2 rounded absolute bottom-0 right-0"
        >
          <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="28" 
          height="28" 
          viewBox="0 0 512 512">
            <path 
            fill="white" 
            fillRule="evenodd" 
            d="M298.667 213.333v-42.666l79.898-.003c-26.986-38.686-71.82-63.997-122.565-63.997c-82.475 0-149.333 66.858-149.333 149.333S173.525 405.333 256 405.333c76.201 0 139.072-57.074 148.195-130.807l42.342 5.292C434.807 374.618 353.974 448 256 448c-106.039 0-192-85.961-192-192S149.961 64 256 64c60.316 0 114.136 27.813 149.335 71.313L405.333 64H448v149.333z"/>
          </svg>
        </ button>
          : null
        }
      </div>
    </>
  );
};

export default FollowView;
