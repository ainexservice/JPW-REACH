import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed"
    });
  }

  try {

    const { amount } = req.body || {};

    const order = await razorpay.orders.create({
      amount: amount || 1500,
      currency: "INR",
      receipt: `JPW_${Date.now()}`,
      notes: {
        service: "JPW Reach",
        company: "AINEX SERVICES"
      }
    });

    return res.status(200).json(order);

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message || "Order Creation Failed"
    });

  }

}
