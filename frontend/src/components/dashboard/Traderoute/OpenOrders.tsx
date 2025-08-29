import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network, Provider } from "aptos";
import { useState, useEffect } from "react";

interface Order {
  lvg?: string;
  qty: string;
  stock_price: string;
  user_address?: string;
  timestamp: string;
  pos?: boolean;
}

function specificUserTransaction(currArr: Order[], account: any) 
{
  const meraPta = String(account.address); 
  return currArr!.filter((val) => {
    val.user_address === meraPta;
  });
}

function solve(userAsk: Order[], userBid: Order[])
{
  const response = [];
  for(let i=0;i<userAsk.length;i++)
  {
    response.push({qty:userAsk[i].qty, stock_price:userAsk[i].stock_price, timestamp:userAsk[i].timestamp, pos:false});
  }
  for(let i=0;i<userBid.length;i++)
  {
    response.push({qty:userBid[i].qty, stock_price:userBid[i].stock_price, timestamp:userBid[i].timestamp, pos:true});
  }
  return response.sort((a,b)=> parseFloat(b.timestamp) - parseFloat(a.timestamp));
}
const OpenOrders = ({currAsk, currBid}:{currAsk:Order[], currBid:Order[]}) => {
  const { account } = useWallet();
      if(!account) return <h1>Please Connect your wallet!!</h1>;
      console.log("mera pta", account.address)
      const userAsk = specificUserTransaction(currAsk, account);
      const userBid = specificUserTransaction(currBid, account);

      const openOrder:Order[] = solve(currAsk, currBid);
      console.log("openOrders",openOrder);
  return (
    <>
      <div className="md:flex hidden justify-center items-center h-full w-full border-[0.5px] border-[#383C3F]">
        OpenOrders
      </div>
      <div className="md:hidden flex justify-center items-center h-full w-full">
        OpenOrders
      </div>
    </>
  );
};

export default OpenOrders;
