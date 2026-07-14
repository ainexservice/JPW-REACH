// api/verify-payment.js

import crypto from "crypto";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed"
    });
  }

  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing Payment Details"
      });
    }

    // Generate Signature
    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        razorpay_order_id + "|" + razorpay_payment_id
      )
      .digest("hex");

    // Compare Signature
    if (generatedSignature !== razorpay_signature) {

      return res.status(400).json({
        success: false,
        message: "Payment Verification Failed"
      });

    }

    // Success
    return res.status(200).json({

      success: true,

      verified: true,

      payment_id: razorpay_payment_id,

      order_id: razorpay_order_id,

      message: "Payment Verified Successfully"

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: "Internal Server Error"

    });

  }

}
