import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    _walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
    },
    orderTime: {
      type: Date,
      default: Date.now,
    },
    symbol: {
      type: String,
      require: true,
    },
    position: {
      type: String,
      require: true,
    },
    entryPrice: {
      type: Number,
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

export const History = mongoose.model("History", historySchema);
