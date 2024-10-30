interface InputFieldProps {
    label: string;
    type: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    className?: string
  }
  
  const InputField = ({ label, type, name, value, onChange, error, className }: InputFieldProps) => {
    return (
      <div className="mb-4">
      <label htmlFor={name}>{label}:</label>
      <input
        className={`w-full bg-gray-900 focus:outline-none ${className}`}
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
      />
      {error && <p className="text-red-700">{error}</p>}
    </div>
  )
  };

  export default InputField