import React from 'react';

interface ButtonTextProps {
  label?: string;
  icon?: React.ReactNode;
  onClick: () => void;
  selected?: boolean;
  className?: string;
  disabled?: boolean;
}

const ButtonText: React.FC<ButtonTextProps> = ({
  label,
  icon,
  onClick,
  selected,
  className,
  disabled = false,
}) => {
  const defaultClass = `inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-2xl font-semibold transition w-[12rem] h-[5rem] ${
    selected
      ? 'bg-green-100 text-black border-green-300'
      : 'bg-white text-gray-700 border-gray-300 hover:bg-green-200'
  } ${disabled ? 'cursor-not-allowed opacity-50 hover:bg-white' : ''}`;

  return (
    <button onClick={onClick} className={className ? className : defaultClass} disabled={disabled}>
      {icon && <span className="text-base">{icon}</span>}
      {label}
    </button>
  );
};

export default ButtonText;
