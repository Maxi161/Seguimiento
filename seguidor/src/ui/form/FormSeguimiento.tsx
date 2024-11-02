import { IApplication } from "@/interfaces/seguimiento.interface";
import React, { useState } from "react";
import InputField from "./FieldForForm";
import { IApplicationFormErrors } from "@/interfaces/form.interfaces";
import { AnimatePresence, motion } from "framer-motion";
import { useUserContext } from "@/context/user.context";

// Estado inicial del formulario
const initialApplicationState: IApplication = {
  status: "",
  position: "",
  actions: "",
  comments: "",
  applicationDate: undefined,
  recruiterName: "",
  companyContact: "",
  industry: "",
  applicationLink: "",
  phoneScreen: undefined,
  firstInterview: undefined,
  secondInterview: undefined,
  thirdInterview: undefined,
  extraInterview: undefined,
  userId: "",
};

type ApplicationKeys = keyof IApplication;

const ApplicationForm = ({ toggleView }: { toggleView: () => void}) => {
  const {saveApplication} = useUserContext();
  const [applicationData, setApplicationData] = useState<IApplication>(initialApplicationState);
  const [errors, setErrors] = useState<IApplicationFormErrors>({});
  const [currentIndex, setCurrentIndex] = useState(0); // Índice del campo actual

  const inputFields = [
    { label: "Estado de Postulación", name: "status", type: "text" },
    { label: "Posición", name: "position", type: "text" },
    { label: "Fecha de Postulación", name: "applicationDate", type: "date" },
    { label: "Plataforma", name: "companyContact", type: "text" },
    { label: "Link de Postulación", name: "applicationLink", type: "url" },
    { label: "Nombre del Reclutador", name: "recruiterName", type: "text" },
    { label: "Rubro de la Empresa", name: "industry", type: "text" },
    { label: "Filtro Telefónico", name: "phoneScreen", type: "date" },
    { label: "Primera Entrevista", name: "firstInterview", type: "date" },
    { label: "Segunda Entrevista", name: "secondInterview", type: "date" },
    { label: "Tercera Entrevista", name: "thirdInterview", type: "date" },
    { label: "Entrevista Extra", name: "extraInterview", type: "date" },
    { label: "Acciones Tomadas", name: "actions", type: "text" },
    { label: "Comentarios", name: "comments", type: "text" },
    { label: "Contacto de la compañía", name: "companyContact", type: "text" }
  ];

    // Función para manejar los cambios en los campos
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target as { name: ApplicationKeys; value: string }; // Especifica el tipo para name
      setApplicationData((prevData) => ({
          ...prevData,
          [name]: value,
      }));
  };

  const handleNext = () => {
    if (currentIndex < inputFields.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const validateForm = (): IApplicationFormErrors => {
    const newErrors: IApplicationFormErrors = {};
    const currentField = inputFields[currentIndex];
    if (!applicationData[currentField.name as ApplicationKeys]?.toString().trim() && currentField.type !== "date" ) {
      newErrors[currentField.name as ApplicationKeys] = `${currentField.label} es obligatorio.`;
    }

    return newErrors;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      // Si es el último campo, puedes manejar el envío del formulario
      if (currentIndex === inputFields.length - 1) {
        console.log("Form data:", applicationData);
        await saveApplication(applicationData as IApplication)
      } else {
        handleNext(); // Avanzar al siguiente campo
      }
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: {duration: .3}},
    exit: {opacity: 0, x: -100, transition: {duration: .3}}
  }

  return (
    <motion.section
      key="formApplications"
      className="flex flex-col items-center w-full mt-12"
    >
      <form onSubmit={handleSubmit} className="relative h-32 flex flex-col w-full lg:w-6/12 gap-3 justify-center">
      <button className="absolute -rotate-90 -top-8 left-0 text-3xl rounded-full hover:rotate-0 hover:text-red-600 transition-all" onClick={toggleView} type="button">{"<"}</button>
        <AnimatePresence mode="wait">
          <InputField
            variants={inputVariants}
            label={inputFields[currentIndex].label}
            type={inputFields[currentIndex].type}
            name={inputFields[currentIndex].name}
            value={applicationData[inputFields[currentIndex].name as ApplicationKeys] || ""}
            onChange={handleChange}
            error={errors[inputFields[currentIndex].name as ApplicationKeys]}
            key={inputFields[currentIndex].name}
          />
        </AnimatePresence>

        <div className="flex relative justify-between w-full h-1/3">
          {currentIndex > 0 && (
            <button type="button" onClick={handlePrev} className="bg-gray-500 text-white px-4 py-2 rounded absolute bottom-0 left-0">Anterior</button>
          )}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded absolute bottom-0 right-0">
            {currentIndex === inputFields.length - 1 ? "Guardar" : "Siguiente"}
          </button>
        </div>
      </form>
    </motion.section>
  );
};

export default ApplicationForm;
