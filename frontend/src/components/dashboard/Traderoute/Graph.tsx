import TradingViewWidget from "./Chart.jsx" ;

const Graph = () => {
  return (
    <div className="flex justify-center items-center h-full w-full border-r-[0.5px] border-l-[0.5px] border-[#383C3F] ">
      <TradingViewWidget></TradingViewWidget>
    </div>
  );
};

export default Graph;
