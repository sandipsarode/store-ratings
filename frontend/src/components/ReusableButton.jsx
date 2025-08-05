// components/ReusableButton.jsx
import React from "react";

const ReusableButton = ({ children, onClick }) => {
  return (
    <div
      className="rainbow relative z-0 bg-white/15 overflow-hidden p-0.5 flex items-center justify-center rounded-full hover:scale-105 transition duration-300 active:scale-100 cursor-pointer"
      onClick={onClick}
    >
      <button className="px-6 py-2 text-sm text-white rounded-full font-medium bg-gray-900/80 backdrop-blur focus:outline-none">
        {children}
      </button>
    </div>
  );
};

export default ReusableButton;
