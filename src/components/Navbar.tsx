"use client";
import { useState } from "react";
import { ShoppingBag, Heart, User, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { wishlist } = useWishlist();
  const { cart } = useCart();

  if (pathname.startsWith("/admin") || pathname === "/login") return null;

  const categories = [
    { name: "AuraéSkin", href: "/shop/skin" },
    { name: "AuraéBeauty", href: "/shop/beauty" },
    { name: "AuraéAdorn", href: "/shop/adorn" },
    { name: "AuraéLiving", href: "/shop/living" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        
        {/* Mobile Menu Toggle */}
        <button onClick={() => setIsOpen(true)} className="md:hidden p-2">
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Link href="/" className="text-xl md:text-2xl font-serif font-bold tracking-tighter">
          AURAÉ
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8">
          {categories.map((cat) => (
            <Link key={cat.href} href={cat.href} className="text-[10px] uppercase tracking-widest hover:text-stone-500 transition">
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="flex gap-3 md:gap-5 items-center">
          <Link href="/wishlist" className="relative p-2">
            <Heart size={20} />
            {wishlist.length > 0 && <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] w-3 h-3 flex items-center justify-center rounded-full">{wishlist.length}</span>}
          </Link>
          <Link href="/cart" className="relative p-2">
            <ShoppingBag size={20} />
            {cart.length > 0 && <span className="absolute top-1 right-1 bg-black text-white text-[8px] w-3 h-3 flex items-center justify-center rounded-full">{cart.length}</span>}
          </Link>
        </div>
      </div>

      {/* MOBILE OVERLAY MENU */}
      <div className={`fixed inset-0 bg-white z-[60] transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}>
        <div className="p-6">
          <button onClick={() => setIsOpen(false)} className="mb-10"><X size={28} /></button>
          <div className="flex flex-col gap-8">
            {categories.map((cat) => (
              <Link key={cat.href} href={cat.href} onClick={() => setIsOpen(false)} className="text-3xl font-serif">
                {cat.name}
              </Link>
            ))}
            <hr className="border-stone-100" />
            <Link href="/login" onClick={() => setIsOpen(false)} className="text-sm uppercase tracking-widest flex items-center gap-2">
              <User size={18} /> Account
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}