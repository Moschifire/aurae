"use client";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, Truck, CreditCard } from "lucide-react";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  const subtotal = cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          shippingInfo, 
          amount: subtotal, 
          cartItems: cart 
        }),
      });
      const data = await res.json();
      
      if (data.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
      } else {
        alert("Payment initialization failed. Please check your connection.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return (
    <div className="max-w-7xl mx-auto px-6 py-40 text-center">
      <h1 className="text-3xl font-serif mb-4">Your Bag is Empty</h1>
      <p className="text-stone-500 mb-8">Items you add to your bag will appear here.</p>
      <Link href="/" className="bg-stone-900 text-white px-8 py-3 rounded-full uppercase text-xs tracking-widest font-bold">
        Continue Shopping
      </Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-serif mb-12 text-stone-900">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* LEFT COLUMN: Items and Form */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* 1. Item List */}
          <section>
            <h2 className="text-xl font-serif mb-6 flex items-center gap-2">
              <span className="w-7 h-7 bg-stone-900 text-white rounded-full flex items-center justify-center text-xs">1</span>
              Review Selection
            </h2>
            <div className="space-y-6">
              {cart.map((item: any) => (
                <div key={item._id} className="flex gap-6 border-b border-stone-100 pb-6 group">
                  <div className="w-20 h-28 relative bg-stone-50 overflow-hidden rounded">
                    <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-stone-900">{item.name}</h3>
                        <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">{item.category}</p>
                      </div>
                      <p className="text-sm font-semibold">₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-6">
                      <div className="flex items-center border border-stone-200 rounded-full px-3 py-1 gap-4">
                        <button type="button" onClick={() => removeFromCart(item._id)} className="hover:text-stone-400"><Minus size={12} /></button>
                        <span className="text-xs font-bold">{item.quantity}</span>
                        <button type="button" onClick={() => addToCart(item)} className="hover:text-stone-400"><Plus size={12} /></button>
                      </div>
                      <button type="button" onClick={() => removeFromCart(item._id)} className="text-stone-300 hover:text-red-500 transition">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Shipping Form */}
          <section className="bg-stone-50 p-8 rounded-2xl border border-stone-100">
            <h2 className="text-xl font-serif mb-6 flex items-center gap-2">
              <span className="w-7 h-7 bg-stone-900 text-white rounded-full flex items-center justify-center text-xs">2</span>
              Shipping Information
            </h2>
            <form id="checkout-form" onSubmit={handleCheckout} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <input 
                  required className="w-full p-3 bg-white border border-stone-200 rounded-lg outline-none focus:ring-1 focus:ring-stone-400" 
                  placeholder="Full Name" 
                  onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})}
                />
              </div>
              <input 
                required type="email" className="p-3 bg-white border border-stone-200 rounded-lg outline-none focus:ring-1 focus:ring-stone-400" 
                placeholder="Email Address" 
                onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
              />
              <input 
                required type="tel" className="p-3 bg-white border border-stone-200 rounded-lg outline-none focus:ring-1 focus:ring-stone-400" 
                placeholder="Phone Number" 
                onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
              />
              <div className="col-span-2">
                <input 
                  required className="w-full p-3 bg-white border border-stone-200 rounded-lg outline-none focus:ring-1 focus:ring-stone-400" 
                  placeholder="Street Address" 
                  onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                />
              </div>
              <input 
                required className="p-3 bg-white border border-stone-200 rounded-lg outline-none focus:ring-1 focus:ring-stone-400" 
                placeholder="City" 
                onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
              />
              <div className="p-3 bg-stone-100 text-stone-500 rounded-lg text-sm flex items-center gap-2">
                <Truck size={16} /> Standard Delivery
              </div>
            </form>
          </section>
        </div>

        {/* RIGHT COLUMN: Sticky Summary */}
        <div className="h-fit lg:sticky lg:top-32">
          <div className="bg-white border border-stone-200 p-8 rounded-2xl shadow-sm">
            <h2 className="text-xl font-serif mb-6 pb-4 border-b border-stone-100">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-stone-600 text-sm">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-600 text-sm">
                <span>Shipping</span>
                <span className="text-green-600 font-bold text-[10px] uppercase tracking-widest">Free</span>
              </div>
              <div className="pt-4 border-t border-stone-100 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
            </div>

            <button 
              type="submit" 
              form="checkout-form"
              disabled={loading}
              className="w-full bg-stone-900 text-white py-4 rounded-full font-bold uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-stone-800 transition disabled:bg-stone-400"
            >
              {loading ? "Processing..." : "Complete Purchase"} <ArrowRight size={14} />
            </button>

            <div className="mt-6 flex items-center justify-center gap-4 opacity-50 grayscale">
               <CreditCard size={20} />
               <p className="text-[9px] uppercase tracking-widest leading-none">Secure Payment via Paystack</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}