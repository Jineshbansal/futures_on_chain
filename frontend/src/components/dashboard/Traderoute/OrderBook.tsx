import { Provider, Network } from "aptos";
import React, { useState, useEffect, useRef } from "react";

interface Order {
  lvg: string;
  qty: string;
  stock_price: string;
  user_address: string;
}

const OrderBook: React.FC = () => {
  const provider = new Provider(Network.DEVNET);

  const [ask, setAsk] = useState<Order[]>([]);
  const [bid, setBid] = useState<Order[]>([]);
  const moduleAddress =
    "0xb29675510ed51c652fb018da70c38e6e3ed2e5804044bb7d24d8c6dcbf94760d";

  const fetchList = async () => {
    try {
      // Assume provider.getAccountResource fetches data from an API
      const response = await provider.getAccountResource(
        moduleAddress,
        `${moduleAddress}::Orderbook::Resource`
      );
      const currAsk: Order[] = response.data.asks;
      const currBid: Order[] = response.data.bids;

      setAsk(currAsk);
      setBid(currBid);

      console.log("data :", currAsk, currBid);
    } catch (error) {
      console.log(error, "Error occurred!");
    }
  };

  useEffect(() => {
    fetchList();
    const fetchInterval = setInterval(() => {
      fetchList();
    }, 500);
  }, []);

  return (
    <div className="flex flex-col justify-between items-center h-full w-full border-b-[0.5px] border-[#383C3F]">
      <div className="h-[10%] w-full flex justify-between items-center">
        <div className="flex justify-center items-center h-full w-full">
          Price
        </div>
        <div className="flex justify-center items-center h-full w-full">
          Quantity
        </div>
      </div>

      <div
        className="h-[43%] w-full flex flex-col justify-end items-center overflow-y-hidden text-xs"
        id="asks"
      >
        {/* <h2>Asks</h2> */}
        <div className="flex flex-col justify-end items-center w-full">
          {ask.reverse().map((order, index) => (
            <div
              key={index}
              className="flex justify-evenly items-center h-full w-full"
            >
              <div className="flex justify-center items-center w-20 text-red-500">
                {order.stock_price}
              </div>
              <div className="flex justify-center items-center w-20">
                {order.qty}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-[6%] relative w-full flex flex-col justify-center items-center border-b-[0.5px] border-t-[0.5px] md:border-[#383C3F]">
        Last Traded Price
      </div>
      <div
        className="h-[43%] w-full flex flex-col justify-start items-center overflow-y-hidden"
        id="bids"
      >
        {/* <h2>Bids</h2> */}
        <div className="flex flex-col justify-end items-center w-full text-xs">
          {bid.reverse().map((order, index) => (
            <div
              key={index}
              className="flex justify-evenly items-center h-full w-full"
            >
              <div className="flex justify-center items-center w-20 text-green-500">
                {order.stock_price}
              </div>
              <div className="flex justify-center items-center w-20">
                {order.qty}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderBook;

// import React from "react";

// const OrderBook = () => {
//   return (
//     <>
//       <div className="md:flex flex-col hidden justify-center items-center h-full w-full border-b-[0.5px] border-[#383C3F]">
//         <div className="h-full w-full flex flex-col justify-between items-center">
//           <div className="h-[10%] w-full flex justify-evenly items-center">
//             <div>Price</div>
//             <div>Size</div>
//           </div>
//           <div className="h-[90%] w-full flex flex-col justify-center items-center">
//             <div className="h-[45%] w-full"></div>
//             <div className="h-[10%] w-full"></div>
//             <div className="h-[45%] w-full"></div>
//           </div>
//         </div>
//       </div>

//       <div className="md:hidden flex justify-center items-center h-full w-full">
//         Order Book
//       </div>
//     </>
//   );
// };

// export default OrderBook;
