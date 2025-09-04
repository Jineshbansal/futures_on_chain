import React, { useState } from "react";
import Navelement from "./Portfolioroute/Navelement";
import Positions from "./Portfolioroute/Positions";
import Order from "./Portfolioroute/Order";
import History from "./Portfolioroute/History";

const Portfolio = () => {
  const [nav, setNav] = useState<Number>(1);

  console.log(nav);

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
