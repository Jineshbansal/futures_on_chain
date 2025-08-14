import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Transfer } from "../utils/Transfer.js";

const bids = {};
const asks = {};

const recentTrades = {};

const marketorder = asyncHandler(async (req, res) => {
  const side = req.body.side; //ask or bid
  const price = req.body.price;
  const quantity = req.body.quantity;
  const walletId = req.body.walletId;
  const pair = req.params.pair;

  if (!bids[pair]) {
    bids[pair] = [];
  }

  if (!asks[pair]) {
    asks[pair] = [];
  }

  const remainingQty = FillOrderForMarketOrder(
    side,
    pair,
    price,
    quantity,
    walletId
  );

  if (remainingQty === 0) {
    res.json({
      filledQuantity: quantity,
    });
    return;
  }

  if (side === "bid") {
    bids[pair].push({
      walletId,
      price,
      quantity,
    });
    bids[pair].sort((a, b) => b.price - a.price);
  } else {
    asks[pair].push({
      walletId,
      price,
      quantity,
    });
    asks[pair].sort((a, b) => a.price - b.price);
  }

  res.json({
    filledQuantity: quantity - remainingQty,
  });
});

const limitorder = asyncHandler(async (req, res) => {
  const side = req.body.side; //ask or bid
  const price = req.body.price;
  const quantity = req.body.quantity;
  const walletId = req.body.walletId;
  const pair = req.params.pair;

  if (!bids[pair]) {
    bids[pair] = [];
  }

  if (!asks[pair]) {
    asks[pair] = [];
  }

  const remainingQty = FillOrderForLimitOrder(
    side,
    pair,
    price,
    quantity,
    walletId
  );

  if (remainingQty === 0) {
    res.json({
      filledQuantity: quantity,
    });
    return;
  }

  if (side === "bid") {
    bids[pair].push({
      walletId,
      price,
      quantity,
    });
    bids[pair].sort((a, b) => b.price - a.price);
  } else {
    asks[pair].push({
      walletId,
      price,
      quantity,
    });
    asks[pair].sort((a, b) => a.price - b.price);
  }

  res.json({
    filledQuantity: quantity - remainingQty,
  });
});

const depth = asyncHandler(async (req, res) => {
  const pair = req.params.pair;
  const depth = {};

  if (!bids[pair]) {
    bids[pair] = [];
  }

  if (!asks[pair]) {
    asks[pair] = [];
  }

  for (let i = 0; i < bids[pair].length; i++) {
    if (!depth[bids[pair][i].price]) {
      depth[bids[pair][i].price] = {
        type: "bid",
        quantity: bids[pair][i].quantity,
      };
    } else {
      depth[bids[pair][i].price].quantity += bids[pair][i].quantity;
    }
  }

  for (let i = 0; i < asks[pair].length; i++) {
    if (!depth[asks[pair][i].price]) {
      depth[asks[pair][i].price] = {
        type: "ask",
        quantity: asks[pair][i].quantity,
      };
    } else {
      depth[asks[pair][i].price].quantity += asks[pair][i].quantity;
    }
  }

  res.json({
    depth,
  });
});

const recent = asyncHandler(async (req, res) => {
  const pair = req.params.pair;

  if (!recentTrades[pair]) {
    recentTrades[pair] = [];
  }

  res.json({
    recentTrades,
  });
});

function FillOrderForMarketOrder(side, pair, price, quantity, walletId) {
  let remainingQty = quantity;

  if (side === "bid") {
    for (let i = 0; i < asks[pair].length; i++) {
      if (asks[pair][i].quantity > remainingQty) {
        Transfer(); //Web3 part
        asks[pair][i].quantity -= remainingQty;
        remainingQty = 0;
      } else {
        Transfer(); //Web3 Part
        remainingQty -= asks[pair][i].quantity;
        asks[pair].shift();
      }
    }
  } else {
    for (let i = 0; i < bids[pair].length; i++) {
      if (bids[pair][i].quantity > remainingQty) {
        Transfer(); //Web3 Part
        bids[pair][i].quantity -= remainingQty;
        remainingQty = 0;
      } else {
        Transfer(); //Web3 Part
        remainingQty -= bids[pair][i].quantity;
        bids[pair].shift();
      }
    }
  }

  return remainingQty;
}

function FillOrderForLimitOrder(side, pair, price, quantity, walletId) {
  let remainingQty = quantity;

  if (side === "bid") {
    for (let i = 0; i < asks[pair].length; i++) {
      if (asks[pair][i].price > price) {
        continue;
      }
      if (asks[pair][i].quantity > remainingQty) {
        Transfer(); //Web3 part
        asks[pair][i].quantity -= remainingQty;
        remainingQty = 0;
      } else {
        Transfer(); //Web3 Part
        remainingQty -= asks[pair][i].quantity;
        asks[pair].shift();
      }
    }
  } else {
    for (let i = 0; i < bids[pair].length; i++) {
      if (bids[pair][i].price < price) {
        continue;
      }
      if (bids[pair][i].quantity > remainingQty) {
        Transfer(); //Web3 Part
        bids[pair][i].quantity -= remainingQty;
        remainingQty = 0;
      } else {
        Transfer(); //Web3 Part
        remainingQty -= bids[pair][i].quantity;
        bids[pair].shift();
      }
    }
  }

  return remainingQty;
}

export { marketorder, limitorder, depth, recent };
