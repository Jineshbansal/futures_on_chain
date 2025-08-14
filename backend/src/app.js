import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(bodyParser());

//routes import
import orderbookRouter from "./routes/orderbook.routes.js";
import order from "./routes/order.routes.js";
import history from "./routes/history.routes.js";
import connect from "./routes/connect.routes.js";

//routes declaration
app.use("/api/v1/orderbook", orderbookRouter);
app.use("/api/v1/order", order);
app.use("/api/v1/history", history);
app.use("/api/v1/connect", connect);

export { app };
