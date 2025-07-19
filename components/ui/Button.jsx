import React from "react";

const Button = (props) => {
  const { children, type = "button" } = props;

  return (
    <button type={type} className="w-full h-12 bg-primary rounded-md text-white cursor-pointer hover:bg-primary/90 transition duration-200 flex justify-center pt-3">
      {children}
    </button>
  );
};

export default Button;
