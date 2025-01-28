import { ReactNode } from 'react';

interface ButtonProps {
  handleClick: () => void;
  children: ReactNode;
  size: number;
  'data-testid'?: string;
}

const Button = ({ handleClick, children, size, 'data-testid': testId }: ButtonProps) => {
  return (
    <button
      style={{ height: size, width: size }}
      onClick={handleClick}
      className="flex items-center justify-center hover:bg-purple-500 hover:text-white rounded-full transition-all"
      data-testid={testId}
    >
      {children}
    </button>
  );
};

export default Button;
