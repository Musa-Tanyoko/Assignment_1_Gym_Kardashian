"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var index_exports = {};
__export(index_exports, {
  Button: () => Button
});
module.exports = __toCommonJS(index_exports);

// src/components/button.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var Button = (0, import_react.forwardRef)(
  ({ children, className = "", onClick, type = "button", variant = "primary" }, ref) => {
    const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors";
    const variantClasses = {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "bg-gray-600 text-white hover:bg-gray-700",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-50"
    };
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Button
});
