import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import logo from "./../../assets/Icon.svg";
import { Link, useLocation } from "react-router-dom";

let Navbar: React.FC = () => {
  const location = useLocation();
  const currLocation = location.pathname;
  console.log(currLocation);

  return (
    <>
      <div className="flex items-center justify-between bg-[#122337] px-8 py-3">
        <div>
          <a href="/">
            <img src={logo}></img>
          </a>
        </div>

        <div className="md:flex font-montserrat md:gap-4 lg:gap-10 items-center hidden text-lg font-semibold">
          <Link
            to="/dashboard/trade"
            className={`nav-link ${
              currLocation == "/dashboard/trade" ? "active" : ""
            }`}
          >
            Trade
          </Link>
          <Link
            to="/dashboard/portfolio"
            className={`nav-link ${
              currLocation == "/dashboard/portfolio" ? "active" : ""
            }`}
          >
            Portfolio
          </Link>
          <Link
            to="/dashboard/markets"
            className={`nav-link ${
              currLocation == "/dashboard/markets" ? "active" : ""
            }`}
          >
            Markets
          </Link>
        </div>
        <div className="bg-[#1068CE] rounded-lg hover:bg-white">
          <WalletSelector />
        </div>
      </div>
    </>
  );
};

export default Navbar;
