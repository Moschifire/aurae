import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      quantity: Number,
      price: Number,
      image: String,
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, default: "Pending" }, // Pending, Paid, Failed
  orderStatus: { type: String, default: "Processing" }, // Processing, Shipped, Delivered
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export default Order;