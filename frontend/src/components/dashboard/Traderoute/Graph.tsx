import TradingViewWidget from "./Chart.jsx" ;

const Graph = () => {
  return (
    <>
      <div className="md:flex hidden justify-center items-center h-full w-full border-r-[0.5px] border-l-[0.5px] border-[#383C3F] ">
        <TradingViewWidget></TradingViewWidget>
      </div>
      <div className="md:hidden flex justify-center items-center h-full w-full">
        <TradingViewWidget></TradingViewWidget>
      </div>
    </>
  );
};

export default Graph;
