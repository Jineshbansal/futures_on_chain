import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { Provider, Network } from "aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

interface OrderWindowProps {
  tradeWindow: boolean;
  setTradeWindow: React.Dispatch<React.SetStateAction<boolean>>;
}

// function to execute order
const param = [
  "buyAtlimitorder",
  "sellAtlimitorder",
  "buyAtMarketorder",
  "sellAtMarketorder",
];

const OrderWindow: React.FC<OrderWindowProps> = ({
  tradeWindow,
  setTradeWindow: _setTradeWindow,
}) => {
  const [limit, setLimit] = useState(true);
  const [side, setSide] = useState("Buy");

  const [limitPrice, setLimitPrice] = useState(0.0);
  const [price, setPrice] = useState(0.0);
  const [size, setSize] = useState(0.0);

  const [leverage, setLeverage] = useState(1);

  const handleLeverage = (e) => {
    setLeverage(e.target.value);
  };

  const handleLimitPrice = (e) => {
    const inputValue = e.target.value;

    // Allow only positive numbers
    const isValid = /^\d*\.?\d*$/.test(inputValue);

    if (isValid) {
      setLimitPrice(inputValue);
      setSize(0.0);
      setPrice(0.0);
    }
  };

  const handleSize = (e) => {
    const inputValue = e.target.value;
    // Allow only positive numbers
    const isValid = /^\d*\.?\d*$/.test(inputValue);

    if (isValid) {
      setSize(inputValue);
      if (limit) {
        setPrice(limitPrice * inputValue);
      }
    } else {
      //Market ltd from reccent trades set price to ltd*size
    }
  };

  const handlePrice = (e) => {
    const inputValue = e.target.value;

    // Allow only positive numbers
    const isValid = /^\d*\.?\d*$/.test(inputValue);

    if (isValid) {
      setPrice(inputValue);
      if (limit) {
        let calcSize = (inputValue / limitPrice).toFixed(4);
        if (inputValue == 0) {
          setSize(0.0);
        } else {
          setSize(calcSize);
        }
      } else {
        //Market ltd from recent trades set size to price/recenttrades
      }
    }
  };

  const handleLimitOrder = () => {
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

  const handleMarketOrder = () => {
    console.log("Hi!");
  };

  const provider = new Provider(Network.DEVNET);
  const { account } = useWallet();

  const executeOrder = async (leverage, size, price, ind) => {
    size = parseFloat(size);
    let args = [leverage, size, price];
    if (ind == 2 || ind == 3) args = [leverage, size];

    if (!account) return [];
    const moduleAddress = import.meta.env.VITE_APP_MODULE_ADDRESS;

    // console.log(leverage, parseFloat(size), price);
    const payload = {
      type: "entry_function_payload",
      function: `${moduleAddress}::Orderbook::${param[ind]}`,
      type_arguments: [],
      arguments: args,
    };
    try {
      const response = await (window as any).aptos.signAndSubmitTransaction(
        payload
      );
      // // wait for transaction
      console.log(payload);
      await provider.waitForTransaction(response.hash);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        className={`relative flex flex-col justify-start items-center h-full w-full border-[0.5px] border-[#383C3F]`}
      >
        {tradeWindow && (
          <div className="flex justify-center items-center bg-translucent-top h-12 w-full">
            <button
              className="flex justify-between items-center h-full w-full px-10"
              onClick={() => {
                _setTradeWindow(false);
              }}
            >
              <div>Tap to close</div>
              <div>
                <FaAngleDown size={20} />
              </div>
            </button>
          </div>
        )}
        <div
          className={`flex justify-center items-center h-12 w-full ${
            tradeWindow ? "mt-5" : ""
          }`}
        >
          <button
            className={`flex justify-center items-center w-[50%] h-full border-b-[0.5px] border-[#383C3F]
            ${tradeWindow ? "border-t-[0.5px]" : ""}
            ${limit ? "bg-[#061323]" : ""}`}
            onClick={() => {
              setLimit(true);
              setSide("Buy");
              setLimitPrice(0);
              setPrice(0);
              setSize(0);
              setLeverage(1);
            }}
          >
            Limit
          </button>
          <button
            className={`flex justify-center items-center w-[50%] h-full border-b-[0.5px] border-[#383C3F] 
            ${tradeWindow ? "border-t-[0.5px]" : ""}
            ${!limit ? "bg-[#061323]" : ""}`}
            onClick={() => {
              setLimit(false);
              setSide("Buy");
              setLimitPrice(0);
              setPrice(0);
              setSize(0);
              setLeverage(1);
            }}
          >
            Market
          </button>
        </div>
        <div className="flex justify-center items-center h-full w-full">
          {limit ? (
            <form className="flex flex-col justify-between items-center  h-full w-full">
              <div className="flex flex-col justify-between items-center pt-3 gap-5 w-full">
                <div className="flex justify-center items-center h-10 w-[60%] bg-[#FFFFFF] bg-opacity-[8%] rounded-xl">
                  <div
                    className={`flex justify-center items-center w-[50%] h-full rounded-xl ${
                      side == "Buy"
                        ? "border border-green-500 text-green-500 bg-[#122337]"
                        : "text-[#eaf0f6] text-opacity-[60%]"
                    }`}
                    onClick={() => {
                      setSide("Buy");
                      setLimitPrice(0);
                      setPrice(0);
                      setSize(0);
                      setLeverage(1);
                    }}
                  >
                    Buy
                  </div>
                  <div
                    className={`flex justify-center items-center w-[50%] h-full rounded-xl ${
                      side === "Sell"
                        ? "border border-red-500 text-red-500 bg-[#122337]"
                        : "text-[#eaf0f6] text-opacity-[60%]"
                    }`}
                    onClick={() => {
                      setSide("Sell");
                      setLimitPrice(0);
                      setPrice(0);
                      setSize(0);
                      setLeverage(1);
                    }}
                  >
                    Sell
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center w-[60%] gap-7">
                  <div className="flex justify-center items-start w-full gap-2 h-8 rounded-xl">
                    <div className="flex flex-col justify-center items-start w-full h-full rounded-xl">
                      <div className="w-full h-full bg-[#FFFFFF] bg-opacity-[8%]  px-2 pt-1 rounded-t-xl text-[#eaf0f6] text-opacity-[60%]">
                        Limit Price
                      </div>
                      <input
                        className="w-full h-full px-2 pb-1 appearance-none focus:outline-none bg-[#FFFFFF] bg-opacity-[8%] rounded-b-xl"
                        placeholder="0.00"
                        type="text"
                        value={limitPrice ? limitPrice : ""}
                        onChange={handleLimitPrice}
                      ></input>
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-2">
                    <div className="flex justify-center items-start w-full gap-2 h-8 rounded-xl">
                      <div className="flex flex-col justify-center items-start w-full h-full rounded-xl">
                        <div className="w-full h-full bg-[#FFFFFF] bg-opacity-[8%]  px-2 pt-1 rounded-t-xl text-[#eaf0f6] text-opacity-[60%]">
                          Size
                        </div>
                        <input
                          className="w-full h-full px-2 pb-1 appearance-none focus:outline-none bg-[#FFFFFF] bg-opacity-[8%] rounded-b-xl"
                          placeholder="0.00"
                          type="text"
                          value={size ? size : ""}
                          onChange={handleSize}
                        ></input>
                      </div>
                    </div>
                    <div className="flex justify-center items-start w-full gap-2 h-8 rounded-xl">
                      <div className="flex flex-col justify-center items-start w-full h-full rounded-xl">
                        <div className="w-full h-full bg-[#FFFFFF] bg-opacity-[8%]  px-2 pt-1 rounded-t-xl text-[#eaf0f6] text-opacity-[60%]">
                          Price
                        </div>
                        <input
                          className="w-full h-full px-2 pb-1 appearance-none focus:outline-none bg-[#FFFFFF] bg-opacity-[8%] rounded-b-xl"
                          placeholder="0.00"
                          type="text"
                          value={price ? price : ""}
                          onChange={handlePrice}
                        ></input>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center w-[60%]">
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
              </div>
              <div className="absolute bottom-0 flex flex-col justify-center items-center gap-3 w-[80%]">
                <div className="w-[70%] text-xs">
                  <div className="flex justify-between items-center">
                    <div>Expected Price</div>
                    <div>-</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>Marigin</div>
                    <div>-</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>Fee</div>
                    <div>-</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>Total</div>
                    <div>-</div>
                  </div>
                </div>
                <div
                  className="flex justify-center items-center h-12 w-[80%] mb-3 bg-[#1068CE] rounded-lg hover:bg-white hover:border hover:text-[#1068CE] border-[#1068CE]"
                  onClick={
                    side === "Buy"
                      ? () => {
                          executeOrder(leverage, size, limitPrice, 0);
                        }
                      : () => {
                          executeOrder(leverage, size, limitPrice, 1);
                        }
                  }
                >
                  Place Order
                </div>
              </div>
            </form>
          ) : (
            <form className="flex flex-col justify-between items-center  h-full w-full">
              <div className="flex flex-col justify-between items-center pt-3 gap-5 w-full">
                <div className="flex justify-center items-center h-10 w-[60%] bg-[#FFFFFF] bg-opacity-[8%] rounded-xl">
                  <div
                    className={`flex justify-center items-center w-[50%] h-full rounded-xl ${
                      side == "Buy"
                        ? "border border-green-500 text-green-500 bg-[#122337]"
                        : "text-[#eaf0f6] text-opacity-[60%]"
                    }`}
                    onClick={() => {
                      setSide("Buy");
                      setLimitPrice(0);
                      setPrice(0);
                      setSize(0);
                      setLeverage(1);
                    }}
                  >
                    Buy
                  </div>
                  <div
                    className={`flex justify-center items-center w-[50%] h-full rounded-xl ${
                      side === "Sell"
                        ? "border border-red-500 text-red-500 bg-[#122337]"
                        : "text-[#eaf0f6] text-opacity-[60%]"
                    }`}
                    onClick={() => {
                      setSide("Sell");
                      setLimitPrice(0);
                      setPrice(0);
                      setSize(0);
                      setLeverage(1);
                    }}
                  >
                    Sell
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center w-[60%] gap-7">
                  <div className="flex justify-center items-start w-full gap-2 h-8 rounded-xl">
                    <div className="flex flex-col justify-center items-start w-full h-full rounded-xl">
                      <div className="w-full h-full bg-[#FFFFFF] bg-opacity-[8%]  px-2 pt-1 rounded-t-xl text-[#eaf0f6] text-opacity-[60%]">
                        Size
                      </div>
                      <input
                        className="w-full h-full px-2 pb-1 appearance-none focus:outline-none bg-[#FFFFFF] bg-opacity-[8%] rounded-b-xl"
                        placeholder="0.00"
                        type="text"
                        value={size ? size : ""}
                        onChange={handleSize}
                      ></input>
                    </div>
                  </div>
                  <div className="flex justify-center items-start w-full gap-2 h-8 rounded-xl">
                    <div className="flex flex-col justify-center items-start w-full h-full rounded-xl">
                      <div className="w-full h-full bg-[#FFFFFF] bg-opacity-[8%]  px-2 pt-1 rounded-t-xl text-[#eaf0f6] text-opacity-[60%]">
                        Price
                      </div>
                      <input
                        className="w-full h-full px-2 pb-1 appearance-none focus:outline-none bg-[#FFFFFF] bg-opacity-[8%] rounded-b-xl"
                        placeholder="0.00"
                        type="text"
                        value={price ? price : ""}
                        onChange={handlePrice}
                      ></input>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center w-[60%]">
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
              </div>
              <div className="flex flex-col justify-center items-center gap-3 w-[80%]">
                <div className="w-[70%] text-xs">
                  <div className="flex justify-between items-center">
                    <div>Expected Price</div>
                    <div>-</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>Marigin</div>
                    <div>-</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>Fee</div>
                    <div>-</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>Total</div>
                    <div>-</div>
                  </div>
                </div>
                <div
                  className="flex justify-center items-center h-12 w-[80%] mb-3 bg-[#1068CE] rounded-lg hover:bg-white hover:border hover:text-[#1068CE] border-[#1068CE]"
                  onClick={
                    side === "Buy"
                      ? () => {
                          executeOrder(leverage, size, price, 2);
                        }
                      : () => {
                          executeOrder(leverage, size, price, 3);
                        }
                  }
                >
                  Place Order
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderWindow;
