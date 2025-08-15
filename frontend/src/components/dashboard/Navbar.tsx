import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import logo from "./../../assets/Logo.svg";
import { Link, useLocation } from "react-router-dom";

let Navbar: React.FC = () => {
  const location = useLocation();
  const currLocation = location.pathname;
  console.log(currLocation);

  return (
    <>
      <div className="flex justify-between items-center h-16 bg-[#122337] px-10">
        <div className="flex items-center justify-center">
          <div className="flex gap-3 justify-center items-center pr-3">
            <a>
              <img className="h-10" src={logo}></img>
            </a>
            <div className="h-8 border-l-2 border-[#383C3F]"></div>
          </div>

          <div className="md:flex font-montserrat md:gap-4 lg:gap-10 items-center hidden text-lg font-semibold pr-3">
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
          <div className="h-8 border-l-2 border-[#383C3F]"></div>
        </div>
        <div className="bg-[#1068CE] rounded-lg hover:bg-white">
          <WalletSelector />
        </div>
      </div>
    </>
  );
};

export default Navbar;
