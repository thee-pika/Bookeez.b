import express from "express";
import cors from "cors";
import connectMongoDB from "./utils/connectMongoDB.js";
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import templateRouter from "./controllers/templateRouter.js";
import bookRouter from "./controllers/bookRouter.js";
import cartRouter from "./controllers/cartRouter.js";
import userRouter from "./controllers/authRoute.js";
// import verifyRouter from "./controllers/verifyRoute.js";
import paymentRouter from "./controllers/paymentRouter.js";
// import notifyRouter from "./controllers/notificationController.js";

const app = express();

dotenv.config();
// Middleware
app.use(cors());
app.use(express.json());

app.use(bodyParser.json()); 

app.use("/api/",templateRouter)
app.use("/api/template",bookRouter)
app.use("/api/user",cartRouter)
app.use("/api/payment", paymentRouter)
app.use("/auth",userRouter)
// app.use("/verify",verifyRouter);


// app.use("/notification", notifyRouter)
// Sample Route

app.get("/", (req, res) => {
  res.send("Welcome to the Bookeez Backend!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  connectMongoDB()
});
