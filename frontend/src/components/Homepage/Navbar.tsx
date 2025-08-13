import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import logo from "./../../assets/Icon.svg";
import { Link, useLocation } from "react-router-dom";

let Navbar: React.FC = () => {
  const location = useLocation();
  const currLocation = location.pathname;

  return (
    <>
      <div className="flex items-center justify-between px-8 py-3">
        <div>
          <a href="/">
            <img src={logo}></img>
          </a>
        </div>

        <div className="md:flex font-montserrat md:gap-4 lg:gap-10 items-center hidden text-lg font-semibold">
          <Link
            to="/"
            className={`nav-link ${currLocation == "/" ? "active" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`nav-link ${currLocation == "/about" ? "active" : ""}`}
          >
            About
          </Link>
          <Link
            to="/docs"
            className={`nav-link ${currLocation == "/docs" ? "active" : ""}`}
          >
            Docs
          </Link>
          <Link
            to="/apis"
            className={`nav-link ${currLocation == "/apis" ? "active" : ""}`}
          >
            APIs
          </Link>
        </div>
        {/* <div className="bg-blue-500 rounded-lg hover:bg-white"> */}
        <WalletSelector />
        {/* </div> */}
      </div>
    </>
  );
};

export default Navbar;
