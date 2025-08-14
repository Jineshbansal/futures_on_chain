import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Wallet } from "../models/wallet.models.js";

const connect = asyncHandler(async (req, res) => {
  const walletId = req.params.walletId;

  const wallet = await Wallet.findOne({
    walletId: walletId,
  });

  if (!wallet) {
    const createWallet = await Wallet.create({ walletId: walletId });
    res.json({
      createWallet,
    });
    return;
  }

  res.json({
    wallet,
  });
});

export { connect };
