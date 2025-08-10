import React from "react";

const SectionThree: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="flex justify-center items-center gap-10 py-10">
        <div className="flex flex-col justify-center items-center gap-1">
          <h1 className="text-white text-5xl font-semibold">45M+</h1>
          <p className="text-[#FFFFFF] text-opacity-[70%]">User Worldwide</p>
        </div>
        <div className="flex flex-col justify-center items-center gap-1">
          <h1 className="text-white text-5xl font-semibold">120</h1>
          <p className="text-[#FFFFFF] text-opacity-[70%]">Counter Supported</p>
        </div>
        <div className="flex flex-col justify-center items-center gap-1">
          <h1 className="text-white text-5xl font-semibold">73M+</h1>
          <p className="text-[#FFFFFF] text-opacity-[70%]">
            Crypto Transaction
          </p>
        </div>
        <div className="flex flex-col justify-center items-center gap-1">
          <h1 className="text-white text-5xl font-semibold">$470B</h1>
          <p className="text-[#FFFFFF] text-opacity-[70%]">
            Assets on Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default SectionThree;
