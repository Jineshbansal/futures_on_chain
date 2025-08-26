import { Provider, Network } from "aptos";
import React, { useState, useEffect, useRef } from "react";

interface Order {
  lvg: string;
  qty: string;
  stock_price: string;
  user_address: string;
}

interface Trades {
  quantity: String;
  price: String;
  side: "buy" | "sell";
}

function solve(Buyers: Order[], Sellers: Order[]): Trades[] {
  let m = Buyers.length - 1;
  let n = Sellers.length - 1;
  const res: Trades[] = [];
  let count = 0;
  while (m-- && n--) {
    let tradedPrice = Math.min(
      parseFloat(Buyers[m].stock_price),
      parseFloat(Sellers[n].stock_price)
    );
    res.push({
      quantity: Buyers[m].qty,
      price: `${tradedPrice}`,
      side: "buy",
    });
    res.push({
      quantity: Sellers[m].qty,
      price: `${tradedPrice}`,
      side: "sell",
    });
    count += 2;
    if (count == 100) return res;
  }
  return res;
  // let count = 0;
  // const res: Trades[] = [];
  // while (m >= 0 && n >= 0) {
  //   let quantityB = parseFloat(Buyers[m].qty);
  //   let quantityS = parseFloat(Sellers[n].qty);

  //   if (quantityB >= quantityS) {
  //     let price = Buyers[m].stock_price;
  //     res.push({ quantity: `${quantityB}`, price: price, side: "buy" });
  //     count++;
  //     while (quantityB) {
  //       let quantity = parseFloat(Sellers[n].qty);
  //       let price1 = Sellers[n].stock_price;
  //       res.push({ quantity: `${quantity}`, price: price1, side: "sell" });
  //       count++;
  //       quantityB -= quantity;
  //       n--;
  //     }
  //     m--;
  //   } else {
  //     let price = Sellers[n].stock_price;
  //     res.push({ quantity: `${quantityS}`, price: price, side: "sell" });
  //     count++;
  //     while (quantityS) {
  //       let quantity = parseFloat(Buyers[m].qty);
  //       let price1 = Buyers[m].stock_price;
  //       res.push({ quantity: `${quantity}`, price: price1, side: "buy" });
  //       count++;
  //       quantityS -= quantity;
  //       m--;
  //     }
  //     n--;
  //   }
  //   if (count === 100) return res;
  // }
  // return res;
}

const RecentTrades = () => {
  const provider = new Provider(Network.DEVNET);
  const [recentTrades, setRecentTrades] = useState<Trades[]>([]);
  const moduleAddress =
    "0xb29675510ed51c652fb018da70c38e6e3ed2e5804044bb7d24d8c6dcbf94760d";

  const fetchList = async () => {
    try {
      const response = await provider.getAccountResource(
        moduleAddress,
        `${moduleAddress}::Orderbook::Resource`
      );
      const data: Trades[] = solve(response.data.buyers, response.data.sellers);
      setRecentTrades(data);
      // console.log(response.data.buyers, "home");
      // console.log(response.data.sellers, "home");
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
    <>
      <div className="flex flex-col justify-center items-center h-full w-full border-b-[0.5px] border-[#383C3F]">
        <div className="h-[10%] w-full flex justify-between items-center">
          <div className="flex justify-center items-center h-full w-full">
            Price
          </div>
          <div className="flex justify-center items-center h-full w-full">
            Quantity
          </div>
        </div>
        <div
          className="h-full w-full flex flex-col justify-start items-center overflow-y-scroll text-xs"
          id="asks"
        >
          {/* <h2>Asks</h2> */}
          <div className="flex flex-col justify-end items-center w-full">
            {recentTrades.map((order, index) => (
              <div
                key={index}
                className="flex justify-evenly items-center h-full w-full"
              >
                <div
                  className={`flex justify-center items-center w-20 ${
                    order.side === "buy" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {order.price}
                </div>
                <div className="flex justify-center items-center w-20">
                  {order.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RecentTrades;
