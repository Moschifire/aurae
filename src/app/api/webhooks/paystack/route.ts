import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDB } from "@/lib/db";
import Order from "@/models/Order";
import { Resend } from "resend";
import { OrderEmail } from "@/components/emails/OrderEmail";

export const dynamic = "force-dynamic";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  console.log("🔔 Paystack Webhook Attempt Received");

  try {
    // 1. Get raw body for signature verification
    const body = await req.text();
    
    // 2. Verify the Paystack Signature
    const signature = req.headers.get("x-paystack-signature");
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      console.error("❌ SECURITY ALERT: Invalid Webhook Signature");
      return NextResponse.json({ error: "Invalid Signature" }, { status: 400 });
    }

    // 3. Parse the event
    const event = JSON.parse(body);
    console.log("✅ Paystack Event Verified:", event.event);

    // 4. Process Successful Payment
    if (event.event === "charge.success") {
      await connectToDB();

      // Retrieve the orderId from metadata
      const orderId = event.data.metadata.orderId;
      console.log("📦 Processing Order ID:", orderId);

      // Update Order Status in Database
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { paymentStatus: "Paid" },
        { new: true } // Return the updated document
      );

      if (updatedOrder) {
        console.log("💰 Database Updated: Order marked as PAID");

        // 5. Send Confirmation Email to Customer
        try {
          // IMPORTANT: Use JSX <OrderEmail /> instead of a function call
          await resend.emails.send({
            from: "Auraé Beauty <onboarding@resend.dev>", 
            to: updatedOrder.customer.email,
            subject: `Your Auraé Order Confirmation - #${updatedOrder._id.toString().slice(-6)}`,
            react: OrderEmail({ order: updatedOrder }), 
          });
          console.log(`📧 Customer email queued for: ${updatedOrder.customer.email}`);
        } catch (emailErr: any) {
          console.error("✉️ Customer email failed:", emailErr.message);
        }

        // 6. Send Notification Email to Admin
        try {
          await resend.emails.send({
            from: "Auraé System <onboarding@resend.dev>",
            to: process.env.ADMIN_EMAIL!,
            subject: "💰 NEW SALE ALERT",
            html: `
              <div style="font-family: sans-serif; padding: 20px;">
                <h2 style="color: #1a1a1a;">New Paid Order Received</h2>
                <hr style="border: 0; border-top: 1px solid #eee;" />
                <p><strong>Customer:</strong> ${updatedOrder.customer.name}</p>
                <p><strong>Amount:</strong> ₦${updatedOrder.totalAmount.toLocaleString()}</p>
                <p><strong>Items:</strong> ${updatedOrder.items.length} product(s)</p>
                <br/>
                <a href="${process.env.NEXTAUTH_URL}/admin/orders" 
                   style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                   View Order Details
                </a>
              </div>
            `,
          });
          console.log("📢 Admin notification sent");
        } catch (adminErr: any) {
          console.error("⚠️ Admin notification failed:", adminErr.message);
        }
      } else {
        console.warn("⚠️ Order ID not found in database during webhook processing.");
      }
    }

    // Always return 200 to Paystack
    return NextResponse.json({ status: "success" }, { status: 200 });

  } catch (error: any) {
    console.error("🔥 Webhook Handler Error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}