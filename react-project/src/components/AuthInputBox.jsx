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
        className={`w-[400px] h-14 px-6 border-2 rounded-full text-base bg-white
    ${hasError ? "border-[#ff0000]" : "border-[#e0e0e0]"}
    shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] outline-none placeholder:text-[#bdbdbd]
    focus:outline-none focus:ring-0`}
      />
    </div>
  );
};

export default AuthInputBox;
