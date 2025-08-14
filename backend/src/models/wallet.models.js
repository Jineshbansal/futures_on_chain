import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    walletId: {
      type: String,
      require: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Wallet = mongoose.model("Wallet", walletSchema);
