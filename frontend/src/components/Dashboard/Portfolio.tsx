import React, { useEffect, useState } from "react";
import Navelement from "./Portfolioroute/Navelement";
import Positions from "./Portfolioroute/Positions";
import Order from "./Portfolioroute/Order";
import History from "./Portfolioroute/History";
import { Network, Provider } from "aptos";


const moduleAddress = import.meta.env.VITE_APP_MODULE_ADDRESS;
const apiUrl = `https://fullnode.devnet.aptoslabs.com/v1/accounts/${moduleAddress}/events/${moduleAddress}::Orderbook::DexOrderBook/set_ltp_event`;
const rfactor = 0.1;
const expiryTime = 1702233000;

interface Order {
  lvg: string;
  qty: string;
  stock_price: string;
  user_address: string;
  pos?: boolean;
  timestamp: string;
}
interface Data {
  value: number;
  time: number;
}
const Portfolio = () => {
  const [nav, setNav] = useState(1);
 const provider = new Provider(Network.DEVNET);

  const fetchData = async () => {
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
      setAsk(currAsk);
      setBid(currBid);
      setBuyers(currBuyers);
      setSellers(currSellers);
      setLtp(currBuyers.reverse()[0]);
      console.log("nigga", currAsk);
    } catch (error) {
      console.log(error, "Error occurred!");
    }
  };
  const fetchltp = async () => {
    try {
      const response = await fetch(`${apiUrl}?limit=10`);
      const data = await response.json();
      const assetData: Data = {
        value: parseFloat(data[data.length - 1].data.ltp),
        time: Math.floor(
          Number(data[data.length - 1].data.timestamp) / 1000000
        ),
      };
      const futuresData: Data = {
        value:
          assetData.value *
          (1 + (rfactor * (expiryTime - assetData.time)) / (24 * 3600)),
        time: Math.floor(
          Number(data[data.length - 1].data.timestamp) / 1000000
        ),
      };
      setAssetLtp(assetData);
      setFuturesLtp(futuresData);
      console.log("asset data", assetData, futuresData);
    } catch (error) {
      console.error(error);
    }
  };
  const [ask, setAsk] = useState<Order[]>([]);
  const [bid, setBid] = useState<Order[]>([]);
  const [buyers, setBuyers] = useState<Order[]>([]);
  const [sellers, setSellers] = useState<Order[]>([]);
  const [ltp, setLtp] = useState<Order>();
  const [assetLtp, setAssetLtp] = useState<Data>();
  const [futuresLtp, setFuturesLtp] = useState<Data>();

  useEffect(() => {
    fetchData();
    setInterval(() => {
      fetchData();
      console.log("fucker", ask);
    }, 1000);
  }, []);

  return (
    <>
      <div className="flex  h-full w-full">
        <Navelement nav={nav} setNav={setNav}></Navelement>
        {nav === 1 && <Positions currAsk={ask} currBid={bid}></Positions>}
        {nav === 2 && (
          <Order seller={sellers} buyer={buyers} chartLtp={assetLtp}></Order>
        )}
        {nav === 3 && <History></History>}
      </div>
    </>
  );
};

export default Portfolio;
