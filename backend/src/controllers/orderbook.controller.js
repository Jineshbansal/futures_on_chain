import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { FillOrder } from "../utils/FillOrder.js";

const bids = {};
const asks = {};

const order = asyncHandler(async (req, res) => {
  const side = req.body.side; //ask or bid
  const price = req.body.price;
  const quantity = req.body.quantity;
  const userId = req.body.userId;
  const pair = req.params.Pair;

  const remainingQty = FillOrder(side, price, quantity, userId);

  if (!bids[pair]) {
    bids[pair] = [];
  }

  if (!asks[pair]) {
    asks[pair] = [];
  }

  if (remainingQty === 0) {
    res.json({
      filledQuantity: quantity,
    });
    return;
  }

  if (side === "bid") {
    bids[pair].push({
      userId,
      price,
      quantity,
    });
    bids[pair].sort((a, b) => a.price - b.price);
  } else {
    asks[pair].push({
      userId,
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
  const pair = req.params.Pair;
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

export { order, depth };
