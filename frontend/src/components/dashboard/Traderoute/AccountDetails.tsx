import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import React from "react";

const AccountDetails = () => {
  return (
    <div className="flex justify-center items-center h-full w-full border-l-[0.5px] border-r-[0.5px] border-[#383C3F]">
      <div className="flex flex-col justify-center items-center text-center gap-2">
        <h1 className="px-5 ">
          Connect your wallet to deposit funds and start trading.
        </h1>
        <WalletSelector></WalletSelector>
      </div>
    </div>
  );
};

export default AccountDetails;
