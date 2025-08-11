import React from "react";
import fire from "./../../../assets/artifacts/62e275df6d0fc5b329129b81_fire.svg.svg";
import gift from "./../../../assets/artifacts/63011d2ad7739c0ae2d6a345_gift.svg.svg";
import corner from "./../../../assets/artifacts/63011f1a01baa4acd99a562a_corner.svg.svg";
import line from "./../../../assets/artifacts/63011f1ba65dd9532c03e563_line.svg.svg";
import reload from "./../../../assets/artifacts/Frame 7.svg";

let SectionOne: React.FC = () => {
  return (
    <div className="flex justify-center items-center font-inter py-7">
      <div className="w-[1240px] flex flex-col gap-7 justify-between items-center">
        <div className="font-bold text-center animate-text text-transparent text-[60px] bg-clip-text bg-gradient-to-r from-[#FFFFFF] to-slate-800">
          Decentralized Futures Trading Redefined for Investors.
        </div>
        <div className="flex justify-center items-center gap-5 text-white">
          <div className="flex justify-center items-center gap-1">
            <img src={line} className="h-6"></img>
            <p>Fast Trading</p>
          </div>
          <div className="flex justify-center items-center gap-1">
            <img src={corner} className="h-6"></img>
            <p>Secure & Reliable</p>
          </div>
          <div className="flex justify-center items-center gap-1">
            <img src={reload} className="h-6"></img>
            <p>Continuous Market Updates</p>
          </div>
        </div>
        <div className="flex justify-center items-center gap-5 text-white">
          <button className="bg-[#1068CE] px-4 py-3 rounded-full">
            <div className="flex justify-center items-center gap-1">
              <img src={fire} className="h-6"></img>
              <p>Start Trading</p>
            </div>
          </button>
          <button className="bg-[#FFFFFF] px-4 py-3 rounded-full bg-opacity-[4%] drop-shadow-lg shadow-inner">
            <div className="flex justify-center items-center gap-1">
              <img src={gift} className="h-6"></img>
              <p>Connect Wallet</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionOne;
