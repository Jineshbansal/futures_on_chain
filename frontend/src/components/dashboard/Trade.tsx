import { useState, useEffect } from "react";
import Graph from "./Traderoute/Graph";
import CoinInformation from "./Traderoute/CoinInformation";
import OrderBook from "./Traderoute/OrderBook";
import RecentTrades from "./Traderoute/RecentTrades";
import OrderWindow from "./Traderoute/OrderWindow";
import AcountDetails from "./Traderoute/AccountDetails";
import OpenOrders from "./Traderoute/OpenOrders";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import Filled from "./Traderoute/Filled";
import Positions from "./Traderoute/Positions";
import { Provider, Network } from "aptos";

interface Order {
  lvg: string;
  qty: string;
  stock_price: string;
  user_address: string;
  pos?: boolean;
  timestamp: string;
}

interface Depth {
  key: string;
  value: string;
}

const Trade = () => {
  const provider = new Provider(Network.DEVNET);

  const [ask, setAsk] = useState<Order[]>([]);
  const [bid, setBid] = useState<Order[]>([]);
  const [buyers, setBuyers] = useState<Order[]>([]);
  const [sellers, setSellers] = useState<Order[]>([]);
  const [ltp, setLtp] = useState<Order>();
  const [askDepth, setAskDepth] = useState<Depth[]>([]);
  const [bidDepth, setBidDepth] = useState<Depth[]>([]);
  const moduleAddress =
    "0xad0a42d57cf62e452cb0a672f426b85da806cdf51cddcb61a3ef33ce4ede67e2";

  const fetchList = async () => {
    try {
      const response = await provider.getAccountResource(
        moduleAddress,
        `${moduleAddress}::Orderbook::Resource`
      );
      console.log("response is:", response.data);
      const currAsk: Order[] = response.data.asks;
      const currBid: Order[] = response.data.bids;
      const currBuyers: Order[] = response.data.buyers;
      const currSellers: Order[] = response.data.sellers;
      const currAskMap: Depth[] = response.data.mktdpthseller.data;
      const currBidMap: Depth[] = response.data.mktdpthbuyer.data;
      const currAskMap1: Depth[] = [];
      const currBidMap1: Depth[] = [];
      for (let i = currBidMap.length-1; i >=0 ; i--) {
        if (currBidMap[i].value != "0") currBidMap1.push(currBidMap[i]);
      }
      for (let i = currAskMap.length-1; i >=0 ; i--) {
        if (currAskMap[i].value != "0") currAskMap1.push(currAskMap[i]);
      }

      setAsk(currAsk);
      setBid(currBid);
      setBuyers(currBuyers);
      setSellers(currSellers);
      setLtp(currBuyers.reverse()[0]);
      setAskDepth(currAskMap1);
      setBidDepth(currBidMap1);
      console.log(currAskMap1, currBidMap1, "aaja bhai");
      console.log(currAskMap, currBidMap, "aaja bhai 2");
    } catch (error) {
      console.log(error, "Error occurred!");
    }
  };

  useEffect(() => {
    fetchList();
    setInterval(() => {
      fetchList();
    }, 1000);
  }, []);

  const [order, setOrder] = useState(true);
  const [fullScreen, setFullScreen] = useState(false);
  const [portfolio, setPortfolio] = useState(1);
  const [tradeWindow, setTradeWindow] = useState(false);
  const [middleWindow, setMiddleWindow] = useState(1);
  const [bottomWindow, setBottomWindow] = useState(1);

  return (
    <>
      <div className="md:flex hidden justify-center items-center h-full bg-[#122337] text-white text-opacity-[90%]">
        <div className="h-full w-full">
          <div className="h-[8%]">
            <CoinInformation></CoinInformation>
          </div>
          <div className="grid grid-cols-12 grid-rows-6 h-[92%]">
            <div
              className={`col-start-1 col-end-8 ${
                !fullScreen ? "row-start-1 row-end-4" : "row-start-1 row-end-7"
              } h-full w-full`}
            >
              {!fullScreen && (
                <div
                  className={`flex justify-center items-center h-[88%]
            w-full`}
                >
                  <Graph></Graph>
                </div>
              )}
              {fullScreen && (
                <div
                  className={`flex justify-center items-center h-[94%]
             w-full`}
                >
                  <Graph></Graph>
                </div>
              )}

              <div
                className={`flex justify-between items-center ${
                  !fullScreen ? "h-[12%]" : "h-[6%] border-b-[0.5px]"
                }  border-r-[0.5px] border-l-[0.5px] border-t-[0.5px] border-[#383C3F]`}
              >
                <div className="flex justify-center items-center h-full w-[40%] ">
                  <button
                    className={`flex justify-center items-center h-full w-full ${
                      portfolio === 1 ? "bg-[#061323]" : ""
                    }`}
                    onClick={() => {
                      setPortfolio(1);
                    }}
                  >
                    Positions
                  </button>
                  <button
                    className={`flex justify-center items-center h-full w-full ${
                      portfolio === 2 ? "bg-[#061323]" : ""
                    }`}
                    onClick={() => {
                      setPortfolio(2);
                    }}
                  >
                    Orders
                  </button>
                  <button
                    className={`flex justify-center items-center h-full w-full border-r-[0.5px] border-[#383C3F] ${
                      portfolio === 3 ? "bg-[#061323]" : ""
                    }`}
                    onClick={() => {
                      setPortfolio(3);
                    }}
                  >
                    Filled
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
                {portfolio === 1 && <Positions></Positions>}
                {portfolio === 2 && (
                  <OpenOrders
                    currAsk={ask}
                    currBid={bid}
                    ltp={ltp}
                  ></OpenOrders>
                )}
                {portfolio === 3 && <Filled></Filled>}
              </div>
            ) : (
              <></>
            )}
            <div className="col-start-8 col-end-10 row-start-1 row-end-7">
              <div className="flex justify-center items-center h-[8%] w-full">
                <button
                  className={`flex justify-center items-center w-[50%] h-full border-b-[0.5px] border-[#383C3F] ${
                    order ? "bg-[#061323]" : ""
                  }`}
                  onClick={() => {
                    setOrder(true);
                  }}
                >
                  Order
                </button>

                <button
                  className={`flex justify-center items-center w-[50%] h-full border-b-[0.5px] border-[#383C3F] ${
                    !order ? "bg-[#061323]" : ""
                  }`}
                  onClick={() => {
                    setOrder(false);
                  }}
                >
                  Trade
                </button>
              </div>
              <div className="h-[92%]">
                {order && (
                  <OrderBook
                    asks={askDepth.slice(0, 10)}
                    bids={bidDepth.slice(0, 10)}
                    ltp={ltp}
                  ></OrderBook>
                )}
                {!order && (
                  <RecentTrades
                    data={buyers.reverse().slice(0, 50)}
                  ></RecentTrades>
                )}
              </div>
            </div>
            <div className="col-start-10 col-end-13 row-start-1 row-end-3">
              <AcountDetails></AcountDetails>
            </div>
            <div className="col-start-10 col-end-13 row-start-3 row-end-7">
              <OrderWindow
                tradeWindow={tradeWindow}
                setTradeWindow={setTradeWindow}
              ></OrderWindow>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden flex justify-center items-start font-montserrat h-full bg-[#122337] text-white text-opacity-[90%]">
        {!tradeWindow && (
          <div className="flex flex-col justify-center items-center h-[94.5%] w-full">
            <div className="h-[20%] w-full">
              <CoinInformation></CoinInformation>
            </div>
            <div className="h-[45%] w-full">
              <div className="flex justify-start items-center gap-2 h-[10%] w-full px-3">
                <button
                  className={`text-bold ${
                    middleWindow === 1
                      ? "text-[#0A7CFF]"
                      : "text-[#eaf0f6] text-opacity-[30%]"
                  }`}
                  onClick={() => {
                    setMiddleWindow(1);
                  }}
                >
                  Chart
                </button>
                <div className="h-6 border-l-2 border-[#383C3F]"></div>
                <button
                  className={`text-bold ${
                    middleWindow === 2
                      ? "text-[#0A7CFF]"
                      : "text-[#eaf0f6] text-opacity-[30%]"
                  }`}
                  onClick={() => {
                    setMiddleWindow(2);
                  }}
                >
                  Order Book
                </button>
                <div className="h-6 border-l-2 border-[#383C3F]"></div>
                <button
                  className={`text-bold ${
                    middleWindow === 3
                      ? "text-[#0A7CFF]"
                      : "text-[#eaf0f6] text-opacity-[30%]"
                  }`}
                  onClick={() => {
                    setMiddleWindow(3);
                  }}
                >
                  Trades
                </button>
              </div>
              <div className="flex justify-center items-center h-[90%] w-full">
                {middleWindow === 1 && (
                  <div className="flex justify-center items-center h-full w-full">
                    <Graph></Graph>
                  </div>
                )}
                {middleWindow === 2 && (
                  <div className="flex justify-center items-center h-full w-full">
                    <OrderBook
                      asks={askDepth.slice(0, 10)}
                      bids={bidDepth.slice(0, 10)}
                      ltp={ltp}
                    ></OrderBook>
                  </div>
                )}
                {middleWindow === 3 && (
                  <div className="flex justify-center items-center h-full w-full">
                    <RecentTrades
                      data={buyers.reverse().slice(0, 50)}
                    ></RecentTrades>
                  </div>
                )}
              </div>
            </div>
            <div className="h-[35%] w-full">
              <div className="flex justify-start items-center gap-2 h-[15%] w-full px-3">
                <button
                  className={`px-2 py-1 rounded-xl ${
                    bottomWindow === 1
                      ? "bg-[#FFFFFF] bg-opacity-[10%] text-[#FFFFFF] text-opacity-[90%]"
                      : "text-[#eaf0f6] text-opacity-[30%]"
                  }`}
                  onClick={() => {
                    setBottomWindow(1);
                  }}
                >
                  Positions
                </button>
                <button
                  className={`px-2 py-1 rounded-xl ${
                    bottomWindow === 2
                      ? "bg-[#FFFFFF] bg-opacity-[10%] text-[#FFFFFF] text-opacity-[90%]"
                      : "text-[#eaf0f6] text-opacity-[30%]"
                  }`}
                  onClick={() => {
                    setBottomWindow(2);
                  }}
                >
                  Open Order
                </button>
                <button
                  className={`px-2 py-1 rounded-xl ${
                    bottomWindow === 3
                      ? "bg-[#FFFFFF] bg-opacity-[10%] text-[#FFFFFF] text-opacity-[90%]"
                      : "text-[#eaf0f6] text-opacity-[30%]"
                  }`}
                  onClick={() => {
                    setBottomWindow(3);
                  }}
                >
                  Order History
                </button>
              </div>
              <div className="flex justify-center items-center h-[85%] w-full">
                {bottomWindow === 1 && (
                  <div className="flex justify-center items-center h-full w-full">
                    <Positions></Positions>
                  </div>
                )}
                {bottomWindow === 2 && (
                  <div className="flex justify-center items-center h-full w-full">
                    <OpenOrders currAsk={ask} currBid={bid}></OpenOrders>
                  </div>
                )}
                {bottomWindow === 3 && (
                  <div className="flex justify-center items-center h-full w-full">
                    <Filled></Filled>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {!tradeWindow && (
          <div className="flex justify-center items-center bottom-0 fixed bg-translucent-bottom h-12 w-full">
            <button
              className="flex justify-between items-center h-full w-full px-10"
              onClick={() => {
                setTradeWindow(true);
              }}
            >
              <div>Tap to trade</div>
              <div>
                <FaAngleUp size={20} />
              </div>
            </button>
          </div>
        )}
        {tradeWindow && (
          <OrderWindow
            tradeWindow={tradeWindow}
            setTradeWindow={setTradeWindow}
          ></OrderWindow>
        )}
      </div>
    </>
  );
};

export default Trade;
