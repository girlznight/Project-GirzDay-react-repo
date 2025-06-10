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
        className={`w-[350px] h-16 px-6 border rounded-[16px] text-base bg-white shadow-[0_2px_8px_0_rgba(0,0,0,0.08)]
        ${hasError ? "border-[#ff0000]" : "border-[#fff]"}
        placeholder:text-[#bdbdbd] focus:outline-none focus:ring-0`}
      />
    </div>
  );
};

export default AuthInputBox;
