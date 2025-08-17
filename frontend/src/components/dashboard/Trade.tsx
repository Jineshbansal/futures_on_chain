import { useState } from "react";
import Graph from "./Traderoute/Graph";
import CoinInformation from "./Traderoute/CoinInformation";
import OrderBook from "./Traderoute/OrderBook";
import RecentTrades from "./Traderoute/RecentTrades";
import OrderWindow from "./Traderoute/OrderWindow";
import AcountDetails from "./Traderoute/AccountDetails";
import OpenOrders from "./Traderoute/OpenOrders";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import Fills from "./Traderoute/Fills";

const Trade = () => {
  const [order, setOrder] = useState(true);
  const [fullScreen, setFullScreen] = useState(false);
  const [openOrder, setOpenOrder] = useState(true);

  return (
    <div className="h-full bg-[#122337] text-white text-opacity-[90%]">
      <div className="h-[8%]">
        <CoinInformation></CoinInformation>
      </div>
      <div className="grid grid-cols-12 grid-rows-6 h-[92%]">
        <div
          className={`col-start-1 col-end-8 ${
            !fullScreen ? "row-start-1 row-end-4" : "row-start-1 row-end-7"
          } h-full w-full`}
        >
          {!fullScreen &&
          <div
            className={`flex justify-center items-center h-[88%]
            w-full`}
          >
            <Graph ></Graph>
          </div>}
          {fullScreen && 
          <div
            className={`flex justify-center items-center h-[94%]
             w-full`}
          >
            <Graph ></Graph>
          </div>
        }
          
          <div
            className={`flex justify-between items-center ${
              !fullScreen ? "h-[12%]" : "h-[6%] border-b-[0.5px]"
            }  border-r-[0.5px] border-l-[0.5px] border-t-[0.5px] border-[#383C3F]`}
          >
            <div className="flex justify-center items-center h-full w-[30%] ">
              <button
                className={`flex justify-center items-center h-full w-full ${
                  openOrder ? "bg-[#061323] bg-opacity-[50%]" : ""
                }`}
                onClick={() => {
                  setOpenOrder(true);
                }}
              >
                Orders
              </button>
              <button
                className={`flex justify-center items-center h-full w-full border-r-[0.5px] border-[#383C3F] ${
                  !openOrder ? "bg-[#061323] bg-opacity-[50%]" : ""
                }`}
                onClick={() => {
                  setOpenOrder(false);
                }}
              >
                Fills
              </button>
            </div>
            <button
              className="h-full px-3"
              onClick={() => {
                setFullScreen(!fullScreen);
              }}
            >
              {!fullScreen ? (
                <FaAngleDown className="h-full" />
              ) : (
                <FaAngleUp className="h-full" />
              )}
            </button>
          </div>
        </div>
        {!fullScreen ? (
          <div className="col-start-1 col-end-8 row-start-4 row-end-7">
            {openOrder ? <OpenOrders></OpenOrders> : <Fills></Fills>}
          </div>
        ) : (
          <></>
        )}
        <div className="col-start-8 col-end-10 row-start-1 row-end-7">
          <div className="flex justify-center items-center h-[8%] w-full">
            <button
              className={`flex justify-center items-center w-[50%] h-full border-b-[0.5px] border-[#383C3F] ${
                order ? "bg-[#061323] bg-opacity-[50%]" : ""
              }`}
              onClick={() => {
                setOrder(true);
              }}
            >
              Order
            </button>

            <button
              className={`flex justify-center items-center w-[50%] h-full border-b-[0.5px] border-[#383C3F] ${
                !order ? "bg-[#061323] bg-opacity-[50%]" : ""
              }`}
              onClick={() => {
                setOrder(false);
              }}
            >
              Trade
            </button>
          </div>
          <div className="h-[92%]">
            {order ? <OrderBook></OrderBook> : <RecentTrades></RecentTrades>}
          </div>
        </div>
        <div className="col-start-10 col-end-13 row-start-1 row-end-3">
          <AcountDetails></AcountDetails>
        </div>
        <div className="col-start-10 col-end-13 row-start-3 row-end-7">
          <OrderWindow></OrderWindow>
        </div>
      </div>
    </div>
  );
};

export default Trade;
