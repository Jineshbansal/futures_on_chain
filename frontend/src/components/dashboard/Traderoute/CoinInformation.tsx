import React from "react";
import logo from "../../../assets/logo-white.svg";

const dexModule = import.meta.env.VITE_APP_DEX_MODULE_ADDRESS;
// let url = `https://fullnode.devnet.aptoslabs.com/v1/accounts/${dexModule}/events/${dexModule}::dummycastdefi::OrderBook/set_ltp_event?limit=${limit}`;
const options = { method: "GET", headers: { Accept: "application/json" } };

const CoinInformation = () => {
  return (
    <div className="flex flex-row px-8 items-center h-full w-full border-[0.5px] border-[#383C3F]">
        <div className="flex flex-row basis-1/6 items-center">
          <div className="basis-1/8">
            <img className="h-10" src={logo}></img>
          </div>
          <div className="px-2 font-bold basis-1/8">
            Sharky/APT
          </div>
        </div>
        <div className="flex flex-col basis-1/6 text-left">
          <div className="font-bold text-xl basis-1/8">
            51.2433
          </div>
          <div className="basis-1/8">
            Asset Price
          </div>
        </div>
        <div className="flex flex-col basis-1/6 text-left">
          <div className="font-bold text-xl basis-1/8">
            60.2433
          </div>
          <div className="basis-1/8">
            Futures Price
          </div>
        </div>
        <div className="flex flex-col basis-1/6 text-left">
          <div className="font-bold text-xl basis-1/8">
            60.2433
          </div>
          <div className="basis-1/8">
            Open Interest
          </div>
        </div>
        <div className="basis-1/6">04</div>
    </div>
  );
};

export default CoinInformation;
