"use client";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, addToCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    setLoading(true);
    // Note: We'll collect the email via a simple prompt for now 
    // In a real app, you'd get this from a form or logged-in user
    const email = window.prompt("Enter your email for the receipt:");
    
    if (!email) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, amount: subtotal, cartItems: cart }),
      });
      const data = await res.json();
      
      if (data.status && data.data.authorization_url) {
        // Redirect to Paystack Payment Page
        window.location.href = data.data.authorization_url;
      } else {
        alert("Payment initialization failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return (
    <div className="max-w-7xl mx-auto px-6 py-40 text-center">
      <h1 className="text-3xl font-serif mb-4">Your Bag is Empty</h1>
      <p className="text-stone-500 mb-8">It looks like you haven't added anything to your collection yet.</p>
      <Link href="/" className="bg-stone-900 text-white px-8 py-3 rounded-full uppercase text-xs tracking-widest">
        Continue Shopping
      </Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-serif mb-12">Shopping Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Left: Cart Items */}
        <div className="lg:col-span-2 space-y-8">
          {cart.map((item: any) => (
            <div key={item._id} className="flex gap-6 border-b border-stone-100 pb-8">
              <div className="w-24 h-32 relative bg-stone-100 rounded">
                <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between">
                    <h3 className="font-medium text-stone-900">{item.name}</h3>
                    <p className="font-semibold">₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                  <p className="text-stone-400 text-xs uppercase tracking-widest mt-1">{item.category}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center border border-stone-200 rounded-full px-3 py-1 gap-4">
                    <button onClick={() => removeFromCart(item._id)}><Minus size={14} /></button>
                    <span className="text-sm">{item.quantity}</span>
                    <button onClick={() => addToCart(item)}><Plus size={14} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item._id)} className="text-stone-400 hover:text-red-500 transition">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Summary */}
        <div className="bg-stone-50 p-8 rounded-2xl h-fit sticky top-32">
          <h2 className="text-xl font-serif mb-6">Order Summary</h2>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Shipping</span>
              <span className="text-xs uppercase tracking-widest text-green-600 font-bold">Calculated at next step</span>
            </div>
            <div className="border-t border-stone-200 pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
          </div>

          <button 
            disabled={loading}
            onClick={handleCheckout}
            className="w-full bg-stone-900 text-white py-4 rounded-full flex items-center justify-center gap-2 hover:bg-stone-800 transition disabled:bg-stone-400"
          >
            {loading ? "Processing..." : "Proceed to Payment"} <ArrowRight size={18} />
          </button>
          
          <p className="text-[10px] text-stone-400 text-center mt-4 uppercase tracking-[0.2em]">
            Secure Checkout powered by Paystack
          </p>
        </div>
      </div>
    </div>
  );
}