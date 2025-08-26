import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network, Provider } from "aptos";
import { useState, useEffect } from "react";

interface Order {
  lvg: string;
  qty: string;
  stock_price: string;
  user_address: string;
}

function specificUserTransaction(currArr: Order[], account: any) {
  console.log(account?.address, "moye");
  currArr!.filter((val) => {
    val.user_address === account?.address;
  });
  return currArr;
}
const OpenOrders = ({currAsk, currBid}:{currAsk:Order[], currBid:Order[]}) => {
  const { account } = useWallet();

      const userAsk = specificUserTransaction(currAsk, account);
      const userBid = specificUserTransaction(currBid, account);
      console.log("moye moye curr arr", userAsk);
      console.log("moye moye curr arr", userBid);

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
