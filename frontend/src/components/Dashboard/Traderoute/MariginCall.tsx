import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import React from "react";

const AccountDetails = () => {
  const { account } = useWallet();
  return (
    <>
      {!account && (
        <div className="flex justify-center items-center h-full w-full border-l-[0.5px] border-r-[0.5px] border-[#383C3F]">
          <div className="flex flex-col justify-center items-center text-center gap-2">
            <h1 className="px-5 ">
              Connect your wallet to deposit funds and start trading.
            </h1>
            <WalletSelector></WalletSelector>
          </div>
        </div>
      )}
      {account && (
        <div className="flex justify-center items-center h-full w-full border-l-[0.5px] border-r-[0.5px] border-[#383C3F]">
          <div className="flex flex-col justify-center items-center p-2 w-[60%] gap-2 bg-[#ffffff] bg-opacity-[4%] rounded-xl shadow">
            <div className="font-montserrat">Marigin Call</div>
            <div className="flex flex-col justify-center items-start w-full h-full rounded-xl">
              <div className="w-full h-full bg-[#FFFFFF] bg-opacity-[8%] px-4 rounded-t-xl text-[#eaf0f6] text-opacity-[60%]">
                Price
              </div>
              <input
                className="w-full h-full appearance-none focus:outline-none px-4 bg-[#FFFFFF] bg-opacity-[8%] rounded-b-xl"
                placeholder="0.00"
                type="text"
                // value={price ? price : ""}
                // onChange={handlePrice}
              ></input>
            </div>
            <div className="flex flex-col justify-center items-start w-full h-full rounded-xl">
              <div className="w-full h-full bg-[#FFFFFF] bg-opacity-[8%]  px-4 rounded-t-xl text-[#eaf0f6] text-opacity-[60%]">
                Price
              </div>
              <input
                className="w-full h-full appearance-none focus:outline-none px-4 bg-[#FFFFFF] bg-opacity-[8%] rounded-b-xl"
                placeholder="0.00"
                type="text"
                // value={price ? price : ""}
                // onChange={handlePrice}
              ></input>
            </div>
            <div
              className="flex justify-center items-center min-w-[40%] h-full bg-[#1068CE] rounded-lg hover:bg-white border hover:text-[#1068CE] border-[#1068CE]"
              onClick={() => {}}
            >
              Submit
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountDetails;
