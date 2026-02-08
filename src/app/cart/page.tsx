"use client";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, Truck, ShieldCheck, ChevronLeft } from "lucide-react";
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
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return (
    <div className="max-w-7xl mx-auto px-6 py-32 md:py-48 text-center">
      <h1 className="text-3xl md:text-5xl font-serif mb-6 text-stone-900">Your Bag is Empty</h1>
      <p className="text-stone-500 mb-10 max-w-md mx-auto font-light">
        Items you add to your bag will appear here. Find your next Auraé favorite in our collections.
      </p>
      <Link href="/" className="inline-block bg-stone-900 text-white px-10 py-4 rounded-full uppercase text-[10px] tracking-[0.2em] font-bold hover:bg-stone-800 transition shadow-lg">
        Explore Collections
      </Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="flex items-center gap-2 mb-8 group cursor-pointer">
        <Link href="/" className="flex items-center gap-1 text-stone-400 hover:text-stone-900 transition text-xs uppercase tracking-widest">
            <ChevronLeft size={14} /> Continue Shopping
        </Link>
      </div>

      <h1 className="text-4xl md:text-6xl font-serif mb-12 text-stone-900 tracking-tighter">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
        
        {/* LEFT COLUMN: Items and Form */}
        <div className="lg:col-span-2 space-y-16 order-1">
          
          {/* 1. Item List */}
          <section>
            <h2 className="text-xs uppercase tracking-[0.3em] text-stone-400 mb-8 font-bold flex items-center gap-3">
              <span className="w-6 h-6 bg-stone-900 text-white rounded-full flex items-center justify-center text-[10px]">01</span>
              Review Selection
            </h2>
            <div className="space-y-8">
              {cart.map((item: any) => (
                <div key={item._id} className="flex gap-4 md:gap-8 border-b border-stone-100 pb-8 relative group">
                  <div className="w-24 md:w-32 aspect-[3/4] relative bg-stone-50 overflow-hidden rounded-sm">
                    <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm md:text-base font-medium text-stone-900">{item.name}</h3>
                        <p className="text-sm md:text-base font-semibold">₦{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1 italic">{item.category}</p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center border border-stone-200 rounded-full px-4 py-2 gap-6 bg-white shadow-sm">
                        <button type="button" onClick={() => removeFromCart(item._id)} className="text-stone-400 hover:text-stone-900 transition"><Minus size={14} /></button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button type="button" onClick={() => addToCart(item)} className="text-stone-400 hover:text-stone-900 transition"><Plus size={14} /></button>
                      </div>
                      <button type="button" onClick={() => removeFromCart(item._id)} className="text-stone-300 hover:text-red-500 transition-colors p-2">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Shipping Form */}
          <section className="bg-stone-50/50 p-6 md:p-10 rounded-3xl border border-stone-100">
            <h2 className="text-xs uppercase tracking-[0.3em] text-stone-400 mb-8 font-bold flex items-center gap-3">
              <span className="w-6 h-6 bg-stone-900 text-white rounded-full flex items-center justify-center text-[10px]">02</span>
              Delivery Details
            </h2>
            <form id="checkout-form" onSubmit={handleCheckout} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="md:col-span-2">
                <label className="text-[10px] uppercase tracking-widest text-stone-400 ml-2 mb-2 block">Full Name</label>
                <input 
                  required className="w-full p-4 bg-white border border-stone-200 rounded-xl outline-none focus:ring-1 focus:ring-stone-400 transition text-base" 
                  placeholder="Enter your name" 
                  onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-stone-400 ml-2 mb-2 block">Email Address</label>
                <input 
                  required type="email" className="w-full p-4 bg-white border border-stone-200 rounded-xl outline-none focus:ring-1 focus:ring-stone-400 transition text-base" 
                  placeholder="name@example.com" 
                  onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-stone-400 ml-2 mb-2 block">Phone Number</label>
                <input 
                  required type="tel" className="w-full p-4 bg-white border border-stone-200 rounded-xl outline-none focus:ring-1 focus:ring-stone-400 transition text-base" 
                  placeholder="08012345678" 
                  onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] uppercase tracking-widest text-stone-400 ml-2 mb-2 block">Shipping Address</label>
                <input 
                  required className="w-full p-4 bg-white border border-stone-200 rounded-xl outline-none focus:ring-1 focus:ring-stone-400 transition text-base" 
                  placeholder="Street name, Apartment, etc." 
                  onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-stone-400 ml-2 mb-2 block">City</label>
                <input 
                  required className="w-full p-4 bg-white border border-stone-200 rounded-xl outline-none focus:ring-1 focus:ring-stone-400 transition text-base" 
                  placeholder="Lagos" 
                  onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                />
              </div>
              <div className="p-4 bg-white border border-stone-100 text-stone-500 rounded-xl text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-sm">
                <Truck size={16} className="text-stone-900" /> Standard Door-to-Door Delivery
              </div>
            </form>
          </section>
        </div>

        {/* RIGHT COLUMN: Summary (Sticky on Desktop, Order 2 on mobile) */}
        <div className="order-2 lg:sticky lg:top-32 h-fit">
          <div className="bg-white border border-stone-200 p-8 rounded-3xl shadow-sm">
            <h2 className="text-xl font-serif mb-8 text-stone-900">Summary</h2>
            <div className="space-y-5 mb-10">
              <div className="flex justify-between text-stone-500 text-sm">
                <span className="font-light">Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-500 text-sm">
                <span className="font-light">Shipping</span>
                <span className="text-green-600 font-bold text-[10px] uppercase tracking-widest">Calculated at Checkout</span>
              </div>
              <div className="pt-5 border-t border-stone-100 flex justify-between font-bold text-xl text-stone-900">
                <span className="font-serif">Total</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
            </div>

            <button 
              type="submit" 
              form="checkout-form"
              disabled={loading}
              className="w-full bg-stone-900 text-white py-5 rounded-full font-bold uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-stone-800 active:scale-95 transition-all shadow-xl disabled:bg-stone-400"
            >
              {loading ? (
                <span className="animate-pulse">Initializing Secure Payment...</span>
              ) : (
                <>Proceed to Paystack <ArrowRight size={16} /></>
              )}
            </button>

            <div className="mt-8 pt-8 border-t border-stone-50 flex flex-col items-center gap-4">
               <div className="flex items-center gap-6 opacity-30 grayscale transition hover:grayscale-0 cursor-default">
                  <ShieldCheck size={24} />
                  <p className="text-[10px] uppercase tracking-[0.2em] text-center leading-tight">
                    Secure checkout <br/> via Paystack
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}