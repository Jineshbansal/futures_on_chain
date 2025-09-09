import React, { useState } from "react";
import Navelement from "./Portfolioroute/Navelement";
import Positions from "./Portfolioroute/Positions";
import Order from "./Portfolioroute/Order";
import History from "./Portfolioroute/History";

const Portfolio = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(1); // New state variable

  const toggle = () => setIsOpen(!isOpen);
  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0.5,
      },
    },
  };

  const handleRouteClick = (name) => {
    setSelectedRoute(name);
    console.log(name);
  };

  return (
    <>
      <div className="flex  h-full w-full">
        <Navelement nav={nav} setNav={setNav}></Navelement>
        {nav === 1 && <Positions></Positions>}
        {nav === 2 && <Order></Order>}
        {nav === 3 && <History></History>}
      </div>
    </>
  );
};

export default Portfolio;
