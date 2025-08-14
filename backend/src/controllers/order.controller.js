import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const order = asyncHandler(async (req, res) => {
  const walletId = req.params.walletId;

  res.json({
    walletId,
  });
});

export { order };
