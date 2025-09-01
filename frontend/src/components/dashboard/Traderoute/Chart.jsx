import React, { useEffect, useRef, useState } from "react";
import { createChart, PriceScaleMode } from "lightweight-charts";

export default function TradingViewWidget() {
  const rfFactor = 0.1;
  const expiryTime = 1701801000;
  const factor = 3600 * 24;

  let limit = 100;
  let lastSequenceNumber = "0";

  let dexModule = import.meta.env.VITE_APP_DEX_MODULE_ADDRESS;
  let url = `https://fullnode.devnet.aptoslabs.com/v1/accounts/${dexModule}/events/${dexModule}::dummycastdefi::OrderBook/set_ltp_event?limit=${limit}`;
  const options = { method: "GET", headers: { Accept: "application/json" } };

  const chartRef = useRef();

  useEffect(() => {
    const chartProperties = {
      localization: {
        priceFormatter: (price) => {
          let myPrice = new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "APT",
            maximumFractionDigits: 3,
          }).format(price);

          return myPrice;
        },
      },
      priceFormat: {
        type: "price",
        // precision: 70,
        minMove: 0.001,
      },
      PriceScaleMode: {
        autoScale: true,
        mode: PriceScaleMode.Normal,
        precision: 3,
      },
      layout: {
        background: "#131722",
        textColor: "#d1d4dd",
      },
      grid: {
        vertLines: {
          color: "rgba(42, 46, 57, 0)",
        },
        horzLines: {
          color: "rgba(42, 46, 57, 0.6)",
        },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
    };
    const domElement = chartRef.current;
    const chart = createChart(domElement, chartProperties);
    // const lineSeries = chart.addLineSeries({ color: '#2962FF' });
    var areaSeries = chart.addAreaSeries({
      topColor: "rgba(38,198,218, 0.56)",
      bottomColor: "rgba(38,198,218, 0.04)",
      lineColor: "rgba(38,198,218, 1)",
      lineWidth: 2,
    });

    /// initial data fetch last 100 entries and set to chart
    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        lastSequenceNumber = (
          parseInt(data[data.length - 1].sequence_number) + 1
        ).toString();
        console.log(lastSequenceNumber);
        const tempData = [];
        const actualData = [];
        data.map((d) => {
          tempData.push(d.data);
        });
        tempData.map((d) => {
          const currData = {
            value:
              parseFloat(d.ltp) *
              (1 +
                (rfFactor *
                  (expiryTime - Math.floor(Number(d.timestamp) / 1000000))) /
                  factor),
            time: Math.floor(Number(d.timestamp) / 1000000),
          };
          actualData.push(currData);
        });
        console.log(actualData);
        areaSeries.setData(actualData);
      })
      .catch((err) => console.log(err));

    limit = 10;
    setInterval(() => {
      url = `https://fullnode.devnet.aptoslabs.com/v1/accounts/${dexModule}/events/${dexModule}::dummycastdefi::OrderBook/set_ltp_event?limit=${limit}&start=${lastSequenceNumber}`;
      fetch(url, options)
        .then((res) => res.json())
        .then((data) => {
          lastSequenceNumber = (
            parseInt(data[data.length - 1].sequence_number) + 1
          ).toString();
          console.log(data[data.length - 1], lastSequenceNumber + "ye last sequa");
          const currData = {
            value:
              parseFloat(data[data.length - 1].data.ltp) *
              (1 +
                (rfFactor *
                  (expiryTime -
                    Math.floor(
                      Number(data[data.length - 1].data.timestamp) / 1000000
                    ))) /
                  factor),
            time: Math.floor(Number(data[0].data.timestamp) / 1000000),
          };
          console.log(currData, 'loda', lastSequenceNumber);
          areaSeries.update(currData);
        })
        .catch((err) => console.log(err));
    }, 1000);
  }, []);

  return <div ref={chartRef} className="h-full w-full"></div>;
}

// const TESTNET_HERMES_ENDPOINT = "https://hermes-beta.pyth.network";

// const testnetConnection = new AptosPriceServiceConnection(
//   TESTNET_HERMES_ENDPOINT
// );
// const APT_USD_TESTNET_PRICE_ID =
//   "0xf9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b";

// const timeGapSec = 10;
// let prevEntry = 0;
// let currEntry = 0;
// testnetConnection.subscribePriceFeedUpdates(
//   [APT_USD_TESTNET_PRICE_ID],
//   (priceFeed) => {
//     const price = priceFeed.getPriceUnchecked();
//     const tempValue = parseFloat(price.getPriceAsNumberUnchecked().toFixed(8));
//     const currentData = {
//       value: tempValue*((1 + (rfFactor*(expiryTime-price.publishTime)/factor))),
//       time: price.publishTime
//     }
//     currEntry = currentData.time;
//     if(prevEntry==0 || currEntry - prevEntry >= timeGapSec)
//     {
//     lineSeries.update(currentData);
//     prevEntry = currEntry
//     }
//     console.log(currentData);
//   }
// );

// embed code
// {
//   const onLoadScriptRef = useRef();

//   useEffect(() => {

//   onLoadScriptRef.current = createWidget;

//   if (!tvScriptLoadingPromise) {
//     tvScriptLoadingPromise = new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.id = "tradingview-widget-loading-script";
//       script.src = "https://s3.tradingview.com/tv.js";
//       script.type = "text/javascript";
//       script.onload = resolve;

//       document.head.appendChild(script);
//     });
//   }

//   tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

//   return () => (onLoadScriptRef.current = null);

//   function createWidget() {
//     if (document.getElementById("tradingview") && "TradingView" in window) {
//       new window.TradingView.widget({
//         autosize: true,
//         symbol: "PYTH:BTCUSD",
//         interval: "D",
//         timezone: "Etc/UTC",
//         theme: "dark",
//         style: "1",
//         locale: "en",
//         toolbar_bg: "#f1f3f6",
//         enable_publishing: false,
//         allow_symbol_change: true,
//         container_id: "tradingview",
//       });
//     }
//   }
// }, []);
// }

// first code
// import { AptosPriceServiceConnection } from "@pythnetwork/pyth-aptos-js";
// // import { Price, PriceFeed } from "@pythnetwork/pyth-common-js";
// import React, {
//   useEffect,
//   useRef,
//   useState,
// } from 'react';
// import { createChart, CrosshairMode } from "lightweight-charts";

// const TESTNET_HERMES_ENDPOINT = "https://hermes-beta.pyth.network";

// // Connection
// const testnetConnection = new AptosPriceServiceConnection(
//   TESTNET_HERMES_ENDPOINT
// );
// const APT_USD_TESTNET_PRICE_ID =
//   "0x44a93dddd8effa54ea51076c4e851b6cbbfd938e82eb90197de38fe8876bb66e";

// let price = 0;

// testnetConnection.subscribePriceFeedUpdates(
//   [APT_USD_TESTNET_PRICE_ID],
//   (priceFeed) => {
//     price = priceFeed.getPriceUnchecked();
//   }
// );

// const Graph = () => {
//   console.log("mae mount ho gay hu");
//   var data = [];
//   useEffect(() => {
//     let count = 0;
//     var intervalId = setInterval(() => {
//       console.log(count);
//       count++;

//       let val = 0;
//       if (price.price != undefined)
//         val = price.getPriceAsNumberUnchecked().toFixed(6);

//       let currentPrice = {
//         value: val,
//         time: Date.now()
//       }
//       console.log(currentPrice);
//       data.push(currentPrice);
//       console.log("data after set interval", data);
//       if (count == 20)
//         clearInterval(intervalId);
//     }, 1000);

//     // const chartOptions = { layout: { textColor: 'black', background: { type: 'solid', color: 'white' } }};
//     // const chart = createChart(document.getElementById("chart"), chartOptions);
//     // const lineSeries = chart.addLineSeries({ color: '#2962FF' });
//     // const chartData = [{ value: 0, time: 1642425322 }, { value: 8, time: 1642511722 }, { value: 10, time: 1642598122 }, { value: 20, time: 1642684522 }, { value: 3, time: 1642770922 }, { value: 43, time: 1642857322 }, { value: 41, time: 1642943722 }, { value: 43, time: 1643030122 }, { value: 56, time: 1643116522 }, { value: 46, time: 1643202922 }];
//     // console.log("inside",data);
//     // lineSeries.setData(chartData);
//     // chart.timeScale().fitContent();
//     // return()=> chart.remove();
//   }, []);
//   return <div id="chart" style={{ width: '100%', height: '300px' }}></div>
// };

// export default Graph;

// const chart = useRef(null);
// useEffect(() => {
//   // chart.current = createChart(chartContainerRef.current, {
//   //   width: window.width,
//   //   height: 300,
//   //   crosshair: {
//   //     mode: CrosshairMode.Normal,
//   //   },
//   //   timeScale: {
//   //     timeVisible: true,
//   //     secondsVisible: true,
//   //   },
//   // });

//   // candleSeries.current = chart.current.addCandlestickSeries();

//   // const data = [
//   //   { time: 1642427876, open: 0, high: 0, low: 0, close: 0 },
//   // ];

//   // candleSeries.current.setData(data);
//   // let lastIndex = data.length - 1;
//   // let currentIndex = lastIndex + 1;
//   // let currentTime = 1642427876;
//   // let ticksInCurrentBar = 0;
//   // let currentBar = {
//   //   open: null,
//   //   high: null,
//   //   low: null,
//   //   close: null,
//   //   time: currentTime,
//   // };

//   // function mergeTickToBar(price) {
//   //   if (currentBar.open === null) {
//   //     currentBar.open = price;
//   //     currentBar.high = price;
//   //     currentBar.low = price;
//   //     currentBar.close = price;
//   //   } else {
//   //     currentBar.close = price;
//   //     currentBar.high = Math.max(currentBar.high, price);
//   //     currentBar.low = Math.min(currentBar.low, price);
//   //   }
//   //   candleSeries.current.update(currentBar);
//   // }

//   function updateChart() {
//     console.log(price);
//     // console.log(parseFloat(price.getPriceAsNumberUnchecked().toFixed(8)));
//     // mergeTickToBar(parseFloat(price.getPriceAsNumberUnchecked().toFixed(8)));

//     // if (++ticksInCurrentBar === 60) {
//     //   currentIndex++;
//     //   currentTime = currentTime + 60;
//     //   currentBar = {
//     //     open: null,
//     //     high: null,
//     //     low: null,
//     //     close: null,
//     //     time: currentTime,
//     //   };
//     //   ticksInCurrentBar = 0;
//     // }
//   }

//   setInterval(updateChart, 1000);

//   return () => chart.current.remove();
// }, []);
