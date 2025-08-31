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

function specificUserTransaction(currArr: Order[], account: any) {
  const meraPta = String(account.address);
  return currArr!.filter((val) => {
    val.user_address === meraPta;
  });
}

function solve(userAsk: Order[], userBid: Order[]): Order[] {
  const response = [];
  for (let i = 0; i < userAsk.length; i++) {
    response.push({
      user_address: userAsk[i].user_address,
      qty: userAsk[i].qty,
      stock_price: userAsk[i].stock_price,
      timestamp: userAsk[i].timestamp,
      pos: false,
    });
  }
  for (let i = 0; i < userBid.length; i++) {
    response.push({
      user_address: userBid[i].user_address,
      qty: userBid[i].qty,
      stock_price: userBid[i].stock_price,
      timestamp: userBid[i].timestamp,
      pos: true,
    });
  }
  return response.sort(
    (a, b) => parseFloat(b.timestamp) - parseFloat(a.timestamp)
  );
}

const Positions = ({ seller, buyer }: { seller: Order[]; buyer: Order[] }) => {
  const { account } = useWallet();
  if (!account)
    return (
      <div className="flex justify-center items-center h-full w-full md:border-[0.5px] md:border-[#383C3F] p-5">
        Please Connect your wallet!!
      </div>
    );
  console.log("mera pta", account.address);

  const [filledOrders, setFilledOrder] = useState<Order[]>([]);
  useEffect(() => {
    const userSells = specificUserTransaction(seller, account);
    const userBuys = specificUserTransaction(buyer, account);
    setFilledOrder(solve(seller, buyer));
    console.log("filledOrders", filledOrders);
  }, [seller, buyer]);

  const [hoveringRow, setHoveringRow] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    setHoveringRow(index);
  };

  const handleMouseLeave = () => {
    setHoveringRow(null);
  };

  const handleExitClick = (index: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to exit the position?"
    );
    if (confirmed) {
      // Perform exit action here
      console.log("Exit:", filledOrders[index]);
      setHoveringRow(null); // Reset the hovering state after exit
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-full w-full md:border-[0.5px] md:border-[#383C3F] p-5">
        <div className="flex justify-between items-start h-full w-full overflow-y-auto p-2">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden bg-opacity-[5%]">
            <thead className="bg-slate-900 text-slate-300 uppercase text-sm leading-normal">
              <tr>
                <th className="lg:py-3 lg:px-6 md:px-2 md:py- text-center">
                  Side
                </th>
                <th className="lg:py-3 lg:px-6 md:px-2 md:py- text-center">
                  Price
                </th>
                <th className="lg:py-3 lg:px-6 md:px-2 md:py- text-center">
                  Quantity
                </th>
                <th className="lg:py-3 lg:px-6 md:px-2 md:py- text-center">
                  timestamp
                </th>
                <th>P/L</th>
                <th className="lg:py-3 lg:px-6 md:px-2 md:py- text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="text-slate-300 text-sm font-light">
              {filledOrders.map((item, index) => (
                <tr key={index} className="border-b border-[#383C3F]">
                  {item.pos ? (
                    <td className="lg:py-3 lg:px-6 md:px-2 md:py- text-center text-green-500 ">
                      <p className="border border-green-500 rounded">Buy</p>
                    </td>
                  ) : (
                    <td className="lg:py-3 lg:px-6 md:px-2 md:py-  text-center text-red-500">
                      <p className="border border-red-500 rounded">Sell</p>
                    </td>
                  )}
                  <td className="lg:py-3 lg:px-6 md:px-2 md:py- text-left">
                    {item.stock_price}
                  </td>
                  <td className="lg:py-3 lg:px-6 md:px-2 md:py- text-left">
                    {item.qty}
                  </td>
                  <td className="lg:py-3 lg:px-6 md:px-2 md:py- text-left">
                    {new Date(
                      Math.floor(parseFloat(item.timestamp) / 1000)
                    ).toLocaleString()}
                  </td>
                  <td></td>
                  <td className="lg:py-3 lg:px-6 md:px-2 md:py- text-center">
                    <button
                      className="h-full w-full bg-slate-600 rounded"
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleExitClick(index)}
                    >
                      {hoveringRow === index ? <p>Exit</p> : <p>Filled</p>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Positions;
