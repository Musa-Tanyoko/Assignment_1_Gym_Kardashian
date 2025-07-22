import * as react from 'react';

interface ButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "outline";
}
declare const Button: react.ForwardRefExoticComponent<ButtonProps & react.RefAttributes<HTMLButtonElement>>;

export { Button, type ButtonProps };
