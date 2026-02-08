"use client";
import { Heart, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function ProductActions({ product }: { product: any }) {
  const { toggleWishlist, wishlist } = useWishlist();
  const { addToCart } = useCart();
  
  const isSaved = wishlist.some((item: any) => item._id === product._id);

  return (
    <div className="flex gap-4 mb-10">
      <button 
        onClick={() => addToCart(product)}
        className="flex-1 bg-stone-900 text-white py-4 rounded-full flex items-center justify-center gap-2 hover:bg-stone-800 transition"
      >
        <ShoppingBag size={18} /> Add to Cart
      </button>
      <button 
        onClick={() => toggleWishlist(product)}
        className={`w-14 h-14 border rounded-full flex items-center justify-center transition ${
          isSaved ? "bg-red-50 border-red-200 text-red-500" : "border-stone-200 text-stone-600 hover:bg-stone-50"
        }`}
      >
        <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
      </button>
    </div>
  );
}