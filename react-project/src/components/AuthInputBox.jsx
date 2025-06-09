import React from "react";

const AuthInputBox = ({
  type = "text",
  placeholder,
  value,
  onChange,
  hasError = false,
}) => {
  return (
    <div className="mb-4">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-[300px] h-14 px-6 border rounded-[16px] text-base bg-white shadow-sm
        ${hasError ? "border-[#ff0000]" : "border-[#ccc]"}
        placeholder:text-[#bdbdbd] focus:outline-none focus:ring-0`}
      />
    </div>
  );
};

export default AuthInputBox;
