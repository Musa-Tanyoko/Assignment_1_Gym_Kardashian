// src/components/button.tsx
import { forwardRef } from "react";
import { jsx } from "react/jsx-runtime";
var Button = forwardRef(
  ({ children, className = "", onClick, type = "button", variant = "primary" }, ref) => {
    const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors";
    const variantClasses = {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "bg-gray-600 text-white hover:bg-gray-700",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-50"
    };
    return /* @__PURE__ */ jsx(
      "button",
      {
        ref,
        className: `${baseClasses} ${variantClasses[variant]} ${className}`,
        onClick,
        type,
        children
      }
    );
  }
);
Button.displayName = "Button";
export {
  Button
};
