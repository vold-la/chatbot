import { ReactNode } from "react";

interface ButtonProps {
  handleClick: () => void;
  children: ReactNode;
  size: number;
}

const Button = ({ handleClick, children, size }: ButtonProps) => {
  return (
    <button
      style={{ height: size, width: size }}
      onClick={handleClick}
      className="flex items-center justify-center hover:bg-purple-500 hover:text-white rounded-full transition-all"
    >
      {children}
    </button>
  );
};

export default Button;
