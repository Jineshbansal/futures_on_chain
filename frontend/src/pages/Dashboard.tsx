import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/dashboard/Navbar";
import Trade from "../components/dashboard/Trade";
import Markets from "../components/dashboard/Markets";
import Portfolio from "../components/dashboard/Portfolio";

const Dashboard: React.FC = () => {
  const location = useLocation();
  const currLocation = location.pathname;
  return (
    <>
      <div className="h-screen flex flex-col">
        <Navbar></Navbar>
        <div className="flex-1 h-full overflow-y-auto">
          {currLocation == "/dashboard/trade" && <Trade></Trade>}
          {currLocation == "/dashboard/portfolio" && <Portfolio></Portfolio>}
          {currLocation == "/dashboard/markets" && <Markets></Markets>}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
