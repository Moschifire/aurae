"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Heart, User } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  // Don't show the main navbar on admin pages
  if (pathname.startsWith("/admin") || pathname === "/login") return null;

  const categories = [
    { name: "AuraéSkin", href: "/shop/skin" },
    { name: "AuraéBeauty", href: "/shop/beauty" },
    { name: "AuraéAdorn", href: "/shop/adorn" },
    { name: "AuraéLiving", href: "/shop/living" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-serif tracking-tighter font-bold">
          AURAÉ
        </Link>

        {/* Categories */}
        <div className="hidden md:flex gap-8">
          {categories.map((cat) => (
            <Link key={cat.href} href={cat.href} className="text-xs uppercase tracking-widest hover:text-stone-500 transition">
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="flex gap-5 items-center">
          <Link href="/wishlist"><Heart size={20} className="text-stone-700" /></Link>
          <Link href="/cart" className="relative">
            <ShoppingBag size={20} className="text-stone-700" />
            <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">0</span>
          </Link>
          <Link href="/login"><User size={20} className="text-stone-700" /></Link>
        </div>
      </div>
    </nav>
  );
}