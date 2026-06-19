const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorPayInstance = require("../utils/razorpay");
const Payment = require("../models/payments");
const { membershipFee } = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const { UserModel } = require("../models/user");

paymentRouter.post("/payment/createOrder", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName } = req.user;

    const order = await razorPayInstance.orders.create({
      amount: membershipFee[membershipType] * 100, // amount in paise
      currency: "INR",
      receipt: "Receipt_1",
      notes: {
        firstName: firstName,
        lastName: lastName,
        membershipType: membershipType,
      },
    });

    const payment = new Payment({
      orderId: order.id,
      userId: req.user._id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savePayment = await payment.save();

    res.json({ ...savePayment.toJSON(), keyId: process.env.RAZOR_PAY_KEY });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSecret = process.env.RAZOR_PAY_WEBHOOK_SECRET;
    const webhookSignature = req.headers["x-razorpay-signature"];
    const isValidWebhook = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      webhookSecret
    );

    if (!isValidWebhook) {
      return res.status(400).send("Invalid webhook signature");
    }

    const paymentDetails = req.body.payload.payment.entity;
    //mark payment status as per the razorpay response
    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();

    //mark user as premium if the payment was successful

    const user = await UserModel.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = paymentDetails.notes.membershipType;

    await user.save();

    // if (req.body.event == "payment.captured") {
    // }
    // if (req.body.event == "payment.failed") {
    // }

    return res.status(200).json({ message: "Webhook received successfully!" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
  try {
    const user = req.user.toJSON();
    res.json({
      isPremium: user.isPremium,
      membershipType: user.membershipType,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = paymentRouter;
