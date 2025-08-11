import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/dashboard/Navbar";
import Trade from "../components/dashboard/Trade";

const Dashboard: React.FC = () => {
  const location = useLocation();
  const currLocation = location.pathname;
  return (
    <>
      <div className="h-screen flex flex-col">
        <Navbar></Navbar>
        <div className="flex-1 h-full overflow-y-auto">
          {currLocation == "/dashboard/trade" ? <Trade></Trade> : <></>}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
