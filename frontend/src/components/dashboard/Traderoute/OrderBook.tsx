import { Provider, Network } from "aptos";
import React, { useState, useEffect, useRef } from "react";
import DepthChart from "./DepthChart.tsx";

interface Order {
  lvg: string;
  qty: string;
  stock_price: string;
  user_address: string;
}

const feedData = [
  {
    lvg: "2",
    qty: "6",
    stock_price: "2000",
    user_address:
      "0x2591c23c72bbb516224b597062e0710b5a9c0cef0bf53ad35e9d1042425bcf6a",
  },
  {
    lvg: "1",
    qty: "1",
    stock_price: "70",
    user_address:
      "0x1b776e1cc438e7deb6baa2476d229ab762b9878493a178335430e2c41e175f6",
  },
  {
    lvg: "1",
    qty: "1",
    stock_price: "70",
    user_address:
      "0x1b776e1cc438e7deb6baa2476d229ab762b9878493a178335430e2c41e175f6",
  },
  {
    lvg: "6",
    qty: "4",
    stock_price: "27",
    user_address:
      "0x91150901d0c52de47ec2b10f671347c25798d402c9b870bf36717ef7d5dcdac0",
  },
  {
    lvg: "1",
    qty: "2",
    stock_price: "25",
    user_address:
      "0x1b776e1cc438e7deb6baa2476d229ab762b9878493a178335430e2c41e175f6",
  },
  {
    lvg: "10",
    qty: "2",
    stock_price: "24",
    user_address:
      "0x91150901d0c52de47ec2b10f671347c25798d402c9b870bf36717ef7d5dcdac0",
  },
  {
    lvg: "10",
    qty: "5",
    stock_price: "21",
    user_address:
      "0x1b776e1cc438e7deb6baa2476d229ab762b9878493a178335430e2c41e175f6",
  },
  {
    lvg: "2",
    qty: "5",
    stock_price: "21",
    user_address:
      "0x1b776e1cc438e7deb6baa2476d229ab762b9878493a178335430e2c41e175f6",
  },
  {
    lvg: "1",
    qty: "1",
    stock_price: "10",
    user_address:
      "0x1b776e1cc438e7deb6baa2476d229ab762b9878493a178335430e2c41e175f6",
  },
  {
    lvg: "2",
    qty: "3",
    stock_price: "8",
    user_address:
      "0x1b776e1cc438e7deb6baa2476d229ab762b9878493a178335430e2c41e175f6",
  },
  {
    lvg: "9",
    qty: "6",
    stock_price: "8",
    user_address:
      "0x1b776e1cc438e7deb6baa2476d229ab762b9878493a178335430e2c41e175f6",
  },
  {
    lvg: "7",
    qty: "2",
    stock_price: "7",
    user_address:
      "0x1b776e1cc438e7deb6baa2476d229ab762b9878493a178335430e2c41e175f6",
  },
  //... (your array of objects)
];
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
      const currAsk: Order[] = response.data.asks.slice(0, 10);
      const currBid: Order[] = response.data.bids.slice(0, 10);

      setAsk(currAsk);
      setBid(currBid);
      console.log("data aa gya :", currAsk, currBid);
    } catch (error) {
      console.log(error, "Error occurred!");
    }
  };

  useEffect(() => {
    fetchList();
    const fetchInterval = setInterval(() => {
      fetchList();
    }, 1000);
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
        <div className="flex h-full w-full">
          <DepthChart side="asks" data={ask}></DepthChart>
        </div>
        {/* <h2>Asks</h2>
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
        </div> */}
      </div>
      <div className="h-[6%] relative w-full flex flex-col justify-center items-center border-b-[0.5px] border-t-[0.5px] md:border-[#383C3F]">
        Last Traded Price
      </div>
      <div
        className="h-[43%] w-full flex flex-col justify-start items-center overflow-y-hidden"
        id="bids"
      >
        <div className="flex h-full w-full">
          <DepthChart side="bids" data={bid}></DepthChart>
        </div>
        {/* <h2>Bids</h2>
        <div className="flex flex-col justify-end items-center w-full text-xs">
          {bid.map((order, index) => (
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
        </div>*/}
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
