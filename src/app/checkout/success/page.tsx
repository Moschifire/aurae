"use client";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart when they arrive here successfully
    clearCart();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-40 text-center">
      <div className="flex justify-center mb-6 text-green-500">
        <CheckCircle size={80} />
      </div>
      <h1 className="text-4xl font-serif mb-4">Your Auraé order is confirmed!</h1>
      <p className="text-stone-500 mb-10 max-w-md mx-auto">
        Thank you for your purchase. We are preparing your order and will send a tracking link to your email shortly.
      </p>
      <Link href="/" className="bg-stone-900 text-white px-10 py-4 rounded-full uppercase text-xs tracking-widest font-bold">
        Back to Shop
      </Link>
    </div>
  );
}