import DepthChart from "./DepthChart.tsx";

interface Order {
  lvg: string;
  qty: string;
  stock_price: string;
  user_address: string;
}
const OrderBook= ({asks, bids}:{asks:Order[]; bids:Order[]}) => {

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
          <DepthChart side="asks" data={asks}></DepthChart>
        </div>
      </div>
      <div className="h-[6%] relative w-full flex flex-col justify-center items-center border-b-[0.5px] border-t-[0.5px] md:border-[#383C3F]">
        Last Traded Price
      </div>
      <div
        className="h-[43%] w-full flex flex-col justify-start items-center overflow-y-hidden"
        id="bids"
      >
        <div className="flex h-full w-full">
          <DepthChart side="bids" data={bids}></DepthChart>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;


