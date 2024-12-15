"use client"

import React, { useState } from "react";

const EditableCell = ({ initialValue, onSave, typeCell }: { typeCell?: string; initialValue: string; onSave: (value: string) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue ?? undefined);

  const handleSave = () => {
    setIsEditing(false);
    onSave(value); // Llama a la función proporcionada para guardar el nuevo valor
  };

  return isEditing ? (
    <div className="flex items-center">
      {typeCell !== "date" ?
        <input
        type="text"
        className="border border-white px-2 py-1 w-[320px] rounded-lg bg-inherit"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
        onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />  
        : 
        <input
        type="date"
        className="border border-white px-2 py-1 w-auto rounded-lg bg-inherit"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
        onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
      }
    </div>
  ) : (
    <div className="flex items-center justify-between">
      <span>{value}</span>
      <button className="w-full h-full absolute p-3 text-blue-500" onDoubleClick={() => setIsEditing(true)}>
      </button>
    </div>
  );
};

export default EditableCell