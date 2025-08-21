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
  let count = 0;
  const res: Trades[] = [];
  while (m >= 0 && n >= 0) {
    let quantityB = parseFloat(Buyers[m].qty);
    let quantityS = parseFloat(Sellers[n].qty);

    if (quantityB >= quantityS) {
      let price = Buyers[m].stock_price;
      res.push({ quantity: `${quantityB}`, price: price, side: "buy" });
      count++;
      while (quantityB) {
        let quantity = parseFloat(Sellers[n].qty);
        let price1 = Sellers[n].stock_price;
        res.push({ quantity: `${quantity}`, price: price1, side: "sell" });
        count++;
        quantityB -= quantity;
        n--;
      }
      m--;
    } else {
      let price = Sellers[n].stock_price;
      res.push({ quantity: `${quantityS}`, price: price, side: "sell" });
      count++;
      while (quantityS) {
        let quantity = parseFloat(Buyers[m].qty);
        let price1 = Buyers[m].stock_price;
        res.push({ quantity: `${quantity}`, price: price1, side: "buy" });
        count++;
        quantityS -= quantity;
        m--;
      }
      n--;
    }
    if (count === 100) return res;
  }
  return res;
}

const RecentTrades = () => {
  const provider = new Provider(Network.DEVNET);
  const [recentTrades, setRecentTrades] = useState<Trades[]>([]);
  const moduleAddress =
    "0xc694f211d4385c16fee79540d3276d6b6f407e252f4814c4596831c2405395eb";

  const fetchList = async () => {
    try {
      const response = await provider.getAccountResource(
        moduleAddress,
        `${moduleAddress}::Orderbook::Resource`
      );
      const data: Trades[] = solve(response.data.buyers, response.data.sellers);
      setRecentTrades(data);
      console.log(data, "home");
    } catch (error) {
      console.log(error, "Error occurred!");
    }
  };

  useEffect(() => {
    fetchList();
    const fetchInterval = setInterval(() => {
      fetchList();
    }, 5000);
  }, []);

  return (
    <>
      <div className="md:flex hidden justify-center items-center h-full w-full border-b-[0.5px] border-[#383C3F]">
        RecentTrades
      </div>
    </>
  );
};

export default RecentTrades;
