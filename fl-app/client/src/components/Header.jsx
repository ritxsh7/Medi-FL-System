import React from "react";

const Header = () => {
  return (
    <header className="flex p-3 bg-[#1E2A47] text-white items-center gap-2 sticky top-0 z-50">
      <div className="flex text-3xl font-bold">
        <span className="text-[#3498db]">mediFl</span>
      </div>
      <div>
        <h1 className="text-md font-semibold text-[#ecf0f1] mt-2">
          A Federated Learning Architecture for Healthcare
        </h1>
      </div>
    </header>
  );
};

export default Header;
