import classNames from "classnames";
import React from "react";

const Button = ({ children, color = "primary", size = "md", type = "button", className, ...props }) => {
  // const { children, type = "button", color = "primary", className, width = "full" } = props;

  const colorMap = {
    primary: "bg-primary hover:bg-primary/90 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    success: "bg-green-500 hover:bg-green-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-black",
    white: "bg-white hover:bg-gray-100 text-black",
  };

  const sizeMap = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  return (
    // <button type={type} className={classNames(className, `w-${width} h-12 bg-${color} rounded-md text-white cursor-pointer hover:bg-${color}/90 transition duration-200 flex justify-center pt-3`)}>
    //   {children}
    // </button>
    <button type={type} className={classNames("rounded h-12 font-semibold focus:outline-none transition-all duration-300 cursor-pointer", colorMap[color], sizeMap[size], className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
