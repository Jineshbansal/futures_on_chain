import React from "react";
import Graph from "./Traderoute/Graph";
import CoinInformation from "./Traderoute/CoinInformation";
import Positions from "./Traderoute/Positions";
import OrderBook from "./Traderoute/OrderBook";
import RecentTrades from "./Traderoute/RecentTrades";
import OrderWindow from "./Traderoute/OrderWindow";
import MarginCalculator from "./Traderoute/MarginCalculator";

const Trade = () => {
  return (
    <div className="h-full bg-[#191E43]">
      <div className="grid grid-cols-12 grid-rows-6 h-full text-white text-opacity-[990%">
        <div className="col-start-1 col-end-9 row-start-1 row-end-2">
          <CoinInformation></CoinInformation>
        </div>
        <div className="col-start-1 col-end-9 row-start-2 row-end-5">
          <Graph></Graph>
        </div>
        <div className="col-start-1 col-end-9 row-start-5 row-end-7">
          <Positions></Positions>
        </div>
        <div className="col-start-9 col-end-11 row-start-1 row-end-4">
          <OrderBook></OrderBook>
        </div>
        <div className="col-start-9 col-end-11 row-start-4 row-end-7">
          <RecentTrades></RecentTrades>
        </div>
        <div className="col-start-11 col-end-13 row-start-1 row-end-4">
          <OrderWindow></OrderWindow>
        </div>
        <div className="col-start-11 col-end-13 row-start-4 row-end-7">
          <MarginCalculator></MarginCalculator>
        </div>
      </div>
    </div>
  );
};

export default Trade;
