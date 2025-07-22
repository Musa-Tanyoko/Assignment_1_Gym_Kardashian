import { forwardRef } from "react";

export interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = "", onClick, type = "button", variant = "primary" }, ref) => {
    const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors";
    const variantClasses = {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "bg-gray-600 text-white hover:bg-gray-700",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    };

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        onClick={onClick}
        type={type}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button"; 