import React from "react";

const AuthInputBox = ({
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
        className={`border-[2px] rounded-[22px] w-[300px] m-4 shadow-md p-4 box-border ${
          hasError ? "border-red-500" : "border-white"
        }`}
      />
    </div>
  );
};

export default AuthInputBox;
