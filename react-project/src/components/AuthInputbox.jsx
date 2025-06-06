import React from "react";
import "./App.css";

const AuthInputbox = ({
  type,
  placeholder,
  value,
  onChange,
  hasError = false,
}) => {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`border-[0.5px] rounded-[22px] w-[300px] m-4 shadow-md p-4 ${
          hasError ? "border border-red-500" : ""
        }`}
      />
    </div>
  );
};

export default AuthInputbox;
