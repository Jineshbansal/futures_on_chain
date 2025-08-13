import { AptosPriceServiceConnection } from "@pythnetwork/pyth-aptos-js";
import { Price, PriceFeed } from "@pythnetwork/pyth-common-js";
import React, {
	useEffect,
	useRef,
	useState,
} from 'react';
import { createChart, CrosshairMode } from "lightweight-charts";

// Please read https://docs.pyth.network/documentation/pythnet-price-feeds before building on Pyth

// Rpc endpoint
const TESTNET_HERMES_ENDPOINT = "https://hermes-beta.pyth.network";

// Connection
const testnetConnection = new AptosPriceServiceConnection(
  TESTNET_HERMES_ENDPOINT
); // Price service client used to retrieve the offchain VAAs to update the onchain price

// Price id : this is not an aptos account but instead an opaque identifier for each price https://pyth.network/developers/price-feed-ids/#pyth-cross-chain-testnet
const APT_USD_TESTNET_PRICE_ID =
  "0x44a93dddd8effa54ea51076c4e851b6cbbfd938e82eb90197de38fe8876bb66e";

// Aptos modules : These are testnet addresses https://docs.pyth.network/documentation/pythnet-price-feeds/aptos
const MINT_NFT_MODULE =
  "0xf648c59bd59473c5a27721babdb451d64a63392850d0f7bf5fb2c4c21a9049d0";


export const Graph  = () => {
  const chartContainerRef = useRef(null);
  const chart = useRef(null);
  const candleSeries = useRef(null);

  const [pythOffChainPrice, setPythOffChainPrice] = React.useState();
  // Subscribe to offchain prices. These are the prices that a typical frontend will want to show.
  testnetConnection.subscribePriceFeedUpdates(
    [APT_USD_TESTNET_PRICE_ID],
    (priceFeed) => {
      const price = priceFeed.getPriceUnchecked(); // Fine to use unchecked (not checking for staleness) because this must be a recent price given that it comes from a websocket subscription.
      setPythOffChainPrice(price);
    }
  );

  const [dps, setDps] = useState(0);

  useEffect(() => {
    chart.current = createChart(chartContainerRef.current, {
      width: window.width,
      height: 300,
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
    });

    candleSeries.current = chart.current.addCandlestickSeries();

    const data = [
      { time: 1642427876, open: 54.62, high: 55.5, low: 54.52, close: 54.9 },
    ];

    candleSeries.current.setData(data);

    const lastClose = data[data.length - 1].close;
    let lastIndex = data.length - 1;

    const targetIndex = lastIndex + 105 + Math.round(Math.random() + 30);
    const targetPrice = getRandomPrice();

    let currentIndex = lastIndex + 1;
    let currentTime = 1642427876;
    let ticksInCurrentBar = 0;
    let currentBar = {
      open: null,
      high: null,
      low: null,
      close: null,
      time: currentTime,
    };

    function mergeTickToBar(price) {
      if (currentBar.open === null) {
        currentBar.open = price;
        currentBar.high = price;
        currentBar.low = price;
        currentBar.close = price;
      } else {
        currentBar.close = price;
        currentBar.high = Math.max(currentBar.high, price);
        currentBar.low = Math.min(currentBar.low, price);
      }
      candleSeries.current.update(currentBar);
    }

    function getRandomPrice() {
      return 10 + Math.round(Math.random() * 10000) / 100;
    }

    function updateChart() {
      // const deltaY = targetPrice - lastClose;
      // const deltaX = targetIndex - lastIndex;
      // const angle = deltaY / deltaX;
      // const basePrice = lastClose + (currentIndex - lastIndex) * angle;
      // const noise = 0.9 + Math.random() * 0.1;
      // const noisedPrice = basePrice * noise;

      let price = pythOffChainPrice;
      if(!price) price=0;
      // console.log(price.getPriceAsNumberUnchecked());
      let val=0;
      if(price) val = parseFloat(price.getPriceAsNumberUnchecked().toFixed(3));

      setDps((dps) => val);
      console.log(dps);

      mergeTickToBar(val);

      if (++ticksInCurrentBar === 10) {
        currentIndex++;
        currentTime = currentTime + 60;
        currentBar = {
          open: null,
          high: null,
          low: null,
          close: null,
          time: currentTime,
        };
        ticksInCurrentBar = 0;
      }
    }

    const intervalId = setInterval(updateChart, 1000);

    return () => chart.current.remove();
  }, []); // Empty dependency array means this effect runs once after the initial render

  return <div ref={chartContainerRef} />;
};

export default Graph;
