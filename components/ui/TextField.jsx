import React from "react";
import classNames from "classnames";

const TextField = (props) => {
  const { error, type = "text" } = props;
  return (
    <input
      type={type}
      autoComplete="off"
      {...props}
      className={classNames(
        `border w-full h-12  rounded-md focus:outline-none px-2 transition duration-300 disabled:bg-gray-100`,
        error ? "border-error focus:border-error" : "border-gray-300 focus:border-primary"
      )}
    />
  );
};

export default TextField;
