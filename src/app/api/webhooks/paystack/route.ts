import { connectToDB } from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    
    // 1. Verify this request actually came from Paystack (Security)
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest("hex");

    if (hash !== req.headers.get("x-paystack-signature")) {
      return NextResponse.json({ error: "Invalid Signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    // 2. If payment was successful, update our database
    if (event.event === "charge.success") {
      await connectToDB();
      const orderId = event.data.metadata.orderId;

      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "Paid",
      });
      
      console.log(`Order ${orderId} has been marked as PAID.`);
    }

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
  }
}