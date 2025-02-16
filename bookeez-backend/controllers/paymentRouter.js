import express from "express";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import verifyToken from "../utils/verifyToken.js";

import User from "../models/userModel.js";
import Template from "../models/templateModel.js";
import mongoose from "mongoose";
import Payment from "../models/paymentModel.js";
dotenv.config();

export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

const paymentRouter = express.Router();

paymentRouter.post('/order', verifyToken, async (req, res) => {
    console.log("im at here");
    const options = {
        amount: req.body.amount * 100,
        currency: req.body.currency,
        receipt: "any unique id for every order",
        payment_capture: 1
    };
    try {
        const response = await razorpay.orders.create(options);

        res.json({
            order_id: response.id,
            currency: response.currency,
            amount: response.amount,
            keyId: razorpay.key_id
        })
    } catch (err) {
        console.log(err);
        res.status(400).send('Not able to create order. Please try again!');
    }
});

paymentRouter.post("/paid", verifyToken, async (req, res) => {
    try {
        const data = req.body;


        if (!mongoose.Types.ObjectId.isValid(data.bookId)) {
            return res.status(400).json({ error: "Invalid bookId provided" });
        }

        if (data.amount || data.paymentId) {
            const payment = new Payment({
                paymentId: data.paymentId,
                amount: data.amount,
                userId: req.userId,
                templateId: data.templateId || "",
                bookId: data.bookId || "",
            });
            const payyment = await payment.save();
            console.log("payment, ", payyment);
        }

        const user = await User.findById(req.userId);
        const template = await Template.findById(data.templateId);

        const book = template.books.find((book) => book._id.equals(data.bookId));

        if (book) {
            user.books.push(book);
            const updatedUser = await user.save();
            console.log("user,", updatedUser);
        }

        const updatedBooks = template.books.filter((book) => !book._id.equals(data.bookId));

        template.books = updatedBooks;
        await template.save();

        res.status(200).json({ message: "Payment added" });
    } catch (error) {
        console.log("err", error);
        res.status(500).send("Not able to create payment. Please try again!");
    }
});

paymentRouter.get("/", async (req, res) => {
    try {
        const payments = await Payment.find();
        console.log("payments,", payments);
        res.status(200).json({ payments })
    } catch (error) {
        res.status(500).send('Couldnt fetch items. Please try again!');
    }
})

export default paymentRouter;