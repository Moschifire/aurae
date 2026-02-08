import { connectToDB } from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { shippingInfo, amount, cartItems } = await req.json();

    // 1. Create the order in our database first
    const newOrder = await Order.create({
      customer: shippingInfo,
      items: cartItems.map((item: any) => ({
        productId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.images[0]
      })),
      totalAmount: amount,
      paymentStatus: "Pending",
    });

    // 2. Initialize Paystack Transaction
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: shippingInfo.email,
        amount: amount * 100,
        callback_url: `${process.env.NEXTAUTH_URL}/checkout/success`,
        metadata: {
          orderId: newOrder._id.toString(), // Save our DB Order ID in Paystack metadata
        },
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}