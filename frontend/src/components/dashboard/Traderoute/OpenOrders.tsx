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
  currArr.filter((val) => {
    val.user_address === account?.address;
  });
  console.log("moye moye curr arr", currArr);
  return currArr;
}
const OpenOrders = () => {
  const { account } = useWallet();
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

      setAsk(specificUserTransaction(currAsk, account));
      setBid(specificUserTransaction(currBid, account));

      console.log("data :moye moye", currAsk, currBid);
    } catch (error) {
      console.log(error, "Error occurred moye!");
    }
  };

  useEffect(() => {
    fetchList();
    const fetchInterval = setInterval(() => {
      fetchList();
    }, 500);
  }, []);

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
