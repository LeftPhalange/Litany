import React, { ReactElement } from 'react';

interface ButtonProps {
  text: string;
  icon?: ReactElement<unknown>,
  disabled: boolean,
  onClick: () => void
}

const Button: React.FC<ButtonProps> = ({ text, icon, disabled, onClick }) => {
  const none = () => { };
  return (
    <button onClick={disabled ? none : onClick} className={`flex flex-row ${disabled ? "disabled bg-neutral-800 text-neutral-400 hover:cursor-not-allowed" : "bg-neutral-800 hover:bg-neutral-700"} items-center space-x-1 rounded-xl w-fit py-1 px-4 mb-2`}>
      {icon}
      <span className="text-sm hidden sm:block">{text}</span>
    </button>
  );
};

export default Button;