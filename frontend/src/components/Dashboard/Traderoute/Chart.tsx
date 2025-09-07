import React, { useEffect, useRef, useState } from "react";
import { createChart, PriceScaleMode } from "lightweight-charts";

interface Data {
  value: number;
  time: number;
}

// const moduleAddress = import.meta.env.VITE_APP_MODULE_ADDRESS;
// const apiUrl = `https://fullnode.devnet.aptoslabs.com/v1/accounts/${moduleAddress}/events/${moduleAddress}::Orderbook::DexOrderBook/set_ltp_event`;
var lastSequenceNumber = "";

const Chart = ({rfactor, expiryTime , apiUrl}:{rfactor:number, expiryTime:number, apiUrl:string}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {

      const chartProperties = {
        localization: {
          priceFormatter: (price: number) => {
            return new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "APT",
              maximumFractionDigits: 3,
            }).format(price);
          },
        },
        priceFormat: {
          type: "price",
          minMove: 0.001,
        },
        PriceScaleMode: {
          autoScale: true,
          mode: PriceScaleMode.Normal,
          precision: 3,
        },
        layout: {
          background: {
            color: "rgba(13, 16, 34, 0.87)"
          },
          textColor: "#d1d4dd",
        },
        grid: {
          vertLines: { color: "rgba(42, 46, 57, 0)" },
          horzLines: { color: "rgba(42, 46, 57, 0.6)" },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: true,
        },
      };
      const domElement = chartRef.current;
      const chart = createChart(domElement, chartProperties);
      const areaSeries = chart.addAreaSeries({
        topColor: "rgba(38,198,218, 0.56)",
        bottomColor: "rgba(38,198,218, 0.04)",
        lineColor: "rgba(38,198,218, 0.7)",
        lineWidth: 2,
      });

const fetchData = async () => {
  try {
    const response = await fetch(`${apiUrl}?limit=100`);
    const data = await response.json();
    lastSequenceNumber = (parseInt(data[data.length - 1].sequence_number) + 1).toString();
    const newData = data.map((item: any) => ({
      value: parseFloat(item.data.ltp) * ( 1 + (rfactor * (expiryTime - (Math.floor(Number(item.data.timestamp) / 1000000)))/(24*3600))),
      time: Math.floor(Number(item.data.timestamp) / 1000000),
    }));
   areaSeries.setData(newData);
  } catch (error) {
    console.error(error);
  }
};

fetchData();
setInterval(() => {
  fetch(`${apiUrl}?limit=10&start=${lastSequenceNumber}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("trying")
      lastSequenceNumber = (parseInt(data[data.length - 1].sequence_number) + 1).toString();
      const newData: Data = {
        value: parseFloat(data[data.length - 1].data.ltp) * ( 1 + (rfactor * (expiryTime - Math.floor(Number(data[data.length - 1].data.timestamp) / 1000000))/(24*3600))),
        time: Math.floor(Number(data[data.length - 1].data.timestamp) / 1000000),
      };
      console.log(newData,lastSequenceNumber,"data updating chart")
      areaSeries.update(newData);
    })
    .catch((err) => console.log(err));
}, 1000);

    new ResizeObserver((entries) => {
      if (entries.length === 0 || entries[0].target !== chartRef.current) {
        return;
      }
      const newRect = entries[0].contentRect;
      chart.applyOptions({ height: newRect.height, width: newRect.width });
    }).observe(chartRef.current);
  }, []);

  return (
    <>
      <div className="flex justify-center items-center h-full w-full md:border-r-[0.5px] md:border-l-[0.5px] md:border-[#383C3F] ">
        <div ref={chartRef} className="h-full w-full "></div>
      </div>{" "}
    </>
  );
};

export default Chart;


