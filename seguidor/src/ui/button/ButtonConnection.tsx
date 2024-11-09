import IconButton from '@mui/material/IconButton';

interface ButtonConnectionProps {
  handlerClick: () => void;
  isChecked: boolean;
}

const ButtonConnection: React.FC<ButtonConnectionProps> = ({ handlerClick, isChecked }) => {
  return (
    <IconButton onClick={handlerClick} disabled={!isChecked} className="z-[8000]">
      {isChecked ? (
        // SVG "Check" cuando está activado
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path
            fill="#ffffff"
            fillRule="evenodd"
            d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18m-.232-5.36l5-6l-1.536-1.28l-4.3 5.159l-2.225-2.226l-1.414 1.414l3 3l.774.774z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        // SVG "X" cuando no está activado
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="#ffffff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 12h14M12 5v14"
          />
        </svg>
      )}
    </IconButton>
  );
};

export default ButtonConnection