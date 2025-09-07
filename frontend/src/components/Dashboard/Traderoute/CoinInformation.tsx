import React from "react";
import logo from "../../../assets/logo-white.svg";
import { useEffect, useState } from "react";
import { MdArrowDropDown } from "react-icons/md";
import { MdArrowDropUp } from "react-icons/md";

interface Data {
  value: number;
  time: number;
}

const CoinInformation = ({assetLtp, futuresLtp}: {charLtp: Data, futuresLtp: Data}) => {
  
  const  [prev, setPrev] = useState(0);
  const [color, setColor] = useState(0);
  const colors = ["white", "red", "green"];

  const symbols = ['', <MdArrowDropDown className="text-red-500"/>,  <MdArrowDropUp className="text-green-500"/>];

  useEffect(() => {
    console.log(assetLtp, futuresLtp, "from info");
    if(assetLtp?.value>prev) setColor(2);
    else if(assetLtp?.value<prev) setColor(1);
    else setColor(0);
    console.log("ltp changed", prev, assetLtp, color)
    setPrev(assetLtp?.value);
  }, [assetLtp])

  return (
    <div className="flex flex-row px-8 items-center h-full w-full border-[0.5px] border-[#383C3F]">
      <div className="flex justify-start item-center w-full h-full">
        <div className="flex flex-row justify-start item-center basis-1/6 items-center">
          <div className="basis-1/8">
            <img className="h-10" src={logo}></img>
          </div>
          <div className="px-2 font-bold basis-1/8">
            Sharky/APT
          </div>
        </div>
        <div className="flex flex-col justify-center item-center basis-1/6 text-left">
          <div className="flex">
            <div className="w-4">
                {symbols[color]}
            </div>
            <div>
              <div className={`font-bold text-xl basis-1/8 text-${colors[color]}-500`}>
                {assetLtp?.value}
              </div>
              <div className="basis-1/8">
                Asset Price
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center item-center basis-1/6 text-left">
        <div className="flex">
            <div className="w-4">
                {symbols[color]}
            </div>
            <div>
              <div className={`font-bold text-xl basis-1/8 text-${colors[color]}-500`}>
                {futuresLtp?.value.toFixed(4)}
              </div>
              <div className="basis-1/8">
                Futures Price
              </div>
            </div>
          </div>
        </div>
        </div>
    </div>
  );
};

export default CoinInformation;
