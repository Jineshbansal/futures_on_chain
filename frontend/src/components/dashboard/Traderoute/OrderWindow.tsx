import React, { useState } from "react";

const OrderWindow = () => {
  const [limit, setLimit] = useState(true);
  const [side, setSide] = useState("Buy");

  const [limitPrice, setLimitPrice] = useState(0);
  const [price, setPrice] = useState(0);
  const [size, setSize] = useState(0);

  const [leverage, setLeverage] = useState(1);

  const handleLeverage = (e) => {
    setLeverage(e.target.value);
  };

  const marketPrice: Number = 1000;

  const handleLimitPrice = (e) => {
    const inputValue = e.target.value;

    // Allow only positive numbers
    const isValid = /^\d*\.?\d*$/.test(inputValue);

    if (isValid) {
      setLimitPrice(inputValue);
    }
  };

  const handleSize = (e) => {
    const inputValue = e.target.value;

    // Allow only positive numbers
    const isValid = /^\d*\.?\d*$/.test(inputValue);

    if (isValid) {
      setSize(inputValue);
    }
  };

  const handlePrice = (e) => {};

  const handleLimitPlaceOrder = () => {
    if (!limitPrice || !size || !price) {
      return;
    }

    console.log({
      orderType: "Limit",
      side,
      limitPrice,
      size,
    });
  };

  return (
    <div className="flex flex-col justify-start items-center h-full w-full border-[0.5px] border-[#383C3F]">
      <div className="flex justify-center items-center h-12 w-full">
        <button
          className={`flex justify-center items-center w-[50%] h-full border-b-[0.5px] border-[#383C3F] ${
            limit ? "bg-[#061323] bg-opacity-[50%]" : ""
          }`}
          onClick={() => {
            setLimit(true);
            setSide("Buy");
            setLimitPrice(0);
            setPrice(0);
            setSize(0);
            setLeverage(0);
          }}
        >
          Limit
        </button>
        <button
          className={`flex justify-center items-center w-[50%] h-full border-b-[0.5px] border-[#383C3F] ${
            !limit ? "bg-[#061323] bg-opacity-[50%]" : ""
          }`}
          onClick={() => {
            setLimit(false);
            setSide("Buy");
            setLimitPrice(0);
            setPrice(0);
            setSize(0);
            setLeverage(0);
          }}
        >
          Market
        </button>
      </div>
      <div className="flex justify-center items-center h-full w-full">
        {limit ? (
          <form className="flex flex-col justify-between items-center h-full w-full pt-5">
            <div className="flex justify-center items-center h-12 w-[80%] bg-[#FFFFFF] bg-opacity-[8%] rounded-xl">
              <div
                className={`flex justify-center items-center w-[50%] h-full rounded-xl ${
                  side == "Buy"
                    ? "border border-green-500 text-green-500 bg-[#122337]"
                    : ""
                }`}
                onClick={() => {
                  setSide("Buy");
                }}
              >
                Buy
              </div>
              <div
                className={`flex justify-center items-center w-[50%] h-full rounded-xl ${
                  side === "Sell"
                    ? "border border-red-500 text-red-500 bg-[#122337]"
                    : ""
                }`}
                onClick={() => {
                  setSide("Sell");
                }}
              >
                Sell
              </div>
            </div>
            <div className="flex flex-col justify-center items-start w-[80%] h-16 rounded-xl">
              <div className="w-full h-full bg-[#FFFFFF] bg-opacity-[8%] px-2 pt-2 rounded-t-xl">
                Limit Price
              </div>
              <input
                className="w-full h-full px-2 appearance-none focus:outline-none bg-[#FFFFFF] bg-opacity-[8%] rounded-b-xl text-xl pb-2"
                placeholder="0.00"
                type="text"
                value={limitPrice ? limitPrice : ""}
                onChange={handleLimitPrice}
              ></input>
            </div>
            <div className="flex justify-center items-start w-[80%] gap-2 h-16 rounded-xl">
              <div className="flex flex-col justify-center items-start w-[80%]  h-16 rounded-xl">
                <div className="w-full h-full bg-[#FFFFFF] bg-opacity-[8%]  px-2 pt-2 rounded-t-xl">
                  Size
                </div>
                <input
                  className="w-full h-full px-2 appearance-none focus:outline-none bg-[#FFFFFF] bg-opacity-[8%] rounded-b-xl text-xl pb-2"
                  placeholder="0.00"
                  type="text"
                  value={size ? size : ""}
                  onChange={handleSize}
                ></input>
              </div>
              <div className="flex flex-col justify-center items-start w-[80%] h-16 rounded-xl">
                <div className="w-full h-full bg-[#FFFFFF] bg-opacity-[8%] px-2 pt-2 rounded-t-xl">
                  Price
                </div>
                <input
                  className="w-full h-full px-2 appearance-none focus:outline-none bg-[#FFFFFF] bg-opacity-[8%] rounded-b-xl text-xl pb-2"
                  placeholder="0.00"
                  type="text"
                  value={price ? price : ""}
                  // onChange={handlePrice}
                ></input>
              </div>
            </div>
            <div className="flex items-center justify-center w-[80%]">
              <div className="flex flex-col gap-2 w-full">
                <label
                  htmlFor="leverage"
                  className="block text-sm font-medium text-[#FFFFFF] text-opacity-[70%]"
                >
                  Leverage: {leverage}x
                </label>
                <input
                  type="range"
                  id="leverage"
                  name="leverage"
                  min="1"
                  max="20"
                  step="1"
                  value={leverage}
                  onChange={handleLeverage}
                  className="block w-full bg-blue-200 appearance-none rounded-full h-3"
                />
              </div>
            </div>
            <div
              className="flex justify-center items-center h-12 w-[80%] mb-5 bg-[#1068CE] rounded-lg hover:bg-white hover:border hover:text-[#1068CE] border-[#1068CE]"
              onClick={handleLimitPlaceOrder}
            >
              Place Order
            </div>
          </form>
        ) : (
          <form className="flex flex-col justify-between items-center h-full w-full pt-5">
            <div className="flex justify-center items-center h-12 w-[80%] bg-[#FFFFFF] bg-opacity-[8%] rounded-xl">
              <div
                className={`flex justify-center items-center w-[50%] h-full rounded-xl ${
                  side == "Buy"
                    ? "border border-green-500 text-green-500 bg-[#122337]"
                    : ""
                }`}
                onClick={() => {
                  setSide("Buy");
                }}
              >
                Buy
              </div>
              <div
                className={`flex justify-center items-center w-[50%] h-full rounded-xl ${
                  side === "Sell"
                    ? "border border-red-500 text-red-500 bg-[#122337]"
                    : ""
                }`}
                onClick={() => {
                  setSide("Sell");
                }}
              >
                Sell
              </div>
            </div>

            <div className="flex justify-center items-start w-full gap-2 h-16 rounded-xl">
              <div className="flex flex-col justify-center items-start w-[80%]  h-16 rounded-xl">
                <div className="w-full h-full bg-[#FFFFFF] bg-opacity-[8%]  px-2 pt-2 rounded-t-xl">
                  Size
                </div>
                <input
                  className="w-full h-full px-2 appearance-none focus:outline-none bg-[#FFFFFF] bg-opacity-[8%] rounded-b-xl text-xl pb-2"
                  placeholder="0.00"
                  type="text"
                  value={size ? size : ""}
                  onChange={handleSize}
                ></input>
              </div>
            </div>
            <div className="flex justify-center items-start w-full gap-2 h-16 rounded-xl">
              <div className="flex flex-col justify-center items-start w-[80%] h-16 rounded-xl">
                <div className="w-full h-full bg-[#FFFFFF] bg-opacity-[8%] px-2 pt-2 rounded-t-xl">
                  Price
                </div>
                <input
                  className="w-full h-full px-2 appearance-none focus:outline-none bg-[#FFFFFF] bg-opacity-[8%] rounded-b-xl text-xl pb-2"
                  placeholder="0.00"
                  type="text"
                  value={price ? price : ""}
                ></input>
              </div>
            </div>
            <div className="flex items-center justify-center w-[80%]">
              <div className="flex flex-col gap-2 w-full">
                <label
                  htmlFor="leverage"
                  className="block text-sm font-medium text-[#FFFFFF] text-opacity-[70%]"
                >
                  Leverage: {leverage}x
                </label>
                <input
                  type="range"
                  id="leverage"
                  name="leverage"
                  min="1"
                  max="20"
                  step="1"
                  value={leverage}
                  onChange={handleLeverage}
                  className="block w-full bg-blue-200 appearance-none rounded-full h-3"
                />
              </div>
            </div>
            <div className="flex justify-center items-center h-12 w-[80%] mb-5 bg-[#1068CE] rounded-lg hover:bg-white hover:border hover:text-[#1068CE] border-[#1068CE]">
              Place Order
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default OrderWindow;
